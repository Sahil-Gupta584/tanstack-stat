import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";
import type { BulkScanResult, SEOReport } from "@/lib/seo-types";
import { seo } from "@/lib/utils/client";
import { addToast, Button, Card, CardBody, Textarea } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import { SEOFooter } from "./-components/SEOFooter";

export const Route = createFileRoute("/seo-analyzer/bulk")({
  head: () => ({
    meta: [
      ...seo({
        title: "Bulk SEO Scanner | Insightly - Analyze Multiple URLs",
        description:
          "Analyze multiple URLs at once. Compare SEO scores across your entire site or competitor sites.",
        image: "https://www.insightly.live/images/open-graph.png",
        url: "https://www.insightly.live/seo-analyzer/bulk",
      }),
    ],
  }),
  component: BulkScanPage,
});

function BulkScanNav() {
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
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-premium relative group"
            >
              SEO Analyzer
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cipher-red group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/seo-analyzer/bulk"
              className="text-sm font-medium text-cipher-red relative group"
            >
              Bulk Scan
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cipher-red" />
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

function BulkScanPage() {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState<BulkScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urlList.length === 0) {
      addToast({
        color: "danger",
        title: "Error",
        description: "Please enter at least one URL",
      });
      return;
    }

    if (urlList.length > 10) {
      addToast({
        color: "danger",
        title: "Error",
        description: "Maximum 10 URLs per scan",
      });
      return;
    }

    setIsScanning(true);
    setResults(
      urlList.map((url) => ({
        url: url.startsWith("http") ? url : `https://${url}`,
        score: 0,
        status: "pending" as const,
      }))
    );

    // Scan each URL sequentially
    for (let i = 0; i < urlList.length; i++) {
      let urlToScan = urlList[i];
      if (!urlToScan.startsWith("http")) {
        urlToScan = `https://${urlToScan}`;
      }

      try {
        const response = await fetch("/api/seo/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlToScan }),
        });

        const data = await response.json();

        if (!response.ok) {
          setResults((prev) =>
            prev.map((r, idx) =>
              idx === i
                ? {
                    ...r,
                    status: "failed" as const,
                    error: data.error || "Failed to analyze",
                  }
                : r
            )
          );
        } else {
          setResults((prev) =>
            prev.map((r, idx) =>
              idx === i
                ? {
                    ...r,
                    status: "completed" as const,
                    score: data.overallScore,
                    report: data as SEOReport,
                  }
                : r
            )
          );
        }
      } catch (error) {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? {
                  ...r,
                  status: "failed" as const,
                  error: (error as Error).message,
                }
              : r
          )
        );
      }
    }

    setIsScanning(false);
    addToast({
      color: "success",
      description: "Bulk scan complete!",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <main className="bg-white dark:bg-[#0a0a0c] min-h-screen">
      <BulkScanNav />

      <section className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-extrabold text-4xl md:text-5xl text-ink dark:text-white mb-4">
              Bulk <span className="gradient-text">SEO Scan</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Analyze multiple URLs at once. Enter up to 10 URLs, one per line.
            </p>
          </motion.div>

          <Card className="glass-card border border-gray-200 dark:border-gray-800 shadow-premium-xl">
            <CardBody className="p-6">
              <Textarea
                label="Enter URLs (one per line)"
                placeholder="https://example.com&#10;https://example.com/about&#10;https://example.com/blog"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                minRows={6}
                classNames={{
                  inputWrapper:
                    "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
                }}
              />
              <Button
                onPress={handleScan}
                isLoading={isScanning}
                className="mt-4 w-full glow-effect bg-cipher-red hover:bg-cipher-dark text-white py-6 rounded-xl font-semibold text-base transition-premium"
              >
                {isScanning ? "Scanning..." : "Start Bulk Scan"}
              </Button>
            </CardBody>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              <h2 className="font-bold text-xl text-ink dark:text-white">
                Results
              </h2>
              {results.map((result, index) => (
                <Card
                  key={index}
                  className="glass-card border border-gray-200 dark:border-gray-800"
                >
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {result.status === "pending" && (
                          <FaSpinner className="text-gray-400 animate-spin" />
                        )}
                        {result.status === "completed" && (
                          <FaCheckCircle className="text-green-500" />
                        )}
                        {result.status === "failed" && (
                          <FaExclamationCircle className="text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-ink dark:text-white truncate max-w-md">
                            {result.url}
                          </p>
                          {result.error && (
                            <p className="text-sm text-red-500">
                              {result.error}
                            </p>
                          )}
                        </div>
                      </div>
                      {result.status === "completed" && (
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-2xl font-bold ${getScoreColor(result.score)}`}
                          >
                            {result.score}
                          </span>
                          <Link
                            to="/seo-analyzer"
                            search={{ url: result.url }}
                            className="text-cipher-red hover:underline text-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <SEOFooter />
    </main>
  );
}
