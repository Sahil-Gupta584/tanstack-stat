import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { getWebhookUrl, paddleApiBaseUrl } from "@/lib/utils/server";
import { paddleSchema } from "@/lib/zodSchemas";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute(
  "/api/website/$websiteId/connectPayment/paddle/",
)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const formdata = await paddleSchema.parseAsync(body);

          const addWebhookRes = await axios.post(
            paddleApiBaseUrl + `/notification-settings`,
            {
              description: "Analytics Webhook",
              destination: getWebhookUrl("Paddle", formdata.websiteId) || "",
              subscribed_events: [
                "transaction.completed",
                "transaction.updated",
                "subscription.created",
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${formdata.apiKey}`,
              },
            },
          );

          if (addWebhookRes.data?.error) {
            console.log("res", addWebhookRes.data);
            throw new Error(
              "Failed to connect Paddle payments: " +
                addWebhookRes.data?.error?.message,
            );
          }

          const customMeta = formdata.metadata.customTag.toLowerCase();

          await database.upsertRow({
            databaseId,
            tableId: "keys",
            rowId: body.websiteId,
            data: {
              paddle: formdata.apiKey,
              meta: customMeta,
            },
          });

          const website = await database.getRow({
            databaseId,
            tableId: "websites",
            rowId: body.websiteId,
          });

          website.paymentProviders.push("Paddle");

          await database.updateRow({
            databaseId,
            tableId: "websites",
            rowId: body.websiteId,
            data: {
              paymentProviders: website.paymentProviders,
            },
          });

          return new Response(JSON.stringify({ ok: true }));
        } catch (error) {
          console.error(error);

          return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 400 },
          );
        }
      },
    },
  },
});