import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "node-appwrite";
import z from "zod";
import { verifyAnalyticsPayload } from "../../-actions";

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

          // if (cached) {
          //   return new Response(JSON.stringify(cached), {
          //     headers: {
          //       "Content-Type": "application/json",
          //       "Cache-Control": "max-age=60",
          //     },
          //   });
          // }

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
console.log({events,websiteId})
          // Group events by referrerExtraDetail with referrer domain
          const linkMap = new Map<
            string,
            {
              extraDetail: string;
              visitors: number;
              revenue: number;
            }
          >();

          for (const event of events) {
            const link = event.referrerExtraDetail;
            if (!link || !event.referrer) continue;

            // Use referrer + extraDetail as key with protocol
            const key = `https://${event.referrer}/${link}`;

            if (!linkMap.has(key)) {
              linkMap.set(key, {
                extraDetail: link,
                visitors: 0,
                revenue: 0,
              });
            }

            const linkData = linkMap.get(key)!;
            linkData.visitors += 1;
            
            // Fetch revenues for all relevant sessions
            const revenuesRes = await database.listRows({
              databaseId,
              tableId: "revenues",
              queries: [
                Query.equal("website", websiteId),
                Query.greaterThan(
                  "$createdAt",
                  new Date(timestamp).toISOString()
                ),
                Query.equal("sessionId", event.sessionId),
                Query.equal("visitorId", event.visitorId),
                Query.select(["revenue"]),

              ],
            });
            for (const revenueEntry of revenuesRes.rows) {
              linkData.revenue += revenueEntry.revenue || 0;
            }
          }

          // Aggregate metrics by link
          const linksData: Metric[] = [];

          for (const [key, data] of linkMap.entries()) {
            linksData.push({
              label: key, // This is now "referrer/extraDetail"
              visitors: data.visitors,
              revenue: data.revenue,
            });
          }

          // Sort by visitors descending
          linksData.sort((a, b) => b.visitors - a.visitors);

          const result = JSON.stringify({
            dataset: linksData,
          });

          // await redis?.set(cacheKey, result);

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
