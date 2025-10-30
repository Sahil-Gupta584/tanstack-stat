import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "appwrite";

export const Route = createFileRoute("/api/website/$websiteId/liveVisitors/")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { websiteId } = params;
          await database.deleteRows({
            databaseId,
            tableId: "heartbeats",
            queries: [
              Query.lessThan(
                "$createdAt",
                new Date(Date.now() - 5 * 60 * 1000).toISOString(),
              ),
              Query.equal("website", websiteId),
            ],
          });
          const beats = await database.listRows({
            databaseId,
            tableId: "heartbeats",
            queries: [Query.equal("website", websiteId)],
          });

          return new Response(JSON.stringify(beats), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Error getting live visitors", error);

          return new Response(JSON.stringify({ ok: false }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      },
    },
  },
});
