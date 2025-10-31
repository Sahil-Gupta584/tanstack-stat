import { database, databaseId, headers } from "@/configs/appwrite/serverConfig";
import { updateCache } from "@/configs/redis";
import { getGeo, normalizeBrowser, normalizeOS } from "@/lib/utils/server";
import { createFileRoute } from "@tanstack/react-router";
import { ID } from "appwrite";
import { UAParser } from "ua-parser-js";
import {
  handleCustomEvent,
  handleDodoPaymentLink,
  handleDodoSubscriptionLink,
  handleStripePaymentLinks,
  updatePolarCustomer,
} from "../-actions";

export const Route = createFileRoute("/api/events/")({
  server: {
    handlers: {
      // Handle preflight requests
      OPTIONS: async () => {
        return new Response(null, {
          headers,
          status: 204,
        });
      },
      POST: async ({ request }) => {
        const body = await request.json();
        try {
          const {
            websiteId,
            href,
            referrer,
            viewport,
            visitorId,
            sessionId,
            type,
            extraData,
          } = body;

          const website = await database.getRow({
            databaseId,
            rowId: websiteId,
            tableId: "websites",
          });

          if (!website)
            throw new Error(
              "Website not found, please register it on https://insightly.appwrite.network/dashboard/new"
            );

          if (extraData) {
            if (extraData.stripe_session_id) {
              await handleStripePaymentLinks({
                csid: extraData.stripe_session_id,
                sId: sessionId,
                vId: visitorId,
                websiteId,
              });
            }
            if (extraData.dodo_subscription_id) {
              await handleDodoSubscriptionLink({
                sId: sessionId,
                subId: extraData.dodo_subscription_id,
                vId: visitorId,
                websiteId,
              });
            }
            if (extraData.dodo_payment_id) {
              await handleDodoPaymentLink({
                sId: sessionId,
                payId: extraData.dodo_payment_id,
                vId: visitorId,
                websiteId,
              });
            }
            if (extraData.polar_checkout_id) {
              await updatePolarCustomer({
                chId: extraData.polar_checkout_id,
                websiteId,
                vId: visitorId,
                sId: sessionId,
              });
            }
          }
          if (type === "custom") {
            return await handleCustomEvent({
              extraData,
              sessionId,
              visitorId,
              websiteId,
            });
          }
          const page = new URL(href).pathname;
          const userAgent = request.headers.get("user-agent") || "";
          const parser = new UAParser(userAgent);

          const browser = normalizeBrowser(parser.getBrowser().name);
          const os = normalizeOS(parser.getOS().name);

          let device = parser.getDevice().type || "desktop";

          if (!device) {
            const width = viewport?.width || 0;

            if (width <= 768) device = "mobile";
            else if (width <= 1024) device = "tablet";
            else device = "desktop";
          }

          let ip =
            request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";

          ip = ip === "::1" ? "103.190.15.171" : ip;

          const geo = await getGeo(ip);
          const countryCode = geo?.countryCode || "XX";
          const city = geo?.city || "Unknown";
          const region = geo?.region || "Unknown";

          await database.createRow({
            databaseId,
            tableId: "events",
            rowId: ID.unique(),
            data: {
              website: websiteId,
              page,
              referrer: referrer ? new URL(referrer).hostname : null,
              visitorId,
              sessionId,
              type,
              browser,
              os,
              device,
              countryCode,
              city,
              region,
            },
          });

          await updateCache({
            websiteId,
            type,
            data: {
              browser,
              device,
              os,
              page,
              referrer,
              city,
              countryCode,
              region,
            },
          });

          return new Response(JSON.stringify({ ok: true }), {
            headers,
          });
        } catch (error) {
          console.log("Error to receive an event", error, {
            body: JSON.stringify(body),
          });

          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
            {
              headers,
              status: 500,
            }
          );
        }
      },
    },
  },
});
