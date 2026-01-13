"use client";

import { Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";
import type { User } from "@/lib/types";
import { motion } from "framer-motion";

export default function LandingNav({ user }: { user: User | null }) {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 dark:bg-[#131315]/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-ink dark:text-white"
          >
            <Logo className="h-5" />
            <span className="font-editorial">Insightly</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#pricing"
              className="text-sm text-gray-500 hover:text-cipher-red transition-colors duration-300"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm text-gray-500 hover:text-cipher-red transition-colors duration-300"
            >
              FAQ
            </a>
            <a
              href="https://docs.insightly.live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-cipher-red transition-colors duration-300"
            >
              Docs
            </a>
            <a
              href="https://github.com/insightly"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-cipher-red transition-colors duration-300"
            >
              GitHub
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              as={Link}
              to={user?.$id ? "/dashboard" : "/auth"}
              className="bg-cipher-red hover:bg-cipher-dark text-white px-5 py-2 rounded-xl font-medium text-sm transition-colors duration-300"
            >
              {user?.$id ? "Dashboard" : "Get Started"}
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
