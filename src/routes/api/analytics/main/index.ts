import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { getRedis } from "@/configs/redis";
import { TBucket } from "@/lib/types";
import { getDateKey, getDateName } from "@/lib/utils/server";
import { TDuration } from "@/lib/zodSchemas";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "node-appwrite";
import z from "zod";
import { verifyAnalyticsPayload } from "../../-actions";

const getWebsiteSchema = z.object({
  userId: z.string().min(1),
  events: z.boolean(),
});

export const Route = createFileRoute("/api/analytics/main/")({
  validateSearch: getWebsiteSchema,
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { timestamp, websiteId, duration } =
            await verifyAnalyticsPayload(request);

          // const redis = Redis.fromEnv()
          const cacheKey = `${websiteId}:main:${duration}`;
          const redis = await getRedis();

          const cached = await redis?.get(cacheKey);
          // console.log({ cached });

          if (cached) {
            return new Response(JSON.stringify(cached), {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "max-age=60",
              },
            });
          }

          const checkForEmpty = await database.listRows({
            databaseId,
            tableId: "events",
            queries: [Query.equal("website", websiteId), Query.limit(1)],
          });

          if (checkForEmpty && !checkForEmpty.rows[0])
            return new Response(
              JSON.stringify({
                dataset: [],
                avgSessionTime: 0,
                bounceRate: 0,
                isEmpty: true,
              }),
              { headers: { "Content-Type": "application/json" } }
            );

          // 1. Fetch events
          const eventsRes = await database.listRows({
            databaseId,
            tableId: "events",
            queries: [
              Query.equal("website", websiteId),
              Query.greaterThan(
                "$createdAt",
                new Date(timestamp).toISOString()
              ),
              Query.limit(100000000),
            ],
          });

          // // 2. Fetch revenues
          const revenuesRes = await database.listRows({
            databaseId,
            tableId: "revenues",
            queries: [
              Query.equal("website", websiteId),
              Query.greaterThan(
                "$createdAt",
                new Date(timestamp).toISOString()
              ),
              Query.limit(100000000),
            ],
          });

          const events = eventsRes.rows;

          const revenues = revenuesRes.rows;

          const startDate = new Date(timestamp);
          const endDate = new Date();

          const buckets: TBucket = {};

          for (
            const d = new Date(timestamp);
            d <= new Date();
            duration === "last_24_hours"
              ? d.setHours(d.getHours() + 1)
              : duration === "last_12_months" || duration === "all_time"
                ? d.setMonth(d.getMonth() + 1)
                : d.setDate(d.getDate() + 1)
          ) {
            const dateKey = getDateKey(d.toISOString(), duration);

            if (!buckets[dateKey]) {
              buckets[dateKey] = {
                visitors: 0,
                revenue: 0,
                name: getDateName(d, duration as TDuration),
                id: d.toISOString(),
                timestamp: d.toISOString(),
              };
            }
          }

          // --- Visitors ---
          for (const ev of events) {
            const date = getDateKey(ev.$createdAt, duration);

            if (!buckets[date]) {
              console.log("🚨 Missing bucket for event:", {
                eventCreatedAt: ev.$createdAt,
                parsedDateKey: date,
                loopStart: startDate.toISOString(),
                loopEnd: endDate.toISOString(),
                allBucketKeys: Object.keys(buckets),
              });
              continue;
            }
            buckets[date].visitors += 1;
          }

          // --- Revenues ---
          for (const rev of revenues) {
            const date = getDateKey(rev.$createdAt, duration);

            if (buckets[date]) {
              buckets[date].revenue += rev.revenue || 0;
              buckets[date].renewalRevenue += rev.renewalRevenue || 0;
              buckets[date].refundedRevenue += rev.refundedRevenue || 0;
              buckets[date].sales += rev.sales || 0;
            }
          }

          // 4. Convert buckets → array sorted by date
          const dataset = Object.values(buckets).sort(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any, b: any) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          const sessionDurations: number[] = [];

          const groupedBySession: Record<string, string[]> = {};

          for (const ev of events) {
            if (!groupedBySession[ev.sessionId])
              groupedBySession[ev.sessionId] = [];
            groupedBySession[ev.sessionId].push(ev.$createdAt);
          }

          for (const sessionId in groupedBySession) {
            const timestamps = groupedBySession[sessionId].map((t) =>
              new Date(t).getTime()
            );
            const min = Math.min(...timestamps);
            const max = Math.max(...timestamps);
            const duration = (max - min) / 1000; // in seconds

            if (duration > 0) sessionDurations.push(duration);
          }

          const avgSessionTime =
            sessionDurations.reduce((a, b) => a + b, 0) /
            sessionDurations.length;

          const totalSessions = Object.keys(groupedBySession).length;

          let bounceCount = 0;

          for (const sessionId in groupedBySession) {
            if (groupedBySession[sessionId].length === 1) {
              bounceCount++;
            }
          }

          const bounceRate =
            totalSessions > 0
              ? ((bounceCount / totalSessions) * 100).toFixed(2)
              : 0;

          const data = JSON.stringify({ dataset, avgSessionTime, bounceRate });

          await redis?.set(cacheKey, data, {
            expiration: { type: "EX", value: 36000 },
          });

          return new Response(data, {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "max-age=60",
            },
          });
        } catch (error) {
          console.log("Err in analytics/main", error);

          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
