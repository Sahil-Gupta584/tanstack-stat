import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "node-appwrite";

export const Route = createFileRoute("/api/analytics/funnels/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const searchParams = new URL(request.url).searchParams;
          const websiteId = searchParams.get("websiteId");
          if (!websiteId) throw new Error("Invalid payload");

          const funnels = await database.listRows({
            databaseId,
            tableId: "funnels",
            queries: [Query.equal("website", websiteId)],
          });

          const dataset = JSON.stringify({ dataset: funnels.rows });
          return new Response(dataset, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.log("Failed to send funnels", error);

          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
