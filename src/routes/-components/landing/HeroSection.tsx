"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import type { User } from "@/lib/types";

function DashboardMockup() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-[#1a1a1d] rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Browser Chrome */}
      <div className="flex items-center h-10 px-4 bg-surface dark:bg-[#131315] border-b border-gray-100 dark:border-gray-800">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-cipher-red" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="mx-auto text-xs text-gray-400 font-mono">
          app.insightly.live/dashboard
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Visitors", value: "24,847", change: "+12.5%" },
            { label: "Page Views", value: "89,421", change: "+8.2%" },
            { label: "Bounce Rate", value: "32.4%", change: "-2.1%" },
            { label: "Avg. Duration", value: "3m 42s", change: "+15.3%" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-surface dark:bg-[#23272f] p-4 rounded-lg border border-gray-100 dark:border-gray-700"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-ink dark:text-white font-mono mt-1">
                {stat.value}
              </p>
              <p className={`text-xs mt-1 ${stat.change.startsWith("+") ? "text-green-500" : "text-cipher-red"}`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="bg-surface dark:bg-[#23272f] p-6 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-ink dark:text-white">Visitors Overview</h3>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 rounded bg-cipher-red/10 text-cipher-red">Live</span>
            </div>
          </div>
          {/* Chart Lines */}
          <div className="h-32 flex items-end justify-between gap-1">
            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((height, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-cipher-red to-cipher-rose rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface dark:bg-[#23272f] p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-medium text-ink dark:text-white mb-3">Top Pages</h4>
            <div className="space-y-2">
              {["/home", "/pricing", "/docs", "/blog"].map((page, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-mono">{page}</span>
                  <span className="text-cipher-red font-mono">{Math.floor(Math.random() * 5000 + 1000)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface dark:bg-[#23272f] p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-medium text-ink dark:text-white mb-3">Traffic Sources</h4>
            <div className="space-y-2">
              {[
                { source: "Direct", pct: 42 },
                { source: "Google", pct: 31 },
                { source: "Twitter", pct: 18 },
                { source: "GitHub", pct: 9 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-cipher-red h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-20">{item.source}</span>
                  <span className="text-xs font-mono text-cipher-red">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-background dark:bg-[#131315]"
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
          <h1 className="font-editorial text-5xl md:text-7xl lg:text-8xl text-ink dark:text-white leading-tight tracking-tight">
            Analytics,{" "}
            <em className="text-cipher-red not-italic font-editorial italic">redefined</em>
            <br />
            for privacy.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-sans">
            The open-source suite. 1KB script. Zero cookies.{" "}
            <span className="text-ink dark:text-white font-medium">100% Data Ownership.</span>
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              as={Link}
              to={user?.$id ? "/dashboard" : "/auth"}
              size="lg"
              className="bg-cipher-red hover:bg-cipher-dark text-white px-8 py-6 text-lg font-medium rounded-xl transition-all duration-300"
            >
              Get Started Free
            </Button>
            <Button
              as="a"
              href="https://github.com/insightly"
              target="_blank"
              variant="bordered"
              size="lg"
              className="border-gray-300 dark:border-gray-600 text-ink dark:text-white px-8 py-6 text-lg font-medium rounded-xl hover:border-cipher-red hover:text-cipher-red transition-all duration-300"
            >
              View on GitHub
            </Button>
          </div>
        </motion.div>

        {/* Dashboard Mockup with Curtain Reveal */}
        <motion.div
          style={{ y: dashboardY, opacity: dashboardOpacity }}
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
