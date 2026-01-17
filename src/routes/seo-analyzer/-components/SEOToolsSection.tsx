import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FaChartBar,
  FaCode,
  FaEye,
  FaLayerGroup,
  FaRobot,
  FaSearch,
} from "react-icons/fa";

const tools = [
  {
    icon: <FaSearch className="text-2xl" />,
    title: "SEO Scanner",
    description: "Complete on-page analysis",
    link: "/seo-analyzer",
    active: true,
  },
  {
    icon: <FaLayerGroup className="text-2xl" />,
    title: "Bulk Scan",
    description: "Analyze multiple URLs at once",
    link: "/seo-analyzer/bulk",
    active: false,
  },
  {
    icon: <FaChartBar className="text-2xl" />,
    title: "Compare URLs",
    description: "Side-by-side SEO comparison",
    link: "/seo-analyzer/compare",
    active: false,
  },
  {
    icon: <FaCode className="text-2xl" />,
    title: "Schema Generator",
    description: "Generate JSON-LD markup",
    link: "/seo-analyzer/schema",
    active: false,
  },
  {
    icon: <FaEye className="text-2xl" />,
    title: "SERP Preview",
    description: "See how you look in search",
    link: "/seo-analyzer/serp",
    active: false,
  },
  {
    icon: <FaRobot className="text-2xl" />,
    title: "AI Suite",
    description: "AEO, GEO & AI visibility",
    link: "/seo-analyzer/ai",
    active: false,
    comingSoon: true,
  },
];

const stats = [
  { value: "27+", label: "SEO Checks" },
  { value: "6", label: "Free Tools" },
  { value: "<30s", label: "Analysis Time" },
];

export function SEOToolsSection() {
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
            All Tools Included
          </span>
          <h2 className="font-extrabold text-4xl md:text-5xl text-ink dark:text-white mt-6 tracking-tight">
            Complete <span className="gradient-text">SEO Toolkit</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to optimize your website's SEO
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              {tool.comingSoon ? (
                <div className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-gray-800 h-full relative overflow-hidden opacity-75">
                  <div className="absolute top-4 right-4 px-2 py-1 bg-cipher-red/10 text-cipher-red text-xs font-medium rounded-full">
                    Coming Soon
                  </div>
                  <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 w-fit mb-4">
                    {tool.icon}
                  </div>
                  <h3 className="font-bold text-xl text-gray-400 dark:text-gray-500 mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-600">
                    {tool.description}
                  </p>
                </div>
              ) : (
                <Link to={tool.link} className="block h-full">
                  <div
                    className={`glass-card rounded-2xl p-6 border h-full transition-all duration-300 group hover-lift ${
                      tool.active
                        ? "border-cipher-red/50 bg-cipher-red/5"
                        : "border-gray-200 dark:border-gray-800 hover:border-cipher-red/50 dark:hover:border-cipher-red/50"
                    }`}
                  >
                    <div className="p-3 rounded-xl bg-cipher-red/10 text-cipher-red group-hover:bg-cipher-red group-hover:text-white transition-all duration-300 w-fit mb-4">
                      {tool.icon}
                    </div>
                    <h3 className="font-bold text-xl text-ink dark:text-white mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 border border-gray-200 dark:border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
