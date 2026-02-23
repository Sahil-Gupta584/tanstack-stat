import { MODE } from "@/configs/appwrite/serverConfig";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";


export const Route = createFileRoute("/api/checkout/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const res = await axios.post(
            `https://${MODE === "prod" ? "live" : "test"}.dodopayments.com/checkouts`,
            {
              product_cart: [
                {
                  product_id: process.env.PRO_PLAN_PRODUCT_ID,
                  quantity: 1,
                },
              ],
              return_url: `${process.env.VITE_WEBSITE_URL}/dashboard`,
              metadata: body.metadata || {},
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
              },
              validateStatus: () => true,
            }
          );

          if (!res.data?.checkout_url) {
            console.log(
              "res",
              MODE,
              `https://${MODE === "prod" ? "live" : "test"}.dodopayments.com/checkouts`
            );
            console.log({
              data: res.data,
              status: res.status,
              text: res.statusText,
            });

            throw new Error("Failed to create checkout");
          }
          console.log({ ok: true, url: res.data?.checkout_url });

          return new Response(
            JSON.stringify({ ok: true, url: res.data?.checkout_url })
          );
        } catch (error) {
          console.error("Error in checkout POST handler:", error);

          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
          );
        }
      },
    },
  },
});
