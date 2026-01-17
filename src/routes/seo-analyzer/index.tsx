import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";
import { seo } from "@/lib/utils/client";
import { Button } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { SEOAnalyzerForm } from "./-components/SEOAnalyzerForm";
import { SEOChecksGrid } from "./-components/SEOChecksGrid";
import { SEOFAQSection } from "./-components/SEOFAQSection";
import { SEOFooter } from "./-components/SEOFooter";
import { SEOHowItWorks } from "./-components/SEOHowItWorks";
import { SEOReport } from "./-components/SEOReport";
import { SEOToolsSection } from "./-components/SEOToolsSection";
import type { SEOReport as SEOReportType } from "@/lib/seo-types";

export const Route = createFileRoute("/seo-analyzer/")({
  head: () => ({
    meta: [
      ...seo({
        title: "SEO Analyzer | Insightly - Free SEO Audit Tool",
        description:
          "Get a prioritized checklist of high-impact SEO issues in seconds. Analyze 27+ on-page factors including title, meta, headings, schema, and more.",
        image: "https://www.insightly.live/images/open-graph.png",
        url: "https://www.insightly.live/seo-analyzer",
        keywords:
          "seo analyzer, seo audit, seo checker, free seo tool, website analysis, on-page seo, meta tags, schema markup",
      }),
    ],
  }),
  component: SEOAnalyzerPage,
});

function SEOAnalyzerNav() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-premium bg-white/80 dark:bg-[#0a0a0c]/80 border-b border-gray-200/80 dark:border-gray-800/80 shadow-premium-md"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="flex items-center gap-3 font-bold text-xl text-ink dark:text-white transition-premium hover:opacity-80"
          >
            <Logo className="h-6" />
            <span className="tracking-tight">Insightly</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/seo-analyzer"
              className="text-sm font-medium text-cipher-red relative group"
            >
              SEO Analyzer
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cipher-red" />
            </Link>
            <Link
              to="/seo-analyzer/bulk"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-premium relative group"
            >
              Bulk Scan
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cipher-red group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/seo-analyzer/compare"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-premium relative group"
            >
              Compare
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cipher-red group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/seo-analyzer/schema"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-premium relative group"
            >
              Schema
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cipher-red group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/seo-analyzer/serp"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-premium relative group"
            >
              SERP Preview
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cipher-red group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              as={Link}
              to="/"
              className="glow-effect bg-cipher-red hover:bg-cipher-dark text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-premium shadow-premium-sm hover:shadow-premium-md"
            >
              Analytics
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function SEOAnalyzerPage() {
  const [report, setReport] = useState<SEOReportType | null>(null);

  return (
    <main className="bg-white dark:bg-[#0a0a0c] min-h-screen">
      <SEOAnalyzerNav />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-40 pb-32 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-[#0a0a0c] dark:via-[#0f0f11] dark:to-[#0a0a0c]">
        {/* Background Orb */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb-float absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-cipher-rose/30 via-cipher-red/20 to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-premium font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-8">
              <span className="text-ink dark:text-white">SEO fixes you can </span>
              <span className="gradient-text">apply today</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
              Paste your URL and get a prioritized checklist of high-impact SEO
              issues in seconds. No bloated reports.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                27+ SEO Checks
              </span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                Instant Results
              </span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                Free Tier
              </span>
            </div>
          </motion.div>

          {/* URL Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SEOAnalyzerForm onReport={setReport} />
          </motion.div>

          {/* Results */}
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <SEOReport report={report} />
            </motion.div>
          )}
        </div>
      </section>

      {/* 27 SEO Checks Grid */}
      {!report && (
        <>
          <SEOChecksGrid />
          <SEOHowItWorks />
          <SEOToolsSection />
          <SEOFAQSection />
        </>
      )}

      <SEOFooter />
    </main>
  );
}
