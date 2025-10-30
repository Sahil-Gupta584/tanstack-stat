import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { dodoApiBaseUrl, getWebhookUrl } from "@/lib/utils/server";
import { dodoSchema } from "@/lib/zodSchemas";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute(
  "/api/website/$websiteId/connectPayment/dodo/",
)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const formdata = await dodoSchema.parseAsync(body);

          const addWebhookRes = await axios.post(
            dodoApiBaseUrl + `/webhooks`,
            {
              url: getWebhookUrl("Dodo", formdata.websiteId) || "",
              events: [
                "payment.succeeded",
                "refund.succeeded",
                "subscription.renewed",
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${formdata.apiKey}`,
              },
              validateStatus: () => true,
            },
          );

          if (addWebhookRes.data?.code) {
            console.log("res", addWebhookRes.data);
            throw new Error(
              "Failed to connect dodopayments :(, Please check your API key or contact us." +
                addWebhookRes.data?.code,
            );
          }

          await database.upsertRow({
            databaseId,
            tableId: "keys",
            rowId: body.websiteId,
            data: {
              dodo: formdata.apiKey,
            },
          });

          const website = await database.getRow({
            databaseId,
            tableId: "websites",
            rowId: body.websiteId,
          });

          website.paymentProviders.push("Dodo");

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
