import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaTwitter } from "react-icons/fa";
import { useTheme } from "next-themes";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

function TwitterMentionsVisual() {
  return (
    <div className="relative w-full h-32 sm:h-40 overflow-hidden">
      {[
        { user: "Alex", text: "Love this dashboard! 🔥", x: -20, top: 5 },
        { user: "Sarah", text: "Finally privacy-first maps.", x: 20, top: 45 },
        { user: "Devin", text: "Speed is unmatched. 🚀", x: -10, top: 85 },
        { user: "Michael", text: "Best analytics for X.", x: 15, top: 25 },
      ].map((tweet, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/50 dark:bg-white/5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-gray-100 dark:border-white/10 shadow-premium-sm flex gap-1.5 sm:gap-2 items-center backdrop-blur-sm w-[160px] sm:w-[200px]"
          style={{ top: tweet.top }}
          initial={{ opacity: 0, x: tweet.x }}
          whileInView={{ opacity: 1, x: tweet.x + 10 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.8 }}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-400/20 flex items-center justify-center shrink-0">
            <FaTwitter className="text-blue-400 size-2.5 sm:size-3" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] sm:text-[9px] font-bold text-gray-400">@{tweet.user}</p>
            <p className="text-[10px] sm:text-[11px] truncate font-medium">{tweet.text}</p>
          </div>
        </motion.div>
      ))}
      <div className="absolute right-0 bottom-0 opacity-5">
        <FaTwitter className="size-20 sm:size-32 text-blue-400" />
      </div>
    </div>
  );
}

function TwitterLinksVisual() {
  return (
    <div className="w-full flex flex-col gap-2">
      {[
        { label: "t.co/launch", revenue: "$240", visitors: 142 },
        { label: "t.co/update", revenue: "$180", visitors: 89 },
      ].map((link, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-white/5">
          <span className="text-xs font-mono text-gray-500">{link.label}</span>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] bg-green-400/20 text-green-500 px-2 rounded-full font-bold">{link.revenue}</span>
            <span className="text-[10px] bg-cipher-red/10 text-cipher-red px-2 rounded-full font-bold">{link.visitors}v</span>
          </div>
        </div>
      ))}
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

function LiveTicker() {
  const [count, setCount] = useState(128);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 10 + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-cipher-red/10 rounded-xl sm:rounded-2xl blur-2xl" />
      <div className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl gradient-text font-extrabold tabular-nums relative">
        {count.toLocaleString()}
      </div>
    </div>
  );
}


const features = [
  {
    id: "mentions",
    title: "Twitter Mentions",
    description: "Listen to the conversation. Track every brand mention in real-time so you can engage with your audience when they're most active.",
    size: "wide",
    visual: <TwitterMentionsVisual />,
  },
  {
    id: "links",
    title: "Twitter Attribution",
    description: "Stop guessing which posts work. Track direct revenue from every t.co link to accurately measure your social ROI.",
    size: "wide",
    visual: <TwitterLinksVisual />,
  },
  {
    id: "speed",
    title: "< 1KB Script",
    description: "Keep your site fast and SEO-friendly. Our tiny script ensures zero impact on your Core Web Vitals while avoiding ad-blockers.",
    size: "square",
    visual: <SpeedBar />,
  },
  {
    id: "realtime",
    title: "Live Pulse",
    description: "Monitor launches as they happen. Watch your conversion funnel in real-time so you can capitalize on traffic surges instantly.",
    size: "square",
    visual: <LiveTicker />,
  },
  {
    id: "maps",
    title: "Embeddable Charts",
    description: "Showcase your reach. Effortlessly embed beautiful, live location maps on your portfolio or public dashboard.",
    size: "wide",
    visual: <div />,
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
        glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10
        border border-gray-200 dark:border-gray-800
        shadow-premium-lg hover:shadow-premium-xl
        transition-premium hover-lift
        flex flex-col justify-between
        group relative
        ${className}
      `}
    >
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cipher-red/5 via-transparent to-cipher-rose/5 opacity-0 group-hover:opacity-100 transition-premium pointer-events-none" />

      <div className="relative">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-cipher-red font-bold mb-2 sm:mb-3 block">
          {feature.id}
        </span>
        <h3 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-ink dark:text-white mb-2 sm:mb-3 tracking-tight">
          {feature.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
          {feature.description}
        </p>
      </div>
      <div className="mt-5 sm:mt-6 md:mt-8 flex justify-center items-center relative">{feature.visual}</div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgColor = resolvedTheme === "dark" ? "%230d0d0f" : "%23f9fafb";
  const iframeUrl = `${import.meta.env.VITE_WEBSITE_URL}/share/68d124eb001034bd8493/location?duration=last_7_days&primaryColor=%23FF003C&bgColor=${bgColor}&showLive=false`;

  return (
    <section
      className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#0f0f11] dark:via-[#0a0a0c] dark:to-[#0f0f11] relative overflow-hidden"
      insightly-scroll="landing-features"
    >
      {/* Background Gradient Orb */}
      <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] rounded-full bg-gradient-to-br from-cipher-rose/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16 md:mb-20"
        >
          <span className="text-cipher-red text-xs sm:text-sm uppercase tracking-widest font-bold">
            Features
          </span>
          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink dark:text-white mt-4 sm:mt-6 tracking-tight">
            Built for the{" "}
            <span className="gradient-text">modern</span> web
          </h2>
        </motion.div>

        {/* Bento Grid: Refined Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Row 1: Twitter Focused Features */}
          <FeatureCard
            feature={features[0]}
            className="sm:col-span-1 md:col-span-2"
          />
          <FeatureCard feature={features[1]} className="sm:col-span-1 md:col-span-2" />

          {/* Row 2: Performance & Pulse */}
          <FeatureCard feature={features[2]} className="sm:col-span-1 md:col-span-2" />
          <FeatureCard feature={features[3]} className="sm:col-span-1 md:col-span-2" />

          {/* Row 3 - Unified Interactive Maps Showcase */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sm:col-span-2 md:col-span-4 relative glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-premium-xl group hover-lift transition-premium"
          >
            <div className="p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Left Side: Metadata */}
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-cipher-red font-bold mb-2 sm:mb-4 block">
                  {features[4].id}
                </span>
                <h3 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-ink dark:text-white mb-2 sm:mb-4 tracking-tight">
                  {features[4].title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-4 sm:mb-6">
                  {features[4].description}
                </p>
                <Link
                  to="/docs/embeddable-maps"
                  className="inline-flex items-center gap-2 text-cipher-red font-bold uppercase tracking-wider text-xs sm:text-sm hover:underline group/link"
                >
                  View Documentation
                  <FaExternalLinkAlt className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              {/* Right Side: Live Demo */}
              <div className="flex-1 lg:flex-[1.5]">
                {mounted ? (
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-premium-lg">
                    <iframe
                      src={iframeUrl}
                      width="100%"
                      className="insightly-0i7g border-none min-h-[250px] sm:min-h-[300px] md:min-h-[350px]"
                      title="Interactive Map Showcase"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                )}
              </div>
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cipher-red/5 via-transparent to-cipher-rose/5 opacity-0 group-hover:opacity-100 transition-premium pointer-events-none" />
          </motion.article>
        </div>

      </div>
    </section>
  );
}
