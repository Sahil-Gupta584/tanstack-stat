import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { getRedis } from "@/configs/redis";
import { TBucket } from "@/lib/types";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "appwrite";
import { verifyAnalyticsPayload } from "../../-actions";

export const Route = createFileRoute("/api/analytics/goals/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { timestamp, websiteId } =
            await verifyAnalyticsPayload(request);

          const cacheKey = `${websiteId}:goals`;
          const re = await getRedis();
          const cached = await re.get(cacheKey);

          if (cached) {
            return new Response(JSON.stringify(JSON.parse(cached)), {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "max-age=60",
              },
            });
          }

          // Fetch goals
          const goalsRes = await database.listRows({
            databaseId,
            tableId: "goals",
            queries: [
              Query.equal("website", websiteId),
              Query.greaterThan(
                "$createdAt",
                new Date(timestamp).toISOString(),
              ),
              Query.limit(100000000),
            ],
          });
          const goals = goalsRes.rows;
          const goalsBucket: TBucket = {};

          for (const g of goals) {
            if (goalsBucket[g.name]) {
              goalsBucket[g.name].visitors += 1;
            } else {
              goalsBucket[g.name] = {
                visitors: 1,
                label: g.name,
              };
            }
          }
          const dataset = JSON.stringify({
            dataset: Object.values(goalsBucket),
          });

          await re.set(cacheKey, dataset);

          return new Response(dataset, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.log("Failed to get goals", error);

          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            { headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
