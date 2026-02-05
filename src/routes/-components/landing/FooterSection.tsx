"use client";

import { motion } from "framer-motion";
import Logo from "@/components/logo";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";

const footerLinks = [
  { label: "Docs", href: "https://docs.insightly.live" },
  { label: "Twitter", href: "https://twitter.com/insightly" },
  { label: "Discord", href: "https://discord.gg/insightly" },
];

const socialLinks = [
  { icon: FaXTwitter, href: "https://twitter.com/insightly", label: "Twitter" },
  { icon: FaDiscord, href: "https://discord.gg/insightly", label: "Discord" },
];

export default function FooterSection() {
  return (
    <footer
      className="relative pt-16 sm:pt-24 md:pt-32 pb-8 sm:pb-10 md:pb-12 bg-white dark:bg-[#0a0a0c] overflow-hidden"
      insightly-scroll="landing-footer"
    >
      {/* Gradient Blob */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] md:w-[1200px] h-[300px] sm:h-[450px] md:h-[600px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-cipher-rose/30 via-cipher-red/20 to-transparent blur-3xl opacity-60" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Giant Logo Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="font-extrabold text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-ink dark:text-white tracking-tight">
            INSIGHTLY<span className="text-cipher-red">.</span>
          </h2>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12"
        >
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base text-gray-500 hover:text-cipher-red transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12"
        >
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface dark:bg-[#1a1a1d] flex items-center justify-center text-gray-500 hover:text-cipher-red hover:bg-cipher-red/10 transition-all duration-300"
              aria-label={social.label}
            >
              <social.icon className="text-base sm:text-lg" />
            </a>
          ))}
        </motion.div>

        {/* Status & Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-4 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800 md:flex-row md:justify-between"
        >
          <div className="flex items-center gap-2">
            <Logo className="h-4" />
            <span className="text-xs sm:text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Insightly. All rights reserved.
            </span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500" />
            </span>
            <span className="text-xs sm:text-sm text-gray-500">All Systems Operational</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
