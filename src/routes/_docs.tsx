import { Nav } from "@/components/navbar";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { LucideDot } from "lucide-react";
import { LuDot } from "react-icons/lu";
import BackBtn from "./_dashboard/dashboard/$websiteId/-components/backBtn";

export const Route = createFileRoute("/_docs")({
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  function Anchor({
    href,
    text,
    isIcon,
  }: {
    href: string;
    text: string;
    isBold?: boolean;
    isIcon?: boolean;
  }) {
    return (
      <Link
        to={href}
        className={`hover:text-primary ${pathname === href ? "text-primary" : ""} transition inline-flex items-center  whitespace-nowrap`}
      >
        {isIcon && <LucideDot className="stroke-[5px]" />}
        {text}
      </Link>
    );
  }

  return (
    <main className=" max-w-[68rem] mx-auto p-10 pt-2">
      <Nav
        brandChild={
          <p className="cursor-pointer text-desc text-lg border-l-1 border-l-gray-500 px-2 ml-2">
            DOCUMENTATION
          </p>
        }
        endContent={<BackBtn pathname="/dashboard" text="Dashboard" />}
        className="mb-4"
      />
      <div className="flex gap-10 mt-6">
        <ul className="flex flex-col gap-2">
          <Link
            to="/docs/revenue-attribution-guide"
            className={`relative hover:text-primary ${pathname === "/docs/revenue-attribution-guide" ? "text-primary" : ""} transition inline-flex items-center  whitespace-nowrap`}
          >
            <LuDot className="stroke-[5px] absolute -left-[18px]" />
            Get Started
          </Link>

          <Anchor href="/docs/stripe-checkout-api" text="Stripe Checkout API" />
          <Anchor
            href="/docs/stripe-payment-links"
            text="Stripe Payment Links"
          />

          <Anchor href="/docs/polar-checkout-api" text="Polar Checkout API" />
          <Anchor href="/docs/polar-payment-links" text="Polar Payment Links" />

          <Anchor
            href="/docs/dodo-checkout-api"
            text="DodoPayments Checkout API"
          />
          <Anchor href="/docs/dodo-payment-links" text="DodoPayment Links" />
          <Link
            to="/docs/custom-goals"
            className={`relative hover:text-primary ${pathname === "/docs/custom-goals" ? "text-primary" : ""} transition inline-flex items-center  whitespace-nowrap`}
          >
            <LuDot className="stroke-[5px] absolute -left-[18px]" />
            Custom Goals
          </Link>
        </ul>
        <Outlet />
      </div>
    </main>
  );
}
