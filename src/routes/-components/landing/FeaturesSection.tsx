"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 100 120" className="w-24 h-24">
      <motion.path
        d="M50 10 L85 25 L85 55 C85 75 70 95 50 105 C30 95 15 75 15 55 L15 25 Z"
        fill="none"
        stroke="#FF003C"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M35 55 L45 65 L65 45"
        fill="none"
        stroke="#FF003C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1 }}
      />
    </svg>
  );
}

function SpeedBar() {
  return (
    <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-cipher-red to-cipher-rose rounded-full"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}

function ServerIcon() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-20 h-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded border border-gray-200 dark:border-gray-600 flex items-center px-2 gap-1"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cipher-red animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
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
    <div className="font-mono text-4xl md:text-5xl text-cipher-red font-bold tabular-nums">
      {count.toLocaleString()}
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
      whileHover={{ y: -4, borderColor: "#FF003C" }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white dark:bg-[#1a1a1d] rounded-xl p-6 md:p-8
        border border-gray-200 dark:border-gray-800
        transition-all duration-300
        flex flex-col justify-between
        ${className}
      `}
    >
      <div>
        <span className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
          {feature.id}
        </span>
        <h3 className="font-editorial text-2xl md:text-3xl text-ink dark:text-white mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
          {feature.description}
        </p>
      </div>
      <div className="mt-6 flex justify-center items-center">{feature.visual}</div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      className="py-24 bg-surface dark:bg-[#1a1a1d]"
      insightly-scroll="landing-features"
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cipher-red text-sm uppercase tracking-widest font-medium">
            Features
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl text-ink dark:text-white mt-4">
            Built for the{" "}
            <em className="text-cipher-red italic">modern</em> web
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
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
