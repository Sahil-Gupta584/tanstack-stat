import { createFileRoute } from "@tanstack/react-router";
import { generateDummyData, seed } from "./actions";

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
            return new Response(
              JSON.stringify({ ok: false, error: "Unauthorized" }),
              {
                status: 401,
              }
            );
          }
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 1);
          const endDate = new Date();
          const { events, goalsData, revenues } = await generateDummyData({
            startDate,
            endDate,
            websiteId,
          });
          await seed("events", events);
          await seed("goals", goalsData);
          await seed("revenues", revenues);
          return new Response(
            JSON.stringify({
              ok: true,
              message: "Cron job completed successfully",
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
