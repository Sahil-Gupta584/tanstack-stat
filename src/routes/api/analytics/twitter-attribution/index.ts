import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "appwrite";
import type { Metric } from "@/lib/types";

export const Route = createFileRoute("/api/analytics/twitter-attribution/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url);
          const websiteId = searchParams.get("websiteId");
          const duration = searchParams.get("duration");

          if (!websiteId) {
            return new Response(
              JSON.stringify({
                ok: false,
                error: "Missing websiteId parameter",
              }),
              {
                headers: { "Content-Type": "application/json" },
                status: 400,
              }
            );
          }

          const now = new Date();
          let timestamp = now.getTime();

          switch (duration) {
            case "last_24_hours":
              timestamp -= 24 * 60 * 60 * 1000;
              break;
            case "last_7_days":
              timestamp -= 7 * 24 * 60 * 60 * 1000;
              break;
            case "last_30_days":
              timestamp -= 30 * 24 * 60 * 60 * 1000;
              break;
            case "today":
              timestamp = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
              ).getTime();
              break;
            default:
              timestamp = 0;
          }

          const eventsRes = await database.listRows({
            databaseId,
            tableId: "events",
            queries: [
              Query.equal("website", websiteId),
              Query.greaterThan("$createdAt", new Date(timestamp).toISOString()),
              Query.isNotNull("twitterPostUrl"),
              Query.limit(100000),
            ],
          });

          const twitterPostsMap = new Map<
            string,
            {
              postUrl: string;
              postId?: string;
              visitors: number;
              uniqueVisitors: Set<string>;
            }
          >();

          for (const event of eventsRes.rows) {
            const postUrl = event.twitterPostUrl;
            const postId = event.twitterPostId;
            const visitorId = event.visitorId;

            if (!twitterPostsMap.has(postUrl)) {
              twitterPostsMap.set(postUrl, {
                postUrl,
                postId,
                visitors: 0,
                uniqueVisitors: new Set(),
              });
            }

            const data = twitterPostsMap.get(postUrl)!;
            data.visitors += 1;
            data.uniqueVisitors.add(visitorId);
          }

          const dataset: Metric[] = Array.from(twitterPostsMap.values())
            .map((item) => ({
              label: item.postId
                ? `Tweet ${item.postId.slice(-6)}`
                : "Direct Link",
              visitors: item.uniqueVisitors.size,
              revenue: 0,
              imageUrl: item.postUrl,
            }))
            .sort((a, b) => b.visitors - a.visitors);

          return new Response(
            JSON.stringify({
              ok: true,
              dataset,
              total: dataset.reduce((sum, item) => sum + item.visitors, 0),
              posts: Array.from(twitterPostsMap.values())
                .sort((a, b) => b.uniqueVisitors.size - a.uniqueVisitors.size)
                .map((item) => ({
                  postUrl: item.postUrl,
                  postId: item.postId,
                  visitors: item.uniqueVisitors.size,
                  clickCount: item.visitors,
                })),
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          console.error("Error fetching Twitter attribution:", error);
          return new Response(
            JSON.stringify({
              ok: false,
              error:
                error instanceof Error ? error.message : "Failed to fetch data",
            }),
            {
              headers: { "Content-Type": "application/json" },
              status: 500,
            }
          );
        }
      },
    },
  },
});
