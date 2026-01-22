import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "node-appwrite";
import { fetchAndStoreMentions, generateDummyData, seed, updateCacheWithSeededData } from "./-actions";

const websiteId = "68d124eb001034bd8493";

export const Route = createFileRoute("/api/cron/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");

          if (
            !authHeader ||
            authHeader !== `Bearer ${process.env.CRON_SECRET}`
          ) {
            console.log({ authHeader });

            return new Response(
              JSON.stringify({ ok: false, error: "Unauthorized" }),
              {
                status: 401,
              }
            );
          }

          // Fetch all websites to check for Twitter keywords
          const websitesRes = await database.listRows({
            databaseId,
            tableId: "websites",
            queries: [Query.limit(1000)],
          });

          for (const website of websitesRes.rows) {
            if (website.twitterKeywords && website.twitterKeywords.length > 0) {
              await fetchAndStoreMentions(website.$id, website.twitterKeywords);
            }
          }

          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 1);
          const { events, goalsData, revenues } = await generateDummyData({
            startDate,
            endDate,
            websiteId,
          });
          await seed("events", events);
          await seed("goals", goalsData);
          await seed("revenues", revenues);
          // Update Redis cache with the newly seeded data
          await updateCacheWithSeededData(websiteId, events, revenues);
          return new Response(
            JSON.stringify({
              ok: true,
              message: "Cron job and Twitter fetch completed successfully",
            }),
            {
              status: 200,
            }
          );
        } catch (error) {
          console.log("Error in cron job", error);

          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            {
              status: 500,
            }
          );
        }
      },
    },
  },
});
