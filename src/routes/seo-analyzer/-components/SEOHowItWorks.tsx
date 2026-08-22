import { motion } from "framer-motion";
import { FaClipboardList, FaDownload, FaLink, FaSearch } from "react-icons/fa";

const steps = [
  {
    number: 1,
    title: "Paste Your URL",
    description: "Enter any public URL you want to analyze. No signup needed.",
    icon: <FaLink />,
  },
  {
    number: 2,
    title: "Instant Analysis",
    description:
      "We scan 27+ on-page factors including title, meta, headings, links, schema, and more.",
    icon: <FaSearch />,
  },
  {
    number: 3,
    title: "Get Prioritized Results",
    description:
      "Issues are ranked by impact: critical, warning, and good status.",
    icon: <FaClipboardList />,
  },
  {
    number: 4,
    title: "Export & Share",
    description:
      "Download as Markdown/PDF, copy to clipboard, or share directly with your team.",
    icon: <FaDownload />,
  },
];

export function SEOHowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0c]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cipher-red text-sm uppercase tracking-widest font-bold">
            How It Works
          </span>
          <h2 className="font-extrabold text-4xl md:text-5xl text-ink dark:text-white mt-6 tracking-tight">
            SEO Analysis in{" "}
            <span className="gradient-text">4 Simple Steps</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From URL to actionable insights in under 30 seconds. No complex
            setup, no learning curve.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-cipher-red/50 to-transparent" />
              )}

              <div className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-cipher-red/50 dark:hover:border-cipher-red/50 transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cipher-red to-cipher-rose flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-cipher-red/30">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="p-3 rounded-xl bg-cipher-red/10 text-cipher-red w-fit mb-4">
                  {step.icon}
                </div>

                <h3 className="font-bold text-xl text-ink dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
