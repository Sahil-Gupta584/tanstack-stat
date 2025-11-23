import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { verifyAnalyticsPayload } from "@/routes/api/-actions";
import { createFileRoute } from "@tanstack/react-router";
import { Query } from "node-appwrite";

const ops = {
  startsWith: Query.startsWith,
  equals: Query.equal,
  contains: Query.contains,
  endsWith: Query.endsWith,
  doesNotEqual: Query.notEqual,
  doesNotContains: Query.notContains,
  wildCardPattern: Query.search,
  completes: Query.equal,
  notCompletes: Query.notEqual,
};

export const Route = createFileRoute("/api/analytics/funnels/$funnelId/")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const { timestamp } = await verifyAnalyticsPayload(request);
          const funnelSteps = await database.listRows({
            databaseId,
            tableId: "funnelsteps",
            queries: [
              Query.equal("funnelId", params.funnelId),
              Query.orderAsc("$createdAt"),
            ],
          });
          const finalSteps = [];
          let visitorIds: string[] = [];

          for (const fs of funnelSteps.rows) {
            let [operator, value] = fs.descriptor.split(":") as string[];

            if (operator.includes("wildCardPattern")) {
              operator = "wildCardPattern";
              value = value.replace("*", "");
            }
            //@ts-expect-error complex
            const queryFn = ops[operator];

            // base queries
            const queries = [
              Query.orderAsc("$createdAt"),
              Query.greaterThan(
                "$createdAt",
                new Date(timestamp).toISOString()
              ),
              Query.select(["$id", "visitorId"]),
            ];

            // only filter by visitorIds if NOT first step
            if (visitorIds.length > 0) {
              queries.push(Query.equal("visitorId", visitorIds));
            }

            // build kind-specific query
            if (fs.kind === "page") {
              queries.push(queryFn("page", value));
            } else if (fs.kind === "goal") {
              queries.push(queryFn("name", value));
            }

            // run DB query
            const rows = (
              await database.listRows({
                databaseId,
                tableId: fs.kind === "page" ? "events" : "goals",
                queries,
              })
            ).rows;

            // IMPORTANT: use UNIQUE visitorIds
            visitorIds = [...new Set(rows.map((v) => v.visitorId))];

            // compute dropoff
            const visitorsCount = visitorIds.length;
            const previous: number =
              finalSteps[finalSteps.length - 1]?.visitors ?? visitorsCount;
            const dropoff: number = previous - visitorsCount;

            finalSteps.push({
              $id: fs.$id,
              visitors: visitorsCount,
              name: fs.name,
              dropoff: finalSteps.length === 0 ? 0 : dropoff,
              descriptor: fs.descriptor,
              kind: fs.kind,
            });
          }

          return new Response(
            JSON.stringify({ ok: true, dataset: finalSteps }),
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (error) {
          console.log("Failed to send funnel steps", error);

          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
