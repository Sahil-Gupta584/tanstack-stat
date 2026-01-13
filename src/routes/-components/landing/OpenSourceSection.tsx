"use client";

import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { FaStar, FaGithub } from "react-icons/fa6";

export default function OpenSourceSection() {
  return (
    <section
      className="py-24 bg-background dark:bg-[#131315]"
      insightly-scroll="landing-opensource"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cipher-red text-sm uppercase tracking-widest font-medium">
              Open Source
            </span>
            <h2 className="font-editorial text-4xl md:text-5xl text-ink dark:text-white mt-4 mb-6">
              Code you can{" "}
              <em className="text-cipher-red italic">trust</em>.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              Fork it. Host it. Own it. The entire stack is open for inspection.
              No black boxes, no hidden tracking. Just clean, auditable code.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                as="a"
                href="https://github.com/insightly"
                target="_blank"
                className="bg-ink dark:bg-white text-white dark:text-ink px-6 py-5 rounded-xl font-medium flex items-center gap-2 hover:bg-cipher-red dark:hover:bg-cipher-red dark:hover:text-white transition-colors duration-300"
              >
                <FaStar className="text-yellow-400" />
                Star on GitHub
                <span className="ml-2 px-2 py-0.5 bg-white/20 dark:bg-ink/20 rounded text-sm">
                  2.4k
                </span>
              </Button>
              <Button
                as="a"
                href="https://docs.insightly.live"
                target="_blank"
                variant="bordered"
                className="border-gray-300 dark:border-gray-600 text-ink dark:text-white px-6 py-5 rounded-xl font-medium hover:border-cipher-red hover:text-cipher-red transition-colors duration-300"
              >
                Read the Docs
              </Button>
            </div>
          </motion.div>

          {/* Code Block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white dark:bg-[#1a1a1d] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
              {/* Code Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-surface dark:bg-[#131315] border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-500 font-mono">Terminal</span>
              </div>

              {/* Code Content */}
              <div className="p-6">
                <pre className="font-mono text-sm md:text-base overflow-x-auto">
                  <code>
                    <span className="text-gray-500"># Install with npm</span>
                    {"\n"}
                    <span className="text-cipher-red">$</span>{" "}
                    <span className="text-ink dark:text-white">npm install</span>{" "}
                    <span className="text-cipher-red">insightly</span>
                    {"\n\n"}
                    <span className="text-gray-500"># Or with yarn</span>
                    {"\n"}
                    <span className="text-cipher-red">$</span>{" "}
                    <span className="text-ink dark:text-white">yarn add</span>{" "}
                    <span className="text-cipher-red">insightly</span>
                    {"\n\n"}
                    <span className="text-gray-500"># Add to your HTML</span>
                    {"\n"}
                    <span className="text-blue-500">&lt;script</span>{" "}
                    <span className="text-green-500">src</span>
                    <span className="text-ink dark:text-white">=</span>
                    <span className="text-cipher-red">"insightly.js"</span>
                    <span className="text-blue-500">&gt;&lt;/script&gt;</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* GitHub Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-white dark:bg-[#23272f] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3"
            >
              <FaGithub className="text-2xl text-ink dark:text-white" />
              <div>
                <p className="text-xs text-gray-500">Repository</p>
                <p className="font-mono text-cipher-red font-bold">insightly/insightly</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
