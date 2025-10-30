import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createFileRoute } from "@tanstack/react-router";
import { ID, Query } from "appwrite";
import { headers } from "../-actions";

export const Route = createFileRoute("/api/heartbeat/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          if (!body.visitorId || !body.sessionId || !body.websiteId)
            throw new Error("Invalid payload");
          const { visitorId, sessionId, websiteId } = body;
          const event = await database.listRows({
            databaseId,
            tableId: "events",
            queries: [
              Query.equal("visitorId", visitorId),
              Query.equal("sessionId", sessionId),
              Query.limit(1),
            ],
          });

          if (!event.rows[0])
            return new Response(
              JSON.stringify({
                error: "No visitor found for this heartbeat",
              }),
              { status: 400 }
            );
          const isExist = await database.listRows({
            databaseId,
            tableId: "heartbeats",
            queries: [
              Query.equal("website", websiteId),
              Query.equal("sessionId", sessionId),
              Query.equal("visitorId", visitorId),
            ],
          });

          if (!isExist.rows[0]) {
            await database.createRow({
              databaseId,
              tableId: "heartbeats",
              data: {
                sessionId,
                visitorId,
                website: websiteId,
              },
              rowId: ID.unique(),
            });
          }

          return new Response(JSON.stringify({ ok: true }), { headers });
        } catch (error) {
          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
