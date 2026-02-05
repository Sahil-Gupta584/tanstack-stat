"use client";

import type { User } from "@/lib/types";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaExpand, } from "react-icons/fa6";
import AddWebsiteForm from "../addWebsiteForm";

// Type definitions for fullscreen API
interface FullscreenElement extends HTMLIFrameElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface FullscreenDocument extends Document {
  webkitFullscreenEnabled?: boolean;
  mozFullScreenEnabled?: boolean;
  msFullscreenEnabled?: boolean;
}

const isFullscreenSupported = () => {
  const doc = document as FullscreenDocument;
  return !!(
    doc.fullscreenEnabled ||
    doc.webkitFullscreenEnabled ||
    doc.mozFullScreenEnabled ||
    doc.msFullscreenEnabled
  );
};

export default function HeroSection({ user }: { user: User | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreenAvailable, setIsFullscreenAvailable] = useState(false);

  useEffect(() => {
    setIsFullscreenAvailable(isFullscreenSupported());
  }, []);

  const handleFullscreen = async () => {
    const element = iframeRef.current as FullscreenElement | null;
    if (!element) {
      return;
    }

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      } else {
        // Fallback: open in new tab
        window.open(element.src, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      // Fullscreen was denied or failed, fallback to new tab
      console.error("Fullscreen failed:", error);
      window.open(element.src, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpenInNewTab = () => {
    const element = iframeRef.current;
    if (element) {
      window.open(element.src, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-[#0a0a0c] dark:via-[#0f0f11] dark:to-[#0a0a0c]"
      insightly-scroll="landing-hero"
    >
      {/* Animated Glowing Orb Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-float absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[500px] sm:w-[700px] md:w-[1000px] h-[500px] sm:h-[700px] md:h-[1000px] rounded-full bg-gradient-to-br from-cipher-rose/30 via-cipher-red/20 to-transparent blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] rounded-full bg-gradient-to-br from-cipher-red/10 to-transparent blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Hero Text */}
        <motion.div
          className="text-center mb-10 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-premium font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight mb-4 sm:mb-6 md:mb-8">
            <span className="text-ink dark:text-white">Know Your </span>
            <span className="gradient-text">Visitors</span>
          </h1>
          <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed px-4 sm:px-0">
            Understand who's visiting, where they come from and what keeps them engaged.
          </p>

          <div className="mt-8 sm:mt-10 md:mt-12">
            <AddWebsiteForm user={user} />
          </div>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          {/* Premium Gradient Border Container */}
          <div className="relative p-[2px] rounded-2xl sm:rounded-3xl border-3 hover:border-pink-400 border-cipher-red animate-gradient-shift">
            <article className="relative mx-auto font-mono shadow-premium-xl rounded-2xl sm:rounded-3xl overflow-hidden group transition-premium">
              {/* Subtle Overlay on hover */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cipher-red/5 via-transparent to-cipher-rose/5 opacity-0 group-hover:opacity-100 transition-premium pointer-events-none" />

              <div className="relative flex items-center h-10 sm:h-12 md:h-14 px-3 sm:px-4 md:px-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#0f0f11] dark:to-[#131315] border-b border-gray-200 dark:border-gray-800">
                <div className="flex space-x-1.5 sm:space-x-2 md:space-x-2.5 absolute left-3 sm:left-4 md:left-6">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                </div>

                <p className="absolute left-1/2 -translate-x-1/2 text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 font-semibold">
                  insightly.live/demo
                </p>

                {/* Action Buttons */}
                <div className="absolute right-3 sm:right-4 md:right-6 flex items-center gap-1 sm:gap-2">
                  {isFullscreenAvailable && (
                    <button
                      onClick={handleFullscreen}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red"
                      aria-label="Fullscreen"
                      title="Fullscreen"
                    >
                      <FaExpand className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleOpenInNewTab}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red"
                    aria-label="Open in new tab"
                    title="Open in new tab"
                  >
                    <FaExternalLinkAlt className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1a1a1d]">
                <article className="w-full px-2 sm:px-4 md:px-8 lg:px-16">
                  <iframe
                    ref={iframeRef}
                    src="/demo"
                    frameBorder="0"
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
                    title="Dashboard Demo"
                    allowFullScreen
                  />
                </article>
              </div>
            </article>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
