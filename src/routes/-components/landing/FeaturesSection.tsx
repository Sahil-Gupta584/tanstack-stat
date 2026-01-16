"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function ShieldIcon() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cipher-red/20 to-cipher-rose/20 rounded-full blur-xl" />
      <svg viewBox="0 0 100 120" className="w-28 h-28 relative">
        <motion.path
          d="M50 10 L85 25 L85 55 C85 75 70 95 50 105 C30 95 15 75 15 55 L15 25 Z"
          fill="none"
          stroke="#FF003C"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M35 55 L45 65 L65 45"
          fill="none"
          stroke="#FF003C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
        />
      </svg>
    </div>
  );
}

function SpeedBar() {
  return (
    <div className="w-full space-y-3">
      <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-cipher-red via-cipher-rose to-cipher-red rounded-full shadow-lg"
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 font-mono">Loading in 0.3ms</p>
    </div>
  );
}

function ServerIcon() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-24 h-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center px-3 gap-2 shadow-premium-sm"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
        >
          <div className="w-2 h-2 rounded-full bg-cipher-red animate-pulse shadow-lg shadow-cipher-red/50" />
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
        </motion.div>
      ))}
    </div>
  );
}

function LiveTicker() {
  const [count, setCount] = useState(12847);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 10 + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-cipher-red/10 rounded-2xl blur-2xl" />
      <div className="font-mono text-5xl md:text-6xl gradient-text font-extrabold tabular-nums relative">
        {count.toLocaleString()}
      </div>
    </div>
  );
}

const features = [
  {
    id: "privacy",
    title: "GDPR Compliant",
    description: "No cookies, no consent banners. Privacy by design.",
    size: "large",
    visual: <ShieldIcon />,
  },
  {
    id: "speed",
    title: "< 1KB Script",
    description: "Blazing fast. No impact on your site's performance.",
    size: "wide",
    visual: <SpeedBar />,
  },
  {
    id: "ownership",
    title: "Your Database",
    description: "Self-host your data. Full control, zero vendor lock-in.",
    size: "tall",
    visual: <ServerIcon />,
  },
  {
    id: "realtime",
    title: "Live Pulse",
    description: "Real-time analytics. See visitors as they happen.",
    size: "square",
    visual: <LiveTicker />,
  },
];

function FeatureCard({
  feature,
  className,
}: {
  feature: typeof features[0];
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`
        glass-card rounded-3xl p-8 md:p-10
        border border-gray-200 dark:border-gray-800
        shadow-premium-lg hover:shadow-premium-xl
        transition-premium hover-lift
        flex flex-col justify-between
        group
        ${className}
      `}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cipher-red/5 via-transparent to-cipher-rose/5 opacity-0 group-hover:opacity-100 transition-premium pointer-events-none" />

      <div className="relative">
        <span className="text-xs uppercase tracking-widest text-cipher-red font-bold mb-3 block">
          {feature.id}
        </span>
        <h3 className="font-extrabold text-3xl md:text-4xl text-ink dark:text-white mb-3 tracking-tight">
          {feature.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-medium">
          {feature.description}
        </p>
      </div>
      <div className="mt-8 flex justify-center items-center relative">{feature.visual}</div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      className="py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#0f0f11] dark:via-[#0a0a0c] dark:to-[#0f0f11] relative overflow-hidden"
      insightly-scroll="landing-features"
    >
      {/* Background Gradient Orb */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cipher-rose/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-cipher-red text-sm uppercase tracking-widest font-bold">
            Features
          </span>
          <h2 className="font-extrabold text-5xl md:text-6xl text-ink dark:text-white mt-6 tracking-tight">
            Built for the{" "}
            <span className="gradient-text">modern</span> web
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Large - Privacy */}
          <FeatureCard
            feature={features[0]}
            className="md:col-span-2 md:row-span-2"
          />
          {/* Wide - Speed */}
          <FeatureCard feature={features[1]} className="md:col-span-2" />
          {/* Square - Real-time */}
          <FeatureCard feature={features[3]} className="md:col-span-1" />
          {/* Tall - Ownership */}
          <FeatureCard feature={features[2]} className="md:col-span-1" />
        </div>
      </div>
    </section>
  );
}
