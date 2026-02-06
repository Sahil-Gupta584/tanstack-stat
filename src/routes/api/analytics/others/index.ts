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

import { Metric } from "@/lib/types";

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
          // Buckets tracking
          const pageVisitors = new Map<string, Set<string>>();
          const pagePVs = new Map<string, number>();

          const referrerVisitors = new Map<string, Set<string>>();
          const referrerPVs = new Map<string, number>();

          const countryVisitors = new Map<string, Set<string>>();
          const countryPVs = new Map<string, number>();

          const regionVisitors = new Map<string, Set<string>>();
          const regionPVs = new Map<string, number>();

          const cityVisitors = new Map<string, Set<string>>();
          const cityPVs = new Map<string, number>();

          const browserVisitors = new Map<string, Set<string>>();
          const browserPVs = new Map<string, number>();

          const osVisitors = new Map<string, Set<string>>();
          const osPVs = new Map<string, number>();

          const deviceVisitors = new Map<string, Set<string>>();
          const devicePVs = new Map<string, number>();

          const revenuePerBucket = new Map<string, Map<string, number>>();
          ["page", "referrer", "country", "browser", "os", "device"].forEach(type => revenuePerBucket.set(type, new Map()));

          const seenSessions = new Set<string>();
          let totalVisitorsCount = 0;
          let totalConvertingVisitors = 0;

          // Process events
          for (const e of events) {
            const sessionTotalRevenue = revenueMap.get(e.sessionId) || 0;
            const isFirstSeenSession = !seenSessions.has(e.sessionId);
            if (isFirstSeenSession) seenSessions.add(e.sessionId);

            // Helpers for location data
            const refDomain = normalizeReferrer(e.referrer);
            const os = e.os?.toLowerCase();
            const browser = e.browser?.toLowerCase();

            // Global totals
            totalVisitorsCount += 1;
            if (isFirstSeenSession && sessionTotalRevenue > 0) totalConvertingVisitors += 1;

            const updateMetric = (
              visitorMap: Map<string, Set<string>>,
              pvMap: Map<string, number>,
              key: string,
              bucketName?: string
            ) => {
              if (!visitorMap.has(key)) visitorMap.set(key, new Set());
              visitorMap.get(key)!.add(e.visitorId);
              pvMap.set(key, (pvMap.get(key) || 0) + 1);

              if (bucketName && revenuePerBucket.has(bucketName) && isFirstSeenSession && sessionTotalRevenue > 0) {
                const bRevMap = revenuePerBucket.get(bucketName)!;
                bRevMap.set(key, (bRevMap.get(key) || 0) + sessionTotalRevenue);
              }
            };

            updateMetric(pageVisitors, pagePVs, e.page, "page");
            updateMetric(referrerVisitors, referrerPVs, refDomain, "referrer");
            updateMetric(countryVisitors, countryPVs, e.countryCode, "country");
            updateMetric(regionVisitors, regionPVs, e.region);
            updateMetric(cityVisitors, cityPVs, e.city);
            updateMetric(browserVisitors, browserPVs, browser, "browser");
            updateMetric(osVisitors, osPVs, os, "os");
            updateMetric(deviceVisitors, devicePVs, e.device, "device");
          }

          const finalize = (
            visitorMap: Map<string, Set<string>>,
            pvMap: Map<string, number>,
            bucketName?: string,
            extra: (_key: string) => Partial<Metric> = () => ({})
          ): Metric[] => {
            const revMap = bucketName ? revenuePerBucket.get(bucketName) : null;
            return Array.from(visitorMap.keys()).map(key => {
              const visitors = visitorMap.get(key)?.size || 0;
              const pageviews = pvMap.get(key) || 0;
              const revenue = revMap?.get(key) || 0;
              return {
                label: key,
                visitors,
                pageviews,
                revenue,
                conversionRate: visitors > 0 && revenue > 0 ? 100 : 0,
                ...extra(key)
              };
            });
          };

          const data = JSON.stringify({
            dataset: {
              pageData: finalize(pageVisitors, pagePVs, "page"),
              referrerData: finalize(referrerVisitors, referrerPVs, "referrer", (k) => ({
                imageUrl: `https://icons.duckduckgo.com/ip3/${k}.ico`
              })),
              countryData: finalize(countryVisitors, countryPVs, "country", (k) => ({
                imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${k}.svg`,
                countryCode: k
              })),
              regionData: finalize(regionVisitors, regionPVs, undefined, (_k) => {
                // Try to find country code for this region if possible, or use a neutral icon
                return { imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/PS.svg` };
              }),
              cityData: finalize(cityVisitors, cityPVs, undefined, (_k) => ({
                imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/PS.svg`
              })),
              browserData: finalize(browserVisitors, browserPVs, "browser", (k) => ({
                imageUrl: `https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/${k}/${k}_64x64.png`
              })),
              osData: finalize(osVisitors, osPVs, "os", (k) => ({
                imageUrl: `/images/${k}.png`
              })),
              deviceData: finalize(deviceVisitors, devicePVs, "device", (k) => ({
                imageUrl: `/images/${k}.png`
              })),
            },
            overallConversionRate:
              totalVisitorsCount > 0
                ? (totalConvertingVisitors / totalVisitorsCount) * 100
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
