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

                    // 2. Cache Miss: Fetch new tweets on demand
                    console.log(`📡 Cache miss, triggering on-demand fetch for ${websiteId}`);

                    const website = await database.getRow({
                        databaseId,
                        tableId: "websites",
                        rowId: websiteId,
                        queries: [Query.select(['twitterKeywords', 'twitterLastFetchedAt', "domain"])]
                    });

                    const keywords = website.twitterKeywords || [];
                    keywords.push(website.domain?.split('.')?.[0]);
                    const lastFetchedAt = website.twitterLastFetchedAt;

                    // Fetch new mentions from X API
                    const newMentions = await fetchAndStoreMentions(websiteId, keywords, lastFetchedAt);

                    // Update lastFetchedAt in database if we found new content
                    if (newMentions.length > 0) {
                        const latestTimestamp = newMentions.reduce((prev, current) =>
                            new Date(current.timestamp) > new Date(prev) ? current.timestamp : prev,
                            lastFetchedAt || new Date(0).toISOString()
                        );

                        await database.updateRow({
                            databaseId,
                            tableId: "websites",
                            rowId: websiteId,
                            data: {
                                twitterLastFetchedAt: latestTimestamp
                            }
                        });
                    }

                    // Fetch all recent mentions (including previous ones) for the dashboard
                    const mentionsRes = await database.listRows({
                        databaseId,
                        tableId: "mentions",
                        queries: [
                            Query.equal("website", websiteId),
                            Query.limit(100),
                        ],
                    });

                    const mentions = mentionsRes.rows

                    // Store in cache for next time (12hr)
                    await redis.set(cacheKey, mentions, { expiration: { type: "EX", value: 43200 } });

                    return new Response(JSON.stringify({
                        ok: true,
                        mentions,
                        source: "api"
                    }));
                } catch (error) {
                    console.error("Error in twitter mentions fetch", error);
                    return new Response(JSON.stringify({ ok: false, error: (error as Error).message }), { status: 500 });
                }
            },
        },
    },
});
