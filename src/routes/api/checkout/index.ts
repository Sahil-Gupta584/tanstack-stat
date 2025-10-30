import { MODE } from "@/configs/appwrite/serverConfig";
import { getGeo } from "@/lib/utils/server";
import { createFileRoute } from "@tanstack/react-router";
import { getCookies } from "@tanstack/react-start/server";
import axios from "axios";
import z from "zod";
const productCartItemSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  amount: z.number().int().min(0).optional(),
});

const attachExistingCustomerSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});

const newCustomerSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().optional().nullable(),
  create_new_customer: z.boolean().optional(),
});

const customerSchema = z.union([
  attachExistingCustomerSchema,
  newCustomerSchema,
]);
const billingAddressSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z
    .string()
    .regex(/^[A-Z]{2}$/, "Country must be a 2-letter uppercase ISO code"),
  state: z.string().min(1, "State is required"),
  street: z.string().min(1, "Street address is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
});

const checkoutSessionSchema = z.object({
  productCart: z
    .array(productCartItemSchema)
    .min(1, "At least one product is required"),
  customer: customerSchema,
  billing_address: billingAddressSchema,
  return_url: z.string().url("Return URL must be a valid URL"),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const Route = createFileRoute("/api/checkout/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          let ip =
            request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";

          ip = ip === "::1" ? "103.190.15.171" : ip;

          const geo = await getGeo(ip);

          body.billing_address = {
            country: geo?.countryCode,
            city: geo?.city || "Unknown",
            state: geo?.region || "Unknown",
            street: "N/A",
            zipcode: geo?.postal || "000000",
          };
          const cookies = getCookies();
          const insightly_visitor_id = cookies.insightly_visitor_id;
          const insightly_session_id = cookies.insightly_session_id;

          if (insightly_visitor_id && insightly_session_id) {
            body.metadata = {
              insightly_session_id,
              insightly_visitor_id,
            };
          }

          const validationResult = checkoutSessionSchema.safeParse(body);

          if (!validationResult.success) {
            return new Response(
              JSON.stringify({
                error: "Validation failed",
                details: validationResult.error.issues.map((issue) => ({
                  field: issue.path.join("."),
                  message: issue.message,
                })),
              }),
              { status: 400 },
            );
          }

          const {
            productCart,
            customer,
            billing_address,
            return_url,
            metadata,
          } = validationResult.data;
          const res = await axios.post(
            `https://${MODE === "prod" ? "live" : "test"}.dodopayments.com/checkouts`,
            {
              product_cart: productCart,
              customer: customer,
              billing_address: billing_address,
              return_url: return_url,
              metadata,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
              },
              validateStatus: () => true,
            },
          );

          if (!res.data?.checkout_url) {
            console.log(
              "res",
              MODE,
              `https://${MODE === "prod" ? "live" : "test"}.dodopayments.com/checkouts`,
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
            JSON.stringify({ ok: true, url: res.data?.checkout_url }),
          );
        } catch (error) {
          console.error("Error in checkout POST handler:", error);

          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 },
          );
        }
      },
    },
  },
});
