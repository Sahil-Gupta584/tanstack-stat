import type { SEOCheck, SEOReport as SEOReportType, SEOStatus } from "@/lib/seo-types";
import { Button, Card, CardBody, Tab, Tabs } from "@heroui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaLink,
} from "react-icons/fa";

interface SEOReportProps {
  report: SEOReportType;
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

function getStatusColor(status: SEOStatus) {
  switch (status) {
    case "pass":
      return "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400";
    case "warning":
      return "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400";
    case "fail":
      return "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400";
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

function SEOCheckItem({ check }: { check: SEOCheck }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-4 ${getStatusColor(check.status)} transition-all duration-200`}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {getStatusIcon(check.status)}
          <div>
            <h4 className="font-semibold">{check.name}</h4>
            {check.value && (
              <p className="text-sm opacity-80">{check.value}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              check.impact === "critical"
                ? "bg-red-500/20 text-red-600 dark:text-red-400"
                : check.impact === "warning"
                  ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                  : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
            }`}
          >
            {check.impact}
          </span>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-current/10"
        >
          <p className="text-sm opacity-80 mb-2">{check.description}</p>
          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3 mt-2">
            <p className="text-sm font-medium">Recommendation:</p>
            <p className="text-sm opacity-80">{check.recommendation}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function SEOReport({ report }: SEOReportProps) {
  const criticalChecks = report.checks.filter((c) => c.status === "fail");
  const warningChecks = report.checks.filter((c) => c.status === "warning");
  const passedChecks = report.checks.filter((c) => c.status === "pass");

  const exportToMarkdown = () => {
    const md = generateMarkdownReport(report);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seo-report-${report.domain}-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const md = generateMarkdownReport(report);
    navigator.clipboard.writeText(md);
  };

  return (
    <div className="space-y-8">
      {/* Score Card */}
      <Card className="glass-card border border-gray-200 dark:border-gray-800 shadow-premium-xl overflow-hidden">
        <CardBody className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score Circle */}
            <div className="relative">
              <div
                className={`w-40 h-40 rounded-full bg-gradient-to-br ${getScoreGradient(report.overallScore)} p-1`}
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-[#0f0f11] flex items-center justify-center">
                  <div className="text-center">
                    <span
                      className={`text-5xl font-bold ${getScoreColor(report.overallScore)}`}
                    >
                      {report.overallScore}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      SEO Score
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Domain Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-ink dark:text-white mb-2">
                {report.domain}
              </h2>
              <a
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cipher-red hover:underline flex items-center gap-2 justify-center md:justify-start"
              >
                <FaLink /> {report.url}
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Analyzed on {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Summary Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">
                  {report.summary.critical}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Critical
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {report.summary.warnings}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Warnings
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  {report.summary.passed}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Passed
                </div>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 justify-center md:justify-end">
            <Button
              variant="bordered"
              onPress={copyToClipboard}
              className="border-gray-300 dark:border-gray-700"
            >
              Copy as Markdown
            </Button>
            <Button
              variant="bordered"
              onPress={exportToMarkdown}
              startContent={<FaDownload />}
              className="border-gray-300 dark:border-gray-700"
            >
              Download Report
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Checks Tabs */}
      <Card className="glass-card border border-gray-200 dark:border-gray-800 shadow-premium-xl">
        <CardBody className="p-6">
          <Tabs
            aria-label="SEO Check Categories"
            color="danger"
            variant="underlined"
            classNames={{
              tabList: "gap-6",
              cursor: "bg-cipher-red",
              tab: "px-0 h-12",
            }}
          >
            <Tab
              key="all"
              title={
                <div className="flex items-center gap-2">
                  <span>All Checks</span>
                  <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                    {report.checks.length}
                  </span>
                </div>
              }
            >
              <div className="space-y-3 mt-6">
                {report.checks
                  .sort((a, b) => {
                    const order = { fail: 0, warning: 1, pass: 2 };
                    return order[a.status] - order[b.status];
                  })
                  .map((check) => (
                    <SEOCheckItem key={check.id} check={check} />
                  ))}
              </div>
            </Tab>
            <Tab
              key="critical"
              title={
                <div className="flex items-center gap-2">
                  <FaExclamationCircle className="text-red-500" />
                  <span>Critical</span>
                  <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                    {criticalChecks.length}
                  </span>
                </div>
              }
            >
              <div className="space-y-3 mt-6">
                {criticalChecks.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No critical issues found!
                  </p>
                ) : (
                  criticalChecks.map((check) => (
                    <SEOCheckItem key={check.id} check={check} />
                  ))
                )}
              </div>
            </Tab>
            <Tab
              key="warnings"
              title={
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="text-yellow-500" />
                  <span>Warnings</span>
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
                    {warningChecks.length}
                  </span>
                </div>
              }
            >
              <div className="space-y-3 mt-6">
                {warningChecks.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No warnings found!
                  </p>
                ) : (
                  warningChecks.map((check) => (
                    <SEOCheckItem key={check.id} check={check} />
                  ))
                )}
              </div>
            </Tab>
            <Tab
              key="passed"
              title={
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>Passed</span>
                  <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                    {passedChecks.length}
                  </span>
                </div>
              }
            >
              <div className="space-y-3 mt-6">
                {passedChecks.map((check) => (
                  <SEOCheckItem key={check.id} check={check} />
                ))}
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

function generateMarkdownReport(report: SEOReportType): string {
  let md = `# SEO Report for ${report.domain}\n\n`;
  md += `**URL:** ${report.url}\n`;
  md += `**Score:** ${report.overallScore}/100\n`;
  md += `**Analyzed:** ${new Date(report.timestamp).toLocaleString()}\n\n`;

  md += `## Summary\n`;
  md += `- Critical Issues: ${report.summary.critical}\n`;
  md += `- Warnings: ${report.summary.warnings}\n`;
  md += `- Passed: ${report.summary.passed}\n\n`;

  const criticalChecks = report.checks.filter((c) => c.status === "fail");
  const warningChecks = report.checks.filter((c) => c.status === "warning");
  const passedChecks = report.checks.filter((c) => c.status === "pass");

  if (criticalChecks.length > 0) {
    md += `## Critical Issues\n\n`;
    for (const check of criticalChecks) {
      md += `### ${check.name}\n`;
      md += `- **Status:** ${check.status}\n`;
      md += `- **Value:** ${check.value || "N/A"}\n`;
      md += `- **Recommendation:** ${check.recommendation}\n\n`;
    }
  }

  if (warningChecks.length > 0) {
    md += `## Warnings\n\n`;
    for (const check of warningChecks) {
      md += `### ${check.name}\n`;
      md += `- **Status:** ${check.status}\n`;
      md += `- **Value:** ${check.value || "N/A"}\n`;
      md += `- **Recommendation:** ${check.recommendation}\n\n`;
    }
  }

  if (passedChecks.length > 0) {
    md += `## Passed Checks\n\n`;
    for (const check of passedChecks) {
      md += `- **${check.name}:** ${check.value || "Passed"}\n`;
    }
  }

  md += `\n---\n*Generated by Insightly SEO Analyzer*\n`;

  return md;
}
