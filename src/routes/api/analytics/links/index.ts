import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "node-appwrite";
import z from "zod";
import { resolveTwitterLink, verifyAnalyticsPayload } from "../../-actions";
import { getRedis } from "@/configs/redis";

type Metric = {
  label: string;
  visitors: number;
  revenue: number;
  imageUrl: string;
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
            console.log(`[links] Cache HIT for key: ${cacheKey}`);
            return new Response(typeof cached === 'string' ? cached : JSON.stringify(cached), {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "max-age=60",
              },
            });
          }
          console.log(`[links] Cache MISS for key: ${cacheKey}`);

          // Fetch all link visits from the dedicated links table
          const linksRes = await database.listRows({
            databaseId,
            tableId: "links",
            queries: [
              Query.equal("website", websiteId),
              Query.greaterThan(
                "$createdAt",
                new Date(timestamp).toISOString()
              ),
            ],
          });

          const links = linksRes.rows;
          const website = await database.getRow({
            databaseId,
            rowId: websiteId,
            tableId: "websites",
          });

          const linkMap = new Map<
            string,
            {
              extraDetail: string;
              visitors: number;
              sessionPairs: Set<string>;
            }
          >();

          // Collect unique t.co links that need resolution
          // Detect via `link` starting with t.co/ OR via `extraDetail` being a t.co path with no tweetId
          const tCoLinks = new Set<string>();
          for (const linkEntry of links) {
            const link = linkEntry.link || "";
            const extra = linkEntry.extraDetail || "";
            const hasTweet = !!linkEntry.tweetId;
            const isResolved = link.startsWith("x.com/") || hasTweet;

            if (isResolved) continue;

            if (link.startsWith("t.co/")) {
              tCoLinks.add(link);
            } else if (extra && !hasTweet && extra !== link) {
              // extraDetail holds the original t.co path (e.g. "16bYTgE7lj")
              const reconstructed = `t.co/${extra}`;
              tCoLinks.add(reconstructed);
            }
          }
          console.log("[links] t.co links to resolve:", Array.from(tCoLinks), { websiteId, totalLinks: JSON.stringify(links) });

          // Resolve them (the function also updates the DB for next time)
          const resolvedMap = new Map<string, string>();
          await Promise.all(
            Array.from(tCoLinks).map(async (rawLink) => {
              const [refHost, ...rest] = rawLink.split("/");
              const extraDetail = rest.join("/");
              console.log("[links] Resolving", { refHost, extraDetail });
              const resolved = await resolveTwitterLink({
                websiteId,
                refHost,
                referrerExtraDetail: extraDetail,
                domain: website.domain,
              });
              console.log({resolved});
              
              resolvedMap.set(rawLink, resolved);
            })
          );
          console.log("[links] Resolution results:", Object.fromEntries(resolvedMap));

          for (const linkEntry of links) {
            let link = linkEntry.link;
            if (!link) continue;

            if (resolvedMap.has(link)) {
              link = resolvedMap.get(link)!;
            }

            const key = `https://${link}`;

            if (!linkMap.has(key)) {
              linkMap.set(key, {
                extraDetail: link,
                visitors: 0,
                sessionPairs: new Set(),
              });
            }

            const linkData = linkMap.get(key)!;
            linkData.visitors += 1;
            linkData.sessionPairs.add(
              `${linkEntry.sessionId}:${linkEntry.visitorId}`
            );
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

            const domain = data.extraDetail.split("/")[0];
            linksData.push({
              label: key,
              visitors: data.visitors,
              revenue: totalRevenue,
              imageUrl: `https://icons.duckduckgo.com/ip3/${domain}.ico`,
            });
          }

          // Sort by visitors descending
          linksData.sort((a, b) => b.visitors - a.visitors);

          const result = JSON.stringify({
            dataset: linksData,
          });

          await redis?.set(cacheKey, result, {
            expiration: { type: "EX", value: 3600 },
          });
          console.log(`[links] Response sent (fresh), cached with key: ${cacheKey}, links: ${linksData.length}`);

          return new Response(result, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error(`[links] Error:`, error);
          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
