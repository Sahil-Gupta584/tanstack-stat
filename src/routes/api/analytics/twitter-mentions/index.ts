import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { getRedis } from "@/configs/redis";
import { fetchAndStoreMentions } from "@/routes/api/cron/-actions";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/analytics/twitter-mentions/")({
    server: {
        handlers: {
            GET: async ({ request }) => {
                try {
                    const websiteId = new URL(request.url).searchParams.get("websiteId")
                    if (!websiteId) {
                        return new Response(JSON.stringify({ ok: false, message: "Missing websiteId" }), { status: 400 });
                    }
                    const redis = await getRedis();
                    const lockKey = `twitter_lock:${websiteId}`;
                    const locked = await redis.get(lockKey);
                    if (locked) {
                        // console.log(`🔒 Twitter fetch locked for ${websiteId}`);
                        // return new Response(JSON.stringify({ ok: true, message: "Using cached data", cached: true, mention: null }));
                    }

                    const website = await database.getRow(databaseId, "websites", websiteId);
                    // If no lock, fetch new data and set lock
                    console.log(`Triggering on-demand Twitter fetch for ${websiteId}`);
                    const newMention = await fetchAndStoreMentions(websiteId, website.keywords || [website.domain]);
                    console.log({ newMention })
                    // Set lock for 12 hours
                    await redis.set(lockKey, "locked", { expiration: { type: "EX", value: 43200 } });
                    // Invalidate the MAIN analytics cache so the next dashboard load includes the new mention

                    if (newMention) {
                        try {
                            const keys = await redis.scan("0", { MATCH: `${websiteId}:main:*` });
                            for (const key of keys.keys) {
                                // await redis.del(key);
                            }
                            console.log(`🧹 Invalidated analytics cache for ${websiteId}`);
                        } catch (e) {
                            console.error("Failed to invalidate cache", e);
                        }
                    }
                    return new Response(JSON.stringify({
                        ok: true,
                        message: "Fetched new data",
                        cached: false,
                        mention: newMention
                    }));
                } catch (error) {
                    console.error("Error in twitter mentions fetch", error);
                    return new Response(JSON.stringify({ ok: false, error: (error as Error).message }), { status: 500 });
                }
            },
        },
    },
});
