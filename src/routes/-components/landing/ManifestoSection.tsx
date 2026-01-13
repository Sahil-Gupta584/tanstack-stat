"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const textReveal = useTransform(scrollYProgress, [0.1, 0.5], [0, 100]);

  const lines = [
    "We believe your users are people,",
    "not pixels.",
    "We track trends,",
    "not footprints.",
  ];

  return (
    <section
      ref={containerRef}
      className="py-32 md:py-48 bg-surface dark:bg-[#1a1a1d] overflow-hidden"
      insightly-scroll="landing-manifesto"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden"
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [0.1 + i * 0.08, 0.2 + i * 0.08],
                  [0.15, 1]
                ),
              }}
            >
              <motion.p
                className="font-editorial text-3xl md:text-5xl lg:text-6xl text-ink dark:text-white leading-tight md:leading-snug py-2"
                style={{
                  backgroundImage: `linear-gradient(90deg, #050505 0%, #050505 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                }}
              >
                {line}
              </motion.p>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cipher-red via-cipher-rose to-transparent"
                style={{
                  x: useTransform(
                    scrollYProgress,
                    [0.1 + i * 0.08, 0.25 + i * 0.08],
                    ["-100%", "100%"]
                  ),
                  mixBlendMode: "overlay",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
