"use client";
import axios from "axios";

import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { plans } from "@/lib/billingsdk-config";
import type { User } from "@/lib/types";
import { tryCatchWrapper } from "@/lib/utils/client";
import { polarBaseUrl } from "@/lib/utils/server";
import { useRouter } from "@tanstack/react-router";

export default function Pricing({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleCheckout(plan: string) {
    tryCatchWrapper({
      callback: async () => {
        if (plan === "starter") {
          router.navigate({ to: "/dashboard" });

          return;
        }
        const res = await axios.post(polarBaseUrl + "/checkouts", {
          metadata: {
            insightly_visitor_id: "912249d1-202d-4cd8-84c2-0c1a73aae874",
            insightly_session_id: "s60250873-e2f6-4243-aaff-5643b4b28657",
          },
          products: ["313644f9-2a08-4510-b428-939d2ec5a493"],
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
        />
      </div>
    </article>
  );
}
