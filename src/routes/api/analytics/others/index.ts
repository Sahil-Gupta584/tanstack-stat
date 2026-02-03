import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { getRedis } from "@/configs/redis";
import { normalizeReferrer } from "@/lib/utils/server";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "node-appwrite";
import z from "zod";
import { verifyAnalyticsPayload } from "../../-actions";
const getWebsiteSchema = z.object({
  userId: z.string().min(1),
  events: z.boolean(),
});

type Metric = {
  label: string;
  visitors: number;
  revenue: number;
  imageUrl?: string;
  convertingVisitors?: number;
  countryCode?: string;
  conversionRate?: number;
};

export const Route = createFileRoute("/api/analytics/others/")({
  validateSearch: getWebsiteSchema,
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { timestamp, websiteId, duration } =
            await verifyAnalyticsPayload(request);
          const cacheKey = `${websiteId}:others:${duration}`;
          const redis = await getRedis();
          const cached = await redis?.get(cacheKey);

          if (cached) {
            return new Response(JSON.stringify(cached), {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "max-age=60",
              },
            });
          }

          // Fetch events
          const eventsRes = await database.listRows({
            databaseId,
            tableId: "events",
            queries: [
              Query.equal("website", websiteId),
              Query.greaterThan(
                "$createdAt",
                new Date(timestamp).toISOString(),
              ),
              Query.limit(100000000),
            ],
          });
          const events = eventsRes.rows;

          // Fetch revenues
          const sessionIds = Array.from(
            new Set(events.map((e) => e.sessionId)),
          );
          const revenuesRes = await database.listRows({
            databaseId,
            tableId: "revenues",
            queries: [
              Query.equal("website", websiteId),
              Query.greaterThan(
                "$createdAt",
                new Date(timestamp).toISOString(),
              ),
              Query.limit(10000000),
            ],
          });
          const sessionSet = new Set(sessionIds);
          const revenues = revenuesRes.rows.filter((r) =>
            sessionSet.has(r.sessionId),
          );

          // Map session → revenue
          const revenueMap = new Map<string, number>();

          revenues.forEach((r) => {
            const prev = revenueMap.get(r.sessionId) || 0;

            revenueMap.set(r.sessionId, prev + (r.revenue || 0));
          });

          // Buckets
          const pageMap = new Map<string, Metric>();
          const referrerMap = new Map<string, Metric>();
          const countryMap = new Map<string, Metric>();
          const regionMap = new Map<string, Metric>();
          const cityMap = new Map<string, Metric>();
          const browserMap = new Map<string, Metric>();
          const osMap = new Map<string, Metric>();
          const deviceMap = new Map<string, Metric>();

          const seenSessions = new Set<string>();

          // Global totals for overall conversion rate
          let totalVisitors = 0;
          let totalConvertingVisitors = 0;

          // Process events
          for (const e of events) {
            const sessionTotalRevenue = revenueMap.get(e.sessionId) || 0;
            const giveRevenue = !seenSessions.has(e.sessionId);

            if (giveRevenue) seenSessions.add(e.sessionId);

            // Count global visitors
            totalVisitors += 1;
            if (giveRevenue && sessionTotalRevenue > 0)
              totalConvertingVisitors += 1;

            // Helper function to update bucket
            const updateBucket = (
              map: Map<string, Metric>,
              key: string,
              extra?: Partial<Metric>,
            ) => {
              const bucket = map.get(key);

              if (bucket) {
                bucket.visitors += 1;
                if (giveRevenue && sessionTotalRevenue > 0) {
                  bucket.convertingVisitors =
                    (bucket.convertingVisitors || 0) + 1;
                  bucket.revenue += sessionTotalRevenue;
                }
              } else {
                map.set(key, {
                  label: key,
                  visitors: 1,
                  revenue:
                    giveRevenue && sessionTotalRevenue > 0
                      ? sessionTotalRevenue
                      : 0,
                  convertingVisitors:
                    giveRevenue && sessionTotalRevenue > 0 ? 1 : 0,
                  ...extra,
                });
              }
            };

            updateBucket(pageMap, e.page);

            // --- Referrer ---
            const refDomain = normalizeReferrer(e.referrer);
            updateBucket(referrerMap, refDomain, {
              imageUrl: `https://icons.duckduckgo.com/ip3/${refDomain}.ico`,
            });

            // --- Location ---
            const imageUrl = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${e.countryCode}.svg`;
            updateBucket(countryMap, e.countryCode, {
              imageUrl,
              countryCode: e.countryCode,
            });
            updateBucket(regionMap, e.region, { imageUrl });
            updateBucket(cityMap, e.city, { imageUrl });

            // --- Browser ---
            const browser = e.browser?.toLowerCase();
            updateBucket(browserMap, browser, {
              imageUrl: `https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/${browser}/${browser}_64x64.png`,
            });

            // --- OS ---
            const os = e.os?.toLowerCase();
            updateBucket(osMap, os, {
              imageUrl: `/images/${os}.png`,
            });

            // --- Device ---
            const device = e.device;
            updateBucket(deviceMap, device, {
              imageUrl: `/images/${device}.png`,
            });
          }

          // Finalize: compute per-bucket conversion rates
          const finalizeMetrics = (map: Map<string, Metric>) =>
            Array.from(map.values()).map((m) => ({
              ...m,
              conversionRate:
                m.visitors > 0
                  ? ((m.convertingVisitors || 0) / m.visitors) * 100
                  : 0,
            }));

          const data = JSON.stringify({
            dataset: {
              pageData: finalizeMetrics(pageMap),
              referrerData: finalizeMetrics(referrerMap),
              countryData: finalizeMetrics(countryMap),
              regionData: finalizeMetrics(regionMap),
              cityData: finalizeMetrics(cityMap),
              browserData: finalizeMetrics(browserMap),
              osData: finalizeMetrics(osMap),
              deviceData: finalizeMetrics(deviceMap),
            },
            overallConversionRate:
              totalVisitors > 0
                ? (totalConvertingVisitors / totalVisitors) * 100
                : 0,
          });

          await redis?.set(cacheKey, data);

          return new Response(data, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            { headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
