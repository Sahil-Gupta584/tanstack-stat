import { Nav } from "@/components/navbar";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { ThemeToggle } from "@/components/themeToggle";
import { ToastProvider } from "@heroui/react";
import BackBtn from "./_dashboard/dashboard/$websiteId/-components/backBtn";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_docs")({
  component: RouteComponent,
});

const docGroups = [
  {
    title: "Getting Started",
    links: [
      { href: "/docs", text: "Overview" },
      { href: "/docs/revenue-attribution-guide", text: "Revenue Attribution" },
    ],
  },
  {
    title: "Integrations",
    links: [
      { href: "/docs/stripe-checkout-api", text: "Stripe Checkout API" },
      { href: "/docs/stripe-payment-links", text: "Stripe Payment Links" },
      { href: "/docs/polar-checkout-api", text: "Polar Checkout API" },
      { href: "/docs/polar-payment-links", text: "Polar Payment Links" },
      { href: "/docs/dodo-checkout-api", text: "DodoPayments API" },
      { href: "/docs/dodo-payment-links", text: "DodoPayment Links" },
    ],
  },
  {
    title: "Social Intelligence",
    links: [
      { href: "/docs/twitter-mentions", text: "Twitter Mentions" },
      { href: "/docs/twitter-links", text: "Twitter Links" },
    ],
  },
  {
    title: "Advanced Features",
    links: [
      { href: "/docs/embeddable-maps", text: "Embeddable Maps" },
      { href: "/docs/custom-goals", text: "Custom Goals" },
    ],
  },
];

import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";

function RouteComponent() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  // Initialize expanded state: all sections that contain the current path are expanded
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    return docGroups
      .filter((group) => group.links.some((link) => link.href === pathname))
      .map((group) => group.title);
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <ToastProvider placement="top-center" />
      <div className="max-w-[90rem] mx-auto">
        <Nav
          brandChild={
            <Link to="/docs" className="flex items-center gap-2">
              <p className="cursor-pointer opacity-90 font-extrabold border-l-2 border-l-cipher-red pl-3 ml-2">
                DOCUMENTATION
              </p>
            </Link>
          }
          endContent={
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <BackBtn
                className="m-0 bg-transparent hover:bg-base-100 dark:hover:bg-white/5 border border-base-200 dark:border-white/10"
                pathname="/dashboard"
                text="Dashboard"
              />
            </div>
          }
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-base-100 dark:border-white/5 px-6"
        />

        <div className="flex px-6 pb-10 pt-20 gap-16">
          {/* Sticky Sidebar */}
          <aside className="w-64 shrink-0 hidden lg:block sticky top-28 self-start h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
            <nav className="space-y-4 pb-10">
              {docGroups.map((group) => {
                const isExpanded = expandedGroups.includes(group.title);
                return (
                  <div key={group.title} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className="w-full flex items-center justify-between px-4 py-2 group/title"
                    >
                      <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 dark:text-gray-500 group-hover/title:text-ink dark:group-hover/title:text-white transition-colors">
                        {group.title}
                      </h4>
                      <FaChevronRight
                        className={`size-2.5 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""
                          }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden space-y-1"
                        >
                          {group.links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                              <li key={link.href}>
                                <Link
                                  to={link.href}
                                  className={`
                                    group relative flex items-center px-4 py-2 text-sm font-medium transition-all rounded-xl
                                    ${isActive
                                      ? "text-cipher-red bg-cipher-red/5 dark:bg-cipher-red/10"
                                      : "text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                                    }
                                  `}
                                >
                                  {isActive && (
                                    <motion.div
                                      layoutId="active-pill"
                                      className="absolute left-0 w-1 h-5 bg-cipher-red rounded-full"
                                      transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                      }}
                                    />
                                  )}
                                  {link.text}
                                </Link>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* Content Area */}
          <article className="flex-1 min-w-0 max-w-4xl">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-a:text-cipher-red prose-a:no-underline hover:prose-a:underline prose-pre:bg-content1 dark:prose-pre:bg-content3 prose-pre:border prose-pre:border-white/10 prose-img:rounded-3xl prose-img:shadow-premium-xl">
              <Outlet />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
