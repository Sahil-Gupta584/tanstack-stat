import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";
import { seo } from "@/lib/utils/client";
import { Button, Card, CardBody, Input, Textarea } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaDesktop, FaMobile, FaSearch } from "react-icons/fa";
import { SEOFooter } from "./-components/SEOFooter";

export const Route = createFileRoute("/seo-analyzer/serp")({
  head: () => ({
    meta: [
      ...seo({
        title: "SERP Preview | Insightly - See How You Look in Search",
        description:
          "Preview how your page will appear in Google search results. Optimize your title and description for maximum click-through rates.",
        image: "https://www.insightly.live/images/open-graph.png",
        url: "https://www.insightly.live/seo-analyzer/serp",
      }),
    ],
  }),
  component: SERPPreviewPage,
});

function SERPNav() {
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
              className="text-sm font-medium text-cipher-red relative group"
            >
              SERP Preview
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cipher-red" />
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

function SERPPreviewPage() {
  const [url, setUrl] = useState("https://example.com/page");
  const [title, setTitle] = useState("Your Page Title - Brand Name");
  const [description, setDescription] = useState(
    "This is your meta description. It appears below the title in search results and should be compelling enough to make users want to click through to your page."
  );
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  // Character limits
  const titleLimit = 60;
  const descLimit = 160;

  const getTruncatedText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const getDisplayUrl = (fullUrl: string) => {
    try {
      const urlObj = new URL(fullUrl);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return fullUrl;
    }
  };

  return (
    <main className="bg-white dark:bg-[#0a0a0c] min-h-screen">
      <SERPNav />

      <section className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-extrabold text-4xl md:text-5xl text-ink dark:text-white mb-4">
              SERP <span className="gradient-text">Preview</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              See how your page will appear in Google search results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="glass-card border border-gray-200 dark:border-gray-800 shadow-premium-xl">
              <CardBody className="p-6 space-y-4">
                <Input
                  label="Page URL"
                  placeholder="https://example.com/page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  classNames={{
                    inputWrapper:
                      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
                  }}
                />

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title Tag
                    </label>
                    <span
                      className={`text-sm ${
                        title.length > titleLimit
                          ? "text-red-500"
                          : title.length > titleLimit - 10
                            ? "text-yellow-500"
                            : "text-gray-500"
                      }`}
                    >
                      {title.length}/{titleLimit}
                    </span>
                  </div>
                  <Input
                    placeholder="Your Page Title - Brand Name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    classNames={{
                      inputWrapper: `bg-gray-50 dark:bg-gray-900 border ${
                        title.length > titleLimit
                          ? "border-red-500"
                          : "border-gray-200 dark:border-gray-700"
                      }`,
                    }}
                  />
                  {title.length > titleLimit && (
                    <p className="text-xs text-red-500 mt-1">
                      Title may be truncated in search results
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta Description
                    </label>
                    <span
                      className={`text-sm ${
                        description.length > descLimit
                          ? "text-red-500"
                          : description.length > descLimit - 20
                            ? "text-yellow-500"
                            : "text-gray-500"
                      }`}
                    >
                      {description.length}/{descLimit}
                    </span>
                  </div>
                  <Textarea
                    placeholder="This is your meta description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={3}
                    classNames={{
                      inputWrapper: `bg-gray-50 dark:bg-gray-900 border ${
                        description.length > descLimit
                          ? "border-red-500"
                          : "border-gray-200 dark:border-gray-700"
                      }`,
                    }}
                  />
                  {description.length > descLimit && (
                    <p className="text-xs text-red-500 mt-1">
                      Description may be truncated in search results
                    </p>
                  )}
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">
                    Quick Tips
                  </h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-disc list-inside">
                    <li>Keep titles under 60 characters</li>
                    <li>Keep descriptions between 150-160 characters</li>
                    <li>Include your main keyword early in the title</li>
                    <li>Write compelling descriptions with a call-to-action</li>
                    <li>Use your brand name at the end of titles</li>
                  </ul>
                </div>
              </CardBody>
            </Card>

            {/* Preview */}
            <div>
              {/* View Toggle */}
              <div className="flex gap-2 mb-4 justify-end">
                <Button
                  size="sm"
                  variant={viewMode === "desktop" ? "solid" : "bordered"}
                  onPress={() => setViewMode("desktop")}
                  startContent={<FaDesktop />}
                  className={
                    viewMode === "desktop"
                      ? "bg-cipher-red text-white"
                      : "border-gray-300 dark:border-gray-700"
                  }
                >
                  Desktop
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "mobile" ? "solid" : "bordered"}
                  onPress={() => setViewMode("mobile")}
                  startContent={<FaMobile />}
                  className={
                    viewMode === "mobile"
                      ? "bg-cipher-red text-white"
                      : "border-gray-300 dark:border-gray-700"
                  }
                >
                  Mobile
                </Button>
              </div>

              <Card className="glass-card border border-gray-200 dark:border-gray-800 shadow-premium-xl">
                <CardBody className="p-6">
                  <h3 className="font-bold text-lg text-ink dark:text-white mb-4">
                    Google Search Preview
                  </h3>

                  {/* Google-like Preview */}
                  <div
                    className={`bg-white rounded-lg p-4 ${viewMode === "mobile" ? "max-w-sm" : ""}`}
                  >
                    {/* Google Search Bar Mock */}
                    <div className="flex items-center gap-3 mb-6 p-3 bg-gray-100 rounded-full">
                      <FaSearch className="text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {title.split(" ")[0] || "search query"}
                      </span>
                    </div>

                    {/* Search Result */}
                    <div
                      className={`border-l-4 border-transparent hover:border-cipher-red pl-4 py-2 transition-all cursor-pointer ${viewMode === "mobile" ? "text-sm" : ""}`}
                    >
                      {/* URL and Breadcrumb */}
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {url.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-700">
                            {getDisplayUrl(url)}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-blue-600 hover:underline cursor-pointer font-medium mb-1 ${viewMode === "mobile" ? "text-base" : "text-xl"}`}
                      >
                        {getTruncatedText(title, titleLimit) ||
                          "Your Page Title"}
                      </h3>

                      {/* Description */}
                      <p
                        className={`text-gray-600 leading-relaxed ${viewMode === "mobile" ? "text-xs" : "text-sm"}`}
                      >
                        {getTruncatedText(description, descLimit) ||
                          "Your meta description will appear here..."}
                      </p>
                    </div>

                    {/* Fake additional results */}
                    <div className="mt-6 pt-4 border-t border-gray-100 opacity-50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                        <span className="text-xs text-gray-400">
                          another-result.com
                        </span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-5/6 mt-1" />
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Length Analysis */}
              <Card className="mt-4 glass-card border border-gray-200 dark:border-gray-800">
                <CardBody className="p-4">
                  <h4 className="font-medium text-ink dark:text-white mb-3">
                    Length Analysis
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Title
                        </span>
                        <span
                          className={
                            title.length <= titleLimit
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {title.length <= titleLimit ? "Good" : "Too long"}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            title.length <= titleLimit
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min((title.length / titleLimit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Description
                        </span>
                        <span
                          className={
                            description.length <= descLimit
                              ? description.length >= 120
                                ? "text-green-500"
                                : "text-yellow-500"
                              : "text-red-500"
                          }
                        >
                          {description.length <= descLimit
                            ? description.length >= 120
                              ? "Good"
                              : "Too short"
                            : "Too long"}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            description.length <= descLimit
                              ? description.length >= 120
                                ? "bg-green-500"
                                : "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min((description.length / descLimit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <SEOFooter />
    </main>
  );
}
