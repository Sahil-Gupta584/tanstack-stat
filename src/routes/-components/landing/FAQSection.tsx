"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

const faqs = [
  {
    question: "Is Insightly really free?",
    answer:
      "Yes! Our Hobby plan is completely free forever. You get up to 10,000 events per month, basic analytics, and 7-day data retention at no cost. No credit card required.",
  },
  {
    question: "How does Insightly handle privacy?",
    answer:
      "We take privacy seriously. Insightly doesn't use cookies, doesn't collect personal data, and is fully GDPR, CCPA, and PECR compliant. You don't need consent banners when using Insightly.",
  },
  {
    question: "Can I self-host Insightly?",
    answer:
      "Yes! Insightly can be self-hosted on your own infrastructure. This gives you complete control over your data. Check our documentation for setup guides.",
  },
  {
    question: "What's the script size impact on my site?",
    answer:
      "Our tracking script is less than 1KB gzipped. It's one of the lightest analytics scripts available, ensuring minimal impact on your site's performance and loading times.",
  },
  {
    question: "How accurate is the data?",
    answer:
      "Insightly provides highly accurate analytics without being blocked by ad blockers (when self-hosted). We use advanced fingerprinting techniques that respect user privacy while maintaining accuracy.",
  },
  {
    question: "Can I migrate from Google Analytics?",
    answer:
      "Yes! We provide migration guides and tools to help you transition from Google Analytics. You can run both in parallel during the transition period to compare data.",
  },
];

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: typeof faqs[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`
        border-b border-gray-200/80 dark:border-gray-800/80 transition-all duration-300
        ${isOpen ? "bg-cipher-red/5 dark:bg-cipher-red/10" : "hover:bg-cipher-red/5 dark:hover:bg-cipher-red/10"}
      `}
    >
      <button
        onClick={onToggle}
        className="w-full py-4 sm:py-5 md:py-6 px-3 sm:px-4 flex items-center justify-between text-left"
      >
        <h3 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-ink dark:text-white pr-3 sm:pr-4">
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <FaChevronDown className="text-cipher-red w-3 h-3 sm:w-4 sm:h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-3 sm:px-4 pb-4 sm:pb-5 md:pb-6 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-12 sm:py-16 md:py-24 bg-gray-50 dark:bg-[#0f0f11]"
      insightly-scroll="landing-faq"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <span className="text-cipher-red text-xs sm:text-sm uppercase tracking-widest font-medium">
            FAQ
          </span>
          <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-ink dark:text-white mt-3 sm:mt-4">
            Frequently asked{" "}
            <span className="text-cipher-red">questions</span>
          </h2>
        </motion.div>

        <div className="border-t border-gray-200 dark:border-gray-800">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
