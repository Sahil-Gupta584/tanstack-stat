import { Accordion, AccordionItem } from "@heroui/react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What is the SEO Analyzer?",
    answer:
      "The SEO Analyzer is a free tool that scans your website and provides a comprehensive report of 27+ on-page SEO factors. It checks everything from title tags and meta descriptions to schema markup and page speed, giving you actionable recommendations to improve your search rankings.",
  },
  {
    question: "How accurate is the SEO score?",
    answer:
      "Our SEO score is based on industry best practices and Google's official guidelines. The score is calculated by weighing critical factors (like title tags, meta descriptions, and HTTPS) more heavily than informational checks. While no tool can guarantee rankings, fixing the issues we identify will improve your on-page SEO.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes! The basic SEO analyzer is completely free with no signup required. You can analyze any public URL and get a full report. We also offer additional tools like Bulk Scan and Compare for analyzing multiple URLs.",
  },
  {
    question: "How long does the analysis take?",
    answer:
      "Most analyses complete in under 30 seconds. The time depends on how fast your website responds and the size of the page being analyzed. Complex pages with lots of content may take slightly longer.",
  },
  {
    question: "What SEO factors do you check?",
    answer:
      "We analyze 27+ on-page factors including: Title tag, Meta description, H1-H6 headings, Internal/external links, Image alt text, Schema markup, Page speed, Mobile responsiveness, SSL/HTTPS, Open Graph tags, Twitter Cards, Canonical URLs, Robots.txt, Sitemap, URL structure, Content length, Accessibility, and more.",
  },
  {
    question: "Can I export the results?",
    answer:
      "Yes! You can export your SEO report as a Markdown file or copy it to your clipboard. This makes it easy to share with your team or track improvements over time.",
  },
  {
    question: "Do you store my data?",
    answer:
      "We don't store any analysis data. Each scan is performed in real-time and the results are displayed only to you. Once you close the page, the data is gone unless you export it.",
  },
  {
    question: "What is the Schema Generator?",
    answer:
      "The Schema Generator helps you create JSON-LD structured data markup for your website. Structured data helps search engines understand your content better and can enable rich snippets in search results, potentially improving click-through rates.",
  },
];

export function SEOFAQSection() {
  return (
    <section
      id="faq"
      className="py-24 bg-white dark:bg-[#0a0a0c]"
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cipher-red text-sm uppercase tracking-widest font-bold">
            Got Questions?
          </span>
          <h2 className="font-extrabold text-4xl md:text-5xl text-ink dark:text-white mt-6 tracking-tight">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about our SEO tools
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion
            variant="bordered"
            className="gap-4"
            itemClasses={{
              base: "!shadow-none border border-gray-200 dark:border-gray-800 rounded-xl mb-4 overflow-hidden",
              title:
                "font-semibold text-ink dark:text-white hover:text-cipher-red dark:hover:text-cipher-red transition-colors",
              trigger: "px-6 py-4",
              content: "px-6 pb-4 text-gray-600 dark:text-gray-400",
            }}
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                aria-label={faq.question}
                title={faq.question}
              >
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
