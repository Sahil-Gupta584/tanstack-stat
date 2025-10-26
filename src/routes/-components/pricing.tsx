import axios from "axios";

import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { MODE } from "@/configs/appwrite/serverConfig";
import { plans } from "@/lib/billingsdk-config";
import type { User } from "@/lib/types";
import { tryCatchWrapper } from "@/lib/utils/client";
import { useRouter } from "@tanstack/react-router";

export default function Pricing({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleCheckout(plan: string) {
    tryCatchWrapper({
      callback: async () => {
        if (!user) {
          router.navigate({ to: "/auth", search: { redirect: "/#pricing" } });
          return;
        }

        if (plan === "starter") {
          router.navigate({ to: "/dashboard" });
          return;
        }
        const res = await axios.post("/api/checkout", {
          productCart: [
            {
              product_id:
                MODE === "prod"
                  ? "pdt_FCjy9waPRfLCYi4A9GOE9"
                  : "pdt_DSA9O6S2nmuxXO00BJo8U",
              // product_id: "pdt_XGbXVXCAo3wFJI9AbIe1I",//ont time
              quantity: 1,
              amount: 9,
            },
          ],
          customer: {
            email: user.email,
            name: user.name,
          },
          return_url: window.location.origin + "/dashboard",
        });

        if (res.data?.url) {
          window.location.href = res.data.url;
        }
      },
    });
  }

  return (
    <article id="pricing">
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <PricingTableOne
          className="bg-transparent"
          onPlanSelect={handleCheckout}
          theme={"classic"}
          plans={plans}
          description="Pay only when you scale 🚀🚀"
        />
      </div>
    </article>
  );
}
