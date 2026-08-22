import { SEO_CHECKS } from "@/lib/seo-types";
import { motion } from "framer-motion";
import {
  FaAccessibleIcon,
  FaBolt,
  FaCode,
  FaCog,
  FaFileAlt,
  FaGlobe,
  FaHashtag,
  FaHeading,
  FaImage,
  FaLanguage,
  FaLink,
  FaLock,
  FaMobile,
  FaRobot,
  FaSearch,
  FaShareAlt,
  FaSitemap,
  FaTachometerAlt,
  FaTwitter,
} from "react-icons/fa";

const iconMap: Record<string, React.ReactNode> = {
  title: <FaFileAlt />,
  meta_description: <FaSearch />,
  h1: <FaHeading />,
  heading_hierarchy: <FaHeading />,
  internal_links: <FaLink />,
  external_links: <FaGlobe />,
  images: <FaImage />,
  schema: <FaCode />,
  page_speed: <FaTachometerAlt />,
  mobile: <FaMobile />,
  ssl: <FaLock />,
  og_tags: <FaShareAlt />,
  twitter_cards: <FaTwitter />,
  canonical: <FaLink />,
  robots_txt: <FaRobot />,
  sitemap: <FaSitemap />,
  url_structure: <FaLink />,
  content: <FaFileAlt />,
  accessibility: <FaAccessibleIcon />,
  meta_robots: <FaRobot />,
  hreflang: <FaLanguage />,
  favicon: <FaImage />,
  lazy_loading: <FaBolt />,
  doctype: <FaCode />,
  charset: <FaHashtag />,
  keywords_in_url: <FaSearch />,
  social_image_size: <FaImage />,
};

export function SEOChecksGrid() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#0f0f11] dark:via-[#0a0a0c] dark:to-[#0f0f11]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cipher-red text-sm uppercase tracking-widest font-bold">
            Complete Analysis
          </span>
          <h2 className="font-extrabold text-4xl md:text-5xl text-ink dark:text-white mt-6 tracking-tight">
            27 comprehensive checks that{" "}
            <span className="gradient-text">move the needle</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We analyze the on-page factors that actually impact rankings. No
            fluff, no vanity metrics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEO_CHECKS.map((check, index) => (
            <motion.div
              key={check.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-cipher-red/50 dark:hover:border-cipher-red/50 transition-all duration-300 group hover-lift"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cipher-red/10 text-cipher-red group-hover:bg-cipher-red group-hover:text-white transition-all duration-300">
                  {iconMap[check.id] || <FaCog />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-ink dark:text-white">
                    {check.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {check.description}
                  </p>
                  <span
                    className={`inline-block mt-3 px-2 py-1 text-xs font-medium rounded-full ${
                      check.impact === "critical"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : check.impact === "warning"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {check.impact === "critical"
                      ? "Critical"
                      : check.impact === "warning"
                        ? "Important"
                        : "Good to have"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Priority Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-card rounded-2xl p-8 border border-gray-200 dark:border-gray-800"
        >
          <h3 className="font-bold text-xl text-ink dark:text-white mb-6">
            Prioritized by impact
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Issues are automatically sorted by severity. Critical problems that
            hurt your rankings appear first, followed by warnings and
            optimizations.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-red-700 dark:text-red-400 font-medium">
                Critical
              </span>
              <span className="text-red-600 dark:text-red-500 text-sm">
                Fix these first
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-yellow-700 dark:text-yellow-400 font-medium">
                Warning
              </span>
              <span className="text-yellow-600 dark:text-yellow-500 text-sm">
                Improvements needed
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-green-700 dark:text-green-400 font-medium">
                Good
              </span>
              <span className="text-green-600 dark:text-green-500 text-sm">
                Well optimized
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
