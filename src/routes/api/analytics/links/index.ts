import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "node-appwrite";
import z from "zod";
import { verifyAnalyticsPayload } from "../../-actions";
import { getRedis } from "@/configs/redis";

type Metric = {
  label: string;
  visitors: number;
  revenue: number;
};

export const Route = createFileRoute("/api/analytics/links/")({
  validateSearch: z.object({
    userId: z.string().min(1),
    events: z.boolean(),
  }),
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { timestamp, websiteId } =
            await verifyAnalyticsPayload(request);

          const redis = await getRedis();
          const cacheKey = `links-${websiteId}-${timestamp}`;
          const cached = await redis?.get(cacheKey);
          if (cached) {
            return new Response(JSON.stringify(cached), {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "max-age=60",
              },
            });
          }

          // Fetch all events with referrerExtraDetail
          const eventsRes = await database.listRows({
            databaseId,
            tableId: "events",
            queries: [
              Query.equal("website", websiteId),
              Query.greaterThan(
                "$createdAt",
                new Date(timestamp).toISOString()
              ),
              Query.isNotNull("referrerExtraDetail"),
              Query.isNotNull("referrer"),
            ],
          });

          const events = eventsRes.rows;

          const linkMap = new Map<
            string,
            {
              extraDetail: string;
              visitors: number;
              sessionPairs: Set<string>;
            }
          >();

          for (const event of events) {
            const link = event.referrerExtraDetail;
            if (!link || !event.referrer) continue;

            const key = `https://${event.referrer}/${link}`;

            if (!linkMap.has(key)) {
              linkMap.set(key, {
                extraDetail: link,
                visitors: 0,
                sessionPairs: new Set(),
              });
            }

            const linkData = linkMap.get(key)!;
            linkData.visitors += 1;
            linkData.sessionPairs.add(`${event.sessionId}:${event.visitorId}`);
          }

          // Fetch all revenues for the relevant website and period once
          const allRevenuesRes = await database.listRows({
            databaseId,
            tableId: "revenues",
            queries: [
              Query.equal("website", websiteId),
              Query.greaterThan(
                "$createdAt",
                new Date(timestamp).toISOString()
              ),
              Query.select(["sessionId", "visitorId", "revenue"]),
              Query.limit(5000), // Adjust limit based on expected volume
            ],
          });

          // Map revenues by sessionId:visitorId
          const revenueBySessionMap = new Map<string, number>();
          for (const revenueEntry of allRevenuesRes.rows) {
            const pairKey = `${revenueEntry.sessionId}:${revenueEntry.visitorId}`;
            const currentRevenue = revenueBySessionMap.get(pairKey) || 0;
            revenueBySessionMap.set(
              pairKey,
              currentRevenue + (revenueEntry.revenue || 0)
            );
          }

          // Aggregate metrics by link
          const linksData: Metric[] = [];

          for (const [key, data] of linkMap.entries()) {
            let totalRevenue = 0;
            for (const pairKey of data.sessionPairs) {
              totalRevenue += revenueBySessionMap.get(pairKey) || 0;
            }

            linksData.push({
              label: key,
              visitors: data.visitors,
              revenue: totalRevenue,
            });
          }

          // Sort by visitors descending
          linksData.sort((a, b) => b.visitors - a.visitors);

          const result = JSON.stringify({
            dataset: linksData,
          });

          await redis?.set(cacheKey, result);

          return new Response(result, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
