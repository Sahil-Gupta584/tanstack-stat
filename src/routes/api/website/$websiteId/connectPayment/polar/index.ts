import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { getWebhookUrl, polarBaseUrl } from "@/lib/utils/server";
import { polarSchema } from "@/lib/zodSchemas";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute(
  "/api/website/$websiteId/connectPayment/polar/",
)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const formdata = await polarSchema.parseAsync(body);

          const checkoutsRes = await axios.get(polarBaseUrl + "/checkouts", {
            headers: {
              Authorization: `Bearer ${formdata.accessToken}`,
            },
            validateStatus: () => true,
          });

          if (checkoutsRes.data?.error === "insufficient_scope") {
            throw new Error(`checkouts:read scope not found for given token.`);
          }
          if (checkoutsRes.data?.error) {
            console.log(checkoutsRes.data);
            throw new Error(checkoutsRes.data.error);
          }

          const customerRes = await axios.post(
            polarBaseUrl + `/customers`,
            { email: Math.random().toString() + "@gmail.com" },
            {
              headers: {
                Authorization: `Bearer ${formdata.accessToken}`,
              },
              validateStatus: () => true,
            },
          );

          if (customerRes.data?.error === "insufficient_scope") {
            throw new Error("customer:write scope not found for given token.");
          }
          if (customerRes.data?.error) {
            console.log(customerRes.data);
            throw new Error(customerRes.data.error);
          }

          const addWebhookRes = await axios.post(
            polarBaseUrl + "/webhooks/endpoints",
            {
              format: "raw",
              url: getWebhookUrl("Polar", formdata.websiteId),
              events: ["order.paid"],
            },
            {
              headers: {
                Authorization: `Bearer ${formdata.accessToken}`,
              },
              validateStatus: () => true,
            },
          );

          if (addWebhookRes.data?.error === "insufficient_scope") {
            throw new Error("webhook:write scope not found for given token.");
          }
          if (addWebhookRes.data?.error) {
            console.log(addWebhookRes.data);
            throw new Error(addWebhookRes.data.error);
          }

          await database.upsertRow({
            databaseId,
            tableId: "keys",
            rowId: formdata.websiteId,
            data: {
              polar: formdata.accessToken,
            },
          });

          const website = await database.getRow({
            databaseId,
            tableId: "websites",
            rowId: formdata.websiteId,
          });

          website.paymentProviders.push("Polar");
          await database.updateRow({
            databaseId,
            tableId: "websites",
            rowId: formdata.websiteId,
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
