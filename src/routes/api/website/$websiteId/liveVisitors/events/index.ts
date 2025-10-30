import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "node-appwrite";

export const Route = createFileRoute(
  "/api/website/$websiteId/liveVisitors/events/"
)({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        try {
          const { websiteId } = params;
          const events = [];
          const liveVisitors = await request.json();

          for (const lv of liveVisitors) {
            const totalVisit = await database.listRows({
              databaseId,
              tableId: "events",
              queries: [
                Query.equal("visitorId", lv.visitorId),
                Query.equal("sessionId", lv.sessionId),
                Query.equal("website", websiteId),
                Query.orderDesc("$createdAt"),
              ],
            });
            if (totalVisit.rows[0])
              events.push({
                ...totalVisit.rows[0],
                totalVisit: totalVisit.total,
                lastEventTs: lv.$createdAt,
              });
          }

          return new Response(JSON.stringify(events), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Error getting live visitorsEvents", error);

          return new Response(JSON.stringify({ ok: false }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      },
    },
  },
});
