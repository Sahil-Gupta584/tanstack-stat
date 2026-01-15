"use client";

import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import type { User } from "@/lib/types";
import { FaCheck } from "react-icons/fa6";

const plans = [
  {
    id: "hobby",
    name: "Hobby",
    price: "$0",
    period: "/mo",
    description: "Free forever",
    features: [
      "Up to 10,000 events/mo",
      "1 website",
      "Basic analytics",
      "7-day data retention",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
    dark: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "Most Popular",
    features: [
      "Up to 100,000 events/mo",
      "Unlimited websites",
      "Advanced analytics",
      "Unlimited data retention",
      "Priority support",
      "Custom events",
      "API access",
    ],
    cta: "Start Pro Trial",
    popular: true,
    dark: false,
  },
  {
    id: "scale",
    name: "Scale",
    price: "Custom",
    period: "",
    description: "Enterprise ready",
    features: [
      "Unlimited events",
      "Unlimited websites",
      "White-label options",
      "Dedicated infrastructure",
      "24/7 support",
      "SLA guarantee",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
    dark: true,
  },
];

function PricingCard({
  plan,
  user,
  index,
}: {
  plan: typeof plans[0];
  user: User | null;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`
        relative serrated-edge rounded-2xl p-8 flex flex-col
        ${plan.dark
          ? "bg-ink dark:bg-white text-white dark:text-ink"
          : "bg-white dark:bg-[#1a1a1d] text-ink dark:text-white"
        }
        ${plan.popular
          ? "border-2 border-cipher-red shadow-2xl shadow-cipher-red/30 dark:shadow-cipher-red/40 scale-105 z-10 ring-4 ring-cipher-red/10 dark:ring-cipher-red/20"
          : "border-2 border-gray-300 dark:border-gray-700 shadow-xl shadow-black/10 dark:shadow-black/30 hover:shadow-2xl hover:shadow-cipher-red/10 dark:hover:shadow-cipher-red/20"
        }
        transition-all duration-300 hover:scale-[1.02]
      `}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-cipher-red text-white text-xs font-medium px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Name */}
      <div className="mb-6">
        <h3 className="text-lg font-medium opacity-60">{plan.name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-extrabold text-5xl">{plan.price}</span>
          <span className="text-sm opacity-60">{plan.period}</span>
        </div>
        <p className={`text-sm mt-2 ${plan.popular ? "text-cipher-red" : "opacity-60"}`}>
          {plan.description}
        </p>
      </div>

      {/* Dotted Separator */}
      <div className="border-t-2 border-dashed border-cipher-red/30 my-6" />

      {/* Features */}
      <ul className="space-y-3 flex-grow">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <FaCheck className={`mt-0.5 flex-shrink-0 ${plan.dark ? "text-cipher-red" : "text-cipher-red"}`} />
            <span className="opacity-80">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        as={Link}
        to={user?.$id ? "/dashboard" : "/auth"}
        className={`
          w-full mt-8 py-6 rounded-xl font-medium transition-all duration-300
          ${plan.popular
            ? "bg-cipher-red hover:bg-cipher-dark text-white"
            : plan.dark
              ? "bg-white dark:bg-ink text-ink dark:text-white hover:bg-cipher-red hover:text-white"
              : "bg-ink dark:bg-white text-white dark:text-ink hover:bg-cipher-red dark:hover:bg-cipher-red dark:hover:text-white"
          }
        `}
      >
        {plan.cta}
      </Button>
    </motion.div>
  );
}

export default function PricingSection({ user }: { user: User | null }) {
  return (
    <section
      id="pricing"
      className="py-24 bg-white dark:bg-[#0a0a0c]"
      insightly-scroll="landing-pricing"
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cipher-red text-sm uppercase tracking-widest font-medium">
            Pricing
          </span>
          <h2 className="font-extrabold text-4xl md:text-5xl text-ink dark:text-white mt-4">
            Simple,{" "}
            <span className="text-cipher-red">transparent</span> pricing
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-stretch">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} user={user} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
