import type { SEOReport } from "@/lib/seo-types";
import { addToast, Button, Input } from "@heroui/react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SEOAnalyzerFormProps {
  onReport: (report: SEOReport) => void;
}

export function SEOAnalyzerForm({ onReport }: SEOAnalyzerFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      addToast({
        color: "danger",
        title: "Error",
        description: "Please enter a URL",
      });
      return;
    }

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/seo/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze URL");
      }

      onReport(data as SEOReport);
      addToast({
        color: "success",
        description: "SEO analysis complete!",
      });
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error",
        description: (error as Error).message || "Failed to analyze URL",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-cipher-red via-cipher-rose to-cipher-red bg-[length:200%_200%] animate-gradient-shift">
        <div className="flex gap-2 bg-white dark:bg-[#0f0f11] rounded-2xl p-2">
          <Input
            type="text"
            placeholder="Enter website URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            classNames={{
              base: "flex-1",
              input: "text-lg",
              inputWrapper:
                "bg-transparent shadow-none hover:bg-transparent focus-within:bg-transparent",
            }}
            startContent={
              <FaSearch className="text-gray-400 dark:text-gray-500" />
            }
          />
          <Button
            type="submit"
            isLoading={isLoading}
            className="glow-effect bg-cipher-red hover:bg-cipher-dark text-white px-8 py-6 rounded-xl font-semibold text-base transition-premium shadow-premium-sm hover:shadow-premium-md"
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Example: insightly.live, google.com, github.com
      </p>
    </form>
  );
}
