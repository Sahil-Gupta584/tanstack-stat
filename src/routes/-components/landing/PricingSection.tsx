"use client";

import type { User } from "@/lib/types";
import { Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
        relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-10 flex flex-col card-premium
        ${plan.dark
          ? "bg-gradient-to-br from-ink via-[#1a1a1d] to-ink dark:from-white dark:via-gray-50 dark:to-white text-white dark:text-ink"
          : "glass-card"
        }
        ${plan.popular
          ? "border-2 border-cipher-red shadow-premium-xl ring-2 sm:ring-4 ring-cipher-red/10 dark:ring-cipher-red/20 md:scale-105 z-10"
          : "border border-gray-200 dark:border-gray-800 shadow-premium-lg hover:shadow-premium-xl"
        }
        transition-premium hover:scale-[1.02]
      `}
    >
      {/* Gradient Glow for Popular Card */}
      {plan.popular && (
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cipher-red/20 via-cipher-rose/10 to-transparent opacity-50 blur-xl -z-10" />
      )}

      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-premium-1 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-premium-md whitespace-nowrap">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Name */}
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h3 className="text-sm sm:text-base font-semibold opacity-70 uppercase tracking-wider">{plan.name}</h3>
        <div className="mt-2 sm:mt-4 flex items-baseline gap-1">
          <span className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight">{plan.price}</span>
          <span className="text-base sm:text-lg opacity-60 font-medium">{plan.period}</span>
        </div>
        <p className={`text-xs sm:text-sm mt-2 sm:mt-3 font-medium ${plan.popular ? "text-cipher-red" : "opacity-70"}`}>
          {plan.description}
        </p>
      </div>

      {/* Gradient Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-cipher-red/30 to-transparent my-4 sm:my-6 md:my-8" />

      {/* Features */}
      <ul className="space-y-2.5 sm:space-y-3 md:space-y-4 flex-grow">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
            <FaCheck className={`mt-0.5 sm:mt-1 flex-shrink-0 text-cipher-red w-3 h-3 sm:w-4 sm:h-4`} />
            <span className="opacity-90 font-medium">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        as={Link}
        to={user?.$id ? "/dashboard" : "/auth"}
        className={`
          w-full mt-6 sm:mt-8 md:mt-10 py-5 sm:py-6 md:py-7 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-premium glow-effect
          ${plan.popular
            ? "bg-cipher-red hover:bg-cipher-dark text-white shadow-premium-md hover:shadow-premium-lg"
            : plan.dark
              ? "bg-white dark:bg-ink text-ink dark:text-white hover:bg-cipher-red hover:text-white dark:hover:bg-cipher-red dark:hover:text-white shadow-premium-sm hover:shadow-premium-md"
              : "bg-ink dark:bg-white text-white dark:text-ink hover:bg-cipher-red dark:hover:bg-cipher-red dark:hover:text-white shadow-premium-sm hover:shadow-premium-md"
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
      className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-[#0a0a0c] dark:via-[#0f0f11]/50 dark:to-[#0a0a0c] relative overflow-hidden"
      insightly-scroll="landing-pricing"
    >
      {/* Background Gradient Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] rounded-full bg-gradient-to-br from-cipher-red/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16 md:mb-20"
        >
          <span className="text-cipher-red text-xs sm:text-sm uppercase tracking-widest font-bold">
            Pricing
          </span>
          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink dark:text-white mt-4 sm:mt-6 tracking-tight">
            Simple,{" "}
            <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mt-4 sm:mt-6 max-w-2xl mx-auto px-4">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-stretch">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} user={user} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
