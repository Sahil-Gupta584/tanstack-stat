"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { User } from "@/lib/types";
import AddWebsiteForm from "../addWebsiteForm";

export default function HeroSection({ user }: { user: User | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const dashboardY = useTransform(scrollYProgress, [0, 1], [100, -50]);
  const dashboardOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-white dark:bg-[#0a0a0c]"
      insightly-scroll="landing-hero"
    >
      {/* Glowing Orb Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-cipher-rose/20 to-cipher-red/10 blur-3xl opacity-60" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Hero Text */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-extrabold text-5xl md:text-7xl lg:text-8xl text-ink dark:text-white leading-[1.1] tracking-tight">
            Know Your Visitors
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Understand who's visiting, where they come from and what keeps them engaged.
          </p>

          <div className="mt-10">
            <AddWebsiteForm user={user} />
          </div>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          style={{ y: dashboardY, opacity: dashboardOpacity }}
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <article className="my-15 bg-white dark:bg-[#1a1a1d] border-2 border-gray-300 dark:border-gray-700 mx-auto font-mono shadow-2xl shadow-black/20 dark:shadow-black/40 text-sm sm:text-xl rounded-2xl overflow-hidden relative group hover:shadow-3xl hover:shadow-cipher-red/20 dark:hover:shadow-cipher-red/30 transition-all duration-500 hover:border-cipher-red/50 dark:hover:border-cipher-red/60">
            <div className="relative flex items-center h-12 px-6 bg-gray-100 dark:bg-[#0f0f11] border-b-2 border-gray-300 dark:border-gray-700">
              <div className="flex space-x-2 absolute left-6">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
              </div>

              <p className="absolute left-1/2 -translate-x-1/2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-semibold">
                https://appwrite.insightly.network/syncmate.xyz
              </p>
            </div>

            <div className="p-0 leading-relaxed bg-white dark:bg-[#1a1a1d]">
              <article className="w-full">
                <iframe
                  src="/demo"
                  frameBorder="0"
                  className="w-full h-[600px] rounded-b-2xl bg-white dark:bg-[#1a1a1d]"
                  title="Demo"
                />
              </article>
            </div>
          </article>
        </motion.div>
      </div>
    </section>
  );
}
