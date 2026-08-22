import Logo from "@/components/logo";
import { Link } from "@tanstack/react-router";

export function SEOFooter() {
  return (
    <footer className="py-16 bg-gray-50 dark:bg-[#0f0f11] border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-3 font-bold text-xl text-ink dark:text-white mb-4"
            >
              <Logo className="h-6" />
              <span className="tracking-tight">Insightly</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Free SEO tools to help you understand and improve your website's
              search performance. Part of the Insightly analytics platform.
            </p>
          </div>

          {/* SEO Tools */}
          <div>
            <h3 className="font-bold text-ink dark:text-white mb-4">
              SEO Tools
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/seo-analyzer"
                  className="text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-colors"
                >
                  SEO Analyzer
                </Link>
              </li>
              <li>
                <Link
                  to="/seo-analyzer/bulk"
                  className="text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-colors"
                >
                  Bulk Scan
                </Link>
              </li>
              <li>
                <Link
                  to="/seo-analyzer/compare"
                  className="text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-colors"
                >
                  Compare URLs
                </Link>
              </li>
              <li>
                <Link
                  to="/seo-analyzer/schema"
                  className="text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-colors"
                >
                  Schema Generator
                </Link>
              </li>
              <li>
                <Link
                  to="/seo-analyzer/serp"
                  className="text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-colors"
                >
                  SERP Preview
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-bold text-ink dark:text-white mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-colors"
                >
                  Web Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/demo"
                  className="text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-colors"
                >
                  Live Demo
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.insightly.live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-cipher-red dark:hover:text-cipher-red transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Insightly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
