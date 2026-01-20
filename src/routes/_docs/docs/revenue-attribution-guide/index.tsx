import LinkComponent from "@/components/link";
import { Alert } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import CommonCards from "./-commonCards";

export const Route = createFileRoute("/_docs/docs/revenue-attribution-guide/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedProvider, setSelectedProvider] = useState("None");
  const websiteId = new URL(window.location.href).searchParams.get("websiteId");

  const providers = [
    {
      name: "Stripe",
      src: "/images/payment-providers/icon-stripe.webp",
      cards: <CommonCards provider="Stripe" />,
    },
    {
      name: "Polar",
      src: "/images/payment-providers/icon-polar.webp",
      cards: <CommonCards provider="Polar" />,
    },
    {
      name: "DodoPayments",
      src: "/images/payment-providers/icon-dodo.png",
      cards: <CommonCards provider="Dodo" />,
    },
  ];

  return (
    <div className="space-y-10">
      <div className=" space-y-2">
        <h2 className="font-bold text-3xl">Revenue attribution guide</h2>
        <p className="">
          After
          <LinkComponent
            href={
              websiteId
                ? `/dashboard/${websiteId}/settings?tab=revenue`
                : "/dashboard"
            }
            text="connecting a payment provider"
            isBold
          />
          , link your revenue to traffic sources to find out which marketing
          channels drive your revenue.
          {/* You'll also unlock
                  Journeys, Revenue Predictions, and Insights, and more! 🤑 */}
        </p>
      </div>
      <div>
        <p className="text-xl font-medium mb-4">
          1. What payment provider do you use?
        </p>
        <div className="grid grid-cols-3 gap-4">
          {providers.map((p) => (
            <div
              role="button"
              key={p.name}
              className="border-0 outline-none"
              onClick={() => setSelectedProvider(p.name)}
            >
              <img
                src={p.src}
                alt={p.name}
                className={`grow h-full rounded-3xl cursor-pointer transition p-1  ${selectedProvider === p.name ? `opacity-100 border-pink-400 border-3` : `opacity-50`} ${selectedProvider === `None` ? `opacity-100` : ``} object-fill hover:scale-[1.02]`}
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xl font-bold mb-4">
          2. How do you charge your customers?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.find((p) => p.name === selectedProvider) ? (
            providers.find((p) => p.name === selectedProvider)?.cards
          ) : (
            <Alert
              title="Select your payment provider first"
              color="warning"
              variant="bordered"
              className="mt-2 px-4 py-2 font-semibold dark"
              radius="lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}
