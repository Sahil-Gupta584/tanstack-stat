"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const showcaseImages = [
  {
    id: "mobile",
    label: "Mobile",
    aspectRatio: "aspect-[9/16]",
  },
  {
    id: "tablet",
    label: "Tablet",
    aspectRatio: "aspect-[3/4]",
  },
  {
    id: "desktop",
    label: "Desktop",
    aspectRatio: "aspect-[16/10]",
  },
];

function DashboardPreview({ variant }: { variant: string }) {
  return (
    <div className="w-full h-full bg-white dark:bg-[#1a1a1d] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="h-6 sm:h-8 md:h-10 bg-surface dark:bg-[#131315] border-b border-gray-100 dark:border-gray-800 flex items-center px-2 sm:px-3">
        <div className="flex gap-1 sm:gap-1.5">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cipher-red" />
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400" />
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400" />
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
        {/* Stats */}
        <div className={`grid gap-1.5 sm:gap-2 ${variant === "mobile" ? "grid-cols-2" : "grid-cols-4"}`}>
          {[1, 2, 3, 4].slice(0, variant === "mobile" ? 2 : 4).map((i) => (
            <div
              key={i}
              className="bg-surface dark:bg-[#23272f] rounded p-1.5 sm:p-2 md:p-3"
            >
              <div className="h-1.5 sm:h-2 w-8 sm:w-12 bg-gray-200 dark:bg-gray-700 rounded mb-1.5 sm:mb-2" />
              <div className="h-3 sm:h-4 w-10 sm:w-16 bg-cipher-red/20 rounded" />
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-surface dark:bg-[#23272f] rounded p-2 sm:p-3">
          <div className="h-1.5 sm:h-2 w-12 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 sm:mb-3" />
          <div className="flex items-end gap-0.5 sm:gap-1 h-12 sm:h-20 md:h-32">
            {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-cipher-red to-cipher-rose rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Table */}
        {variant !== "mobile" && (
          <div className="bg-surface dark:bg-[#23272f] rounded p-2 sm:p-3 space-y-1.5 sm:space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2 sm:gap-3 items-center">
                <div className="h-1.5 sm:h-2 w-16 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-1.5 sm:h-2 w-10 sm:w-16 bg-cipher-red/20 rounded" />
                <div className="h-1.5 sm:h-2 w-8 sm:w-12 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ParallaxWindow({
  variant,
  index,
}: {
  variant: typeof showcaseImages[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-gray-300 dark:border-gray-700 shadow-xl sm:shadow-2xl shadow-black/15 dark:shadow-black/40 group hover:shadow-3xl hover:shadow-cipher-red/15 dark:hover:shadow-cipher-red/25 transition-all duration-500 ${variant.aspectRatio}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <motion.div
        className="absolute inset-0 origin-center transition-transform duration-500 group-hover:scale-110"
        style={{ y, scale }}
      >
        <DashboardPreview variant={variant.id} />
      </motion.div>

      {/* Label */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/90 dark:bg-ink/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
        <span className="text-[10px] sm:text-xs font-medium text-ink dark:text-white">
          {variant.label}
        </span>
      </div>
    </motion.div>
  );
}

export default function ShowcaseSection() {
  return (
    <section
      className="py-12 sm:py-16 md:py-24 bg-gray-50 dark:bg-[#0f0f11] overflow-hidden"
      insightly-scroll="landing-showcase"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <span className="text-cipher-red text-xs sm:text-sm uppercase tracking-widest font-medium">
            Showcase
          </span>
          <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-ink dark:text-white mt-3 sm:mt-4">
            Beautiful on{" "}
            <span className="text-cipher-red">every</span> device
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 items-center">
          {/* Mobile */}
          <div className="max-w-[200px] sm:max-w-[240px] md:max-w-[280px] mx-auto sm:mx-auto md:mx-0">
            <ParallaxWindow variant={showcaseImages[0]} index={0} />
          </div>

          {/* Tablet */}
          <div className="max-w-[260px] sm:max-w-[300px] md:max-w-[360px] mx-auto">
            <ParallaxWindow variant={showcaseImages[1]} index={1} />
          </div>

          {/* Desktop */}
          <div className="sm:col-span-2 md:col-span-1 max-w-[320px] sm:max-w-full mx-auto">
            <ParallaxWindow variant={showcaseImages[2]} index={2} />
          </div>
        </div>
      </div>
    </section>
  );
}
