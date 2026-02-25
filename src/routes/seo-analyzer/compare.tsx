import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";
import type { SEOReport, SEOStatus } from "@/lib/seo-types";
import { seo } from "@/lib/utils/client";
import { addToast, Button, Card, CardBody, Input } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { SEOFooter } from "./-components/SEOFooter";

export const Route = createFileRoute("/seo-analyzer/compare")({
  head: () => ({
    meta: [
      ...seo({
        title: "Compare SEO | Insightly - Side-by-Side URL Comparison",
        description:
          "Compare SEO performance between two URLs. See which page is better optimized.",
        image: "https://www.insightly.live/images/open-graph.png",
        url: "https://www.insightly.live/seo-analyzer/compare",
      }),
    ],
  }),
  component: ComparePage,
});

function CompareNav() {
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
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-premium relative group"
            >
              Bulk Scan
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cipher-red group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/seo-analyzer/compare"
              className="text-sm font-medium text-cipher-red relative group"
            >
              Compare
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cipher-red" />
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

function getStatusIcon(status: SEOStatus) {
  switch (status) {
    case "pass":
      return <FaCheckCircle className="text-green-500" />;
    case "warning":
      return <FaExclamationTriangle className="text-yellow-500" />;
    case "fail":
      return <FaExclamationCircle className="text-red-500" />;
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

function getScoreGradient(score: number) {
  if (score >= 80) return "from-green-500 to-emerald-500";
  if (score >= 60) return "from-yellow-500 to-orange-500";
  return "from-red-500 to-rose-500";
}

function ComparePage() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [report1, setReport1] = useState<SEOReport | null>(null);
  const [report2, setReport2] = useState<SEOReport | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = async () => {
    if (!url1 || !url2) {
      addToast({
        color: "danger",
        title: "Error",
        description: "Please enter both URLs",
      });
      return;
    }

    setIsComparing(true);
    setReport1(null);
    setReport2(null);

    try {
      const [res1, res2] = await Promise.all([
        fetch("/api/seo/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: url1.startsWith("http") ? url1 : `https://${url1}`,
          }),
        }),
        fetch("/api/seo/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: url2.startsWith("http") ? url2 : `https://${url2}`,
          }),
        }),
      ]);

      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

      if (!res1.ok) {
        addToast({
          color: "danger",
          title: "Error",
          description: `URL 1: ${data1.error}`,
        });
      } else {
        setReport1(data1);
      }

      if (!res2.ok) {
        addToast({
          color: "danger",
          title: "Error",
          description: `URL 2: ${data2.error}`,
        });
      } else {
        setReport2(data2);
      }

      addToast({
        color: "success",
        description: "Comparison complete!",
      });
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error",
        description: (error as Error).message,
      });
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <main className="bg-white dark:bg-[#0a0a0c] min-h-screen">
      <CompareNav />

      <section className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-extrabold text-4xl md:text-5xl text-ink dark:text-white mb-4">
              Compare <span className="gradient-text">SEO</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              See how two pages stack up against each other
            </p>
          </motion.div>

          <Card className="glass-card border border-gray-200 dark:border-gray-800 shadow-premium-xl">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                <Input
                  label="First URL"
                  placeholder="https://example.com"
                  value={url1}
                  onChange={(e) => setUrl1(e.target.value)}
                  classNames={{
                    inputWrapper:
                      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
                  }}
                />
                <div className="hidden md:flex items-center justify-center h-full pb-2">
                  <span className="text-gray-400 text-xl">vs</span>
                </div>
                <Input
                  label="Second URL"
                  placeholder="https://competitor.com"
                  value={url2}
                  onChange={(e) => setUrl2(e.target.value)}
                  classNames={{
                    inputWrapper:
                      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
                  }}
                />
              </div>
              <Button
                onPress={handleCompare}
                isLoading={isComparing}
                className="mt-6 w-full glow-effect bg-cipher-red hover:bg-cipher-dark text-white py-6 rounded-xl font-semibold text-base transition-premium"
              >
                {isComparing ? "Comparing..." : "Compare URLs"}
              </Button>
            </CardBody>
          </Card>

          {/* Comparison Results */}
          {report1 && report2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-8"
            >
              {/* Score Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* URL 1 Score */}
                <Card className="glass-card border border-gray-200 dark:border-gray-800">
                  <CardBody className="p-6 text-center">
                    <div
                      className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getScoreGradient(report1.overallScore)} p-1`}
                    >
                      <div className="w-full h-full rounded-full bg-white dark:bg-[#0f0f11] flex items-center justify-center">
                        <span
                          className={`text-3xl font-bold ${getScoreColor(report1.overallScore)}`}
                        >
                          {report1.overallScore}
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 font-medium text-ink dark:text-white truncate">
                      {report1.domain}
                    </p>
                    <div className="flex justify-center gap-4 mt-2 text-sm">
                      <span className="text-red-500">
                        {report1.summary.critical} critical
                      </span>
                      <span className="text-yellow-500">
                        {report1.summary.warnings} warnings
                      </span>
                    </div>
                  </CardBody>
                </Card>

                {/* Winner Badge */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    {report1.overallScore > report2.overallScore ? (
                      <>
                        <FaArrowRight className="text-4xl text-green-500 rotate-180 mx-auto mb-2" />
                        <p className="text-green-500 font-bold">
                          URL 1 Wins by{" "}
                          {report1.overallScore - report2.overallScore} points
                        </p>
                      </>
                    ) : report2.overallScore > report1.overallScore ? (
                      <>
                        <FaArrowRight className="text-4xl text-green-500 mx-auto mb-2" />
                        <p className="text-green-500 font-bold">
                          URL 2 Wins by{" "}
                          {report2.overallScore - report1.overallScore} points
                        </p>
                      </>
                    ) : (
                      <p className="text-yellow-500 font-bold">It's a tie!</p>
                    )}
                  </div>
                </div>

                {/* URL 2 Score */}
                <Card className="glass-card border border-gray-200 dark:border-gray-800">
                  <CardBody className="p-6 text-center">
                    <div
                      className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getScoreGradient(report2.overallScore)} p-1`}
                    >
                      <div className="w-full h-full rounded-full bg-white dark:bg-[#0f0f11] flex items-center justify-center">
                        <span
                          className={`text-3xl font-bold ${getScoreColor(report2.overallScore)}`}
                        >
                          {report2.overallScore}
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 font-medium text-ink dark:text-white truncate">
                      {report2.domain}
                    </p>
                    <div className="flex justify-center gap-4 mt-2 text-sm">
                      <span className="text-red-500">
                        {report2.summary.critical} critical
                      </span>
                      <span className="text-yellow-500">
                        {report2.summary.warnings} warnings
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Detailed Comparison */}
              <Card className="glass-card border border-gray-200 dark:border-gray-800">
                <CardBody className="p-6">
                  <h3 className="font-bold text-xl text-ink dark:text-white mb-6">
                    Check-by-Check Comparison
                  </h3>
                  <div className="space-y-2">
                    {report1.checks.map((check1) => {
                      const check2 = report2.checks.find(
                        (c) => c.id === check1.id
                      );
                      if (!check2) return null;

                      const isDifferent = check1.status !== check2.status;

                      return (
                        <div
                          key={check1.id}
                          className={`grid grid-cols-[1fr,2fr,1fr] gap-4 p-3 rounded-lg ${
                            isDifferent
                              ? "bg-cipher-red/5 border border-cipher-red/20"
                              : "bg-gray-50 dark:bg-gray-900/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {getStatusIcon(check1.status)}
                            <span
                              className={`text-sm ${
                                check1.status === "pass"
                                  ? "text-green-600 dark:text-green-400"
                                  : check1.status === "warning"
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {check1.status}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="font-medium text-ink dark:text-white">
                              {check1.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <span
                              className={`text-sm ${
                                check2.status === "pass"
                                  ? "text-green-600 dark:text-green-400"
                                  : check2.status === "warning"
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {check2.status}
                            </span>
                            {getStatusIcon(check2.status)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      <SEOFooter />
    </main>
  );
}
