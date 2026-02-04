import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { getRedis } from "@/configs/redis";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "node-appwrite";
import { fetchAndStoreMentions } from "../../cron/-actions";

interface TTwitterMention {
    id: string;
    tweetId: string;
    username: string;
    handle: string;
    content: string;
    image: string;
    timestamp: string;
    isVerified?: boolean;
    inReplyToUserHandle?: string;
    inReplyToTweetId?: string;
}

export const Route = createFileRoute("/api/analytics/twitter-mentions/")({
    server: {
        handlers: {
            GET: async ({ request }) => {
                try {
                    const url = new URL(request.url);
                    const websiteId = url.searchParams.get("websiteId");

                    if (!websiteId) {
                        return new Response(JSON.stringify({ ok: false, message: "Missing websiteId" }), { status: 400 });
                    }

                    const redis = await getRedis();
                    const cacheKey = `${websiteId}:twitter:mentions`;

                    // 1. Try fetching from Redis Cache
                    const cachedMentions = await redis.get(cacheKey);
                    if (Array.isArray(cachedMentions)) {
                        const mentions = cachedMentions.map((m: TTwitterMention) => ({
                            id: m.id || m.tweetId,
                            username: m.username,
                            handle: m.handle,
                            content: m.content,
                            image: m.image,
                            timestamp: m.timestamp,
                        }));

                        console.log(`✅ Serving ${mentions.length} mentions from cache for ${websiteId}`);
                        return new Response(JSON.stringify({
                            ok: true,
                            mentions,
                            source: "cache"
                        }));
                    }

                    // 2. Cache Miss: Check fetch frequency limit
                    console.log(`📡 Cache miss, checking fetch limits for ${websiteId}`);

                    const website = await database.getRow({
                        databaseId,
                        tableId: "websites",
                        rowId: websiteId,
                        queries: [Query.select(['twitterKeywords', 'twitterNewestTweetAt', 'twitterLastApiCallAt', "domain"])]
                    });

                    const lastFetchTriggeredAt = website.twitterLastApiCallAt;
                    const eightHoursInMs = 8 * 60 * 60 * 1000;
                    const canFetch = !lastFetchTriggeredAt || (Date.now() - new Date(lastFetchTriggeredAt).getTime() >= eightHoursInMs);

                    if (canFetch) {
                        console.log(`🚀 Interval passed, fetching new mentions for ${websiteId}`);
                        const keywords = website.twitterKeywords || [];
                        const domainTopic = website.domain?.split('.')?.[0];
                        if (domainTopic && !keywords.includes(domainTopic)) {
                            keywords.push(domainTopic);
                        }

                        const lastFetchedTweetAt = website.twitterNewestTweetAt;

                        // Fetch new mentions from X API
                        const newMentions = await fetchAndStoreMentions(websiteId, keywords, lastFetchedTweetAt);

                        // Update both the trigger time and the latest tweet timestamp
                        const updateData: Record<string, string> = {
                            twitterLastApiCallAt: new Date().toISOString()
                        };

                        if (newMentions.length > 0) {
                            const latestTweetTimestamp = newMentions.reduce((prev, current) =>
                                new Date(current.timestamp) > new Date(prev) ? current.timestamp : prev,
                                lastFetchedTweetAt || new Date(0).toISOString()
                            );
                            updateData.twitterNewestTweetAt = latestTweetTimestamp;
                        }

                        await database.updateRow({
                            databaseId,
                            tableId: "websites",
                            rowId: websiteId,
                            data: updateData
                        });
                    } else {
                        console.log(`⏳ Fetch skipped for ${websiteId}, last fetch was less than 8 hours ago.`);
                    }

                    // 3. Fetch all recent mentions from DB for the dashboard
                    const mentionsRes = await database.listRows({
                        databaseId,
                        tableId: "mentions",
                        queries: [
                            Query.equal("website", websiteId),
                            Query.orderDesc("timestamp"),
                            Query.limit(100),
                        ],
                    });

                    const mentions = mentionsRes.rows;

                    // Store in cache for next time (12hr)
                    await redis.set(cacheKey, mentions, { expiration: { type: "EX", value: 43200 } });

                    return new Response(JSON.stringify({
                        ok: true,
                        mentions,
                        source: canFetch ? "api" : "db-limited"
                    }));
                } catch (error) {
                    console.error("Error in twitter mentions fetch", error);
                    return new Response(JSON.stringify({ ok: false, error: (error as Error).message }), { status: 500 });
                }
            },
        },
    },
});
