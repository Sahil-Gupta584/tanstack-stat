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
import { ThemeToggle } from "@/components/themeToggle";
import { ToastProvider } from "@heroui/react";

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
      <ToastProvider placement="top-center" />

      <Nav
        brandChild={
          <p className="cursor-pointer text-desc text-lg border-l-1 border-l-gray-500 px-2 ml-2">
            DOCUMENTATION
          </p>
        }
        endContent={<div className="flex items-center gap-2">
          <ThemeToggle />
          <BackBtn className='m-0' pathname="/dashboard" text="Dashboard" />
        </div>
        }
        className="mb-4"
      />
      <div className="flex gap-10 mt-18">
        <ul className="flex flex-col gap-2">
          <Link
            to="/docs"
            className={`relative hover:text-primary ${pathname === "/docs" ? "text-primary" : ""} transition inline-flex items-center  whitespace-nowrap`}
          >
            <LuDot className="stroke-[5px] absolute -left-[18px]" />
            Overview
          </Link>

          <Anchor
            href="/docs/revenue-attribution-guide"
            text="Revenue Attribution"
          />

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
          <Anchor href="/docs/embeddable-maps" text="Embeddable Maps" />
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
