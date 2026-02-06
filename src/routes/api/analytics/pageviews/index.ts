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

export const Route = createFileRoute("/api/analytics/pageviews/")({
    validateSearch: getWebsiteSchema,
    server: {
        handlers: {
            GET: async ({ request }) => {
                try {
                    const { timestamp, websiteId, duration } =
                        await verifyAnalyticsPayload(request);

                    const cacheKey = `${websiteId}:pageviews:${duration}`;
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

                    const checkForEmpty = await database.listRows({
                        databaseId,
                        tableId: "events",
                        queries: [Query.equal("website", websiteId), Query.limit(1)],
                    });

                    if (checkForEmpty && !checkForEmpty.rows[0])
                        return new Response(
                            JSON.stringify({
                                dataset: [],
                                isEmpty: true,
                            }),
                            { headers: { "Content-Type": "application/json" } }
                        );

                    // Fetch events for pageviews
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

                    const events = eventsRes.rows;

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
                                pageviews: 0,
                                name: getDateName(d, duration as TDuration),
                                id: d.toISOString(),
                                timestamp: d.toISOString(),
                            };
                        }
                    }

                    // --- Pageviews ---
                    for (const ev of events) {
                        const date = getDateKey(ev.$createdAt, duration);

                        if (buckets[date]) {
                            buckets[date].pageviews += 1;
                        }
                    }

                    // Convert buckets → array sorted by date
                    const dataset = Object.values(buckets).sort(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (a: any, b: any) =>
                            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    );

                    const data = JSON.stringify({ dataset });

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
                    console.log("Err in analytics/pageviews", error);

                    return new Response(
                        JSON.stringify({ ok: false, error: (error as Error).message }),
                        { headers: { "Content-Type": "application/json" } }
                    );
                }
            },
        },
    },
});
