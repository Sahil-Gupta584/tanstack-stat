import LinkComponent from "@/components/link";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FaBook, FaCode, FaRocket, FaTwitter } from "react-icons/fa";

export const Route = createFileRoute("/_docs/docs/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="space-y-16 pb-20">
            {/* Hero Section */}
            <section className="space-y-6">
                <h1 className="font-bold text-6xl tracking-tight text-ink dark:text-white leading-[1.1]">
                    Master your <span className="gradient-text">Analytics.</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed font-normal">
                    Everything you need to integrate Insightly analytics into your web application, track real revenue, and listen to your community.
                </p>
            </section>

            {/* Quick Start Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <Card className="glass-card shadow-premium-lg border border-gray-200 dark:border-white/5 hover:shadow-premium-xl transition-premium p-4">
                    <CardHeader className="flex gap-4 px-6 pt-6">
                        <div className="p-4 bg-cipher-red/10 rounded-2xl shadow-inner-premium shrink-0">
                            <FaRocket className="text-cipher-red text-2xl" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[11px] text-cipher-red uppercase tracking-widest font-bold mb-1">Getting Started</p>
                            <p className="text-2xl font-bold tracking-tight">Quick Start</p>
                        </div>
                    </CardHeader>
                    <CardBody className="px-6 pb-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-8 font-normal leading-relaxed">
                            Start tracking your visitors in less than a minute. Add our lightweight script and see live data immediately.
                        </p>
                        <Link
                            to="/docs/revenue-attribution-guide"
                            className="inline-flex items-center justify-center px-8 py-3 bg-cipher-red hover:bg-cipher-red/90 text-white rounded-2xl font-bold transition-premium text-sm shadow-premium-md hover:shadow-premium-lg"
                        >
                            Get Started
                        </Link>
                    </CardBody>
                </Card>

                <Card className="glass-card shadow-premium-lg border border-gray-200 dark:border-white/5 hover:shadow-premium-xl transition-premium p-4">
                    <CardHeader className="flex gap-4 px-6 pt-6">
                        <div className="p-4 bg-blue-500/10 rounded-2xl shadow-inner-premium shrink-0">
                            <FaTwitter className="text-blue-500 text-2xl" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[11px] text-blue-500 uppercase tracking-widest font-bold mb-1">New Feature</p>
                            <p className="text-2xl font-bold tracking-tight">Twitter Intelligence</p>
                        </div>
                    </CardHeader>
                    <CardBody className="px-6 pb-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-8 font-normal leading-relaxed">
                            Track real-time social mentions and attribute revenue directly to individual posts. Stop guessing your ROI.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to="/docs/twitter-links"
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold transition-premium text-sm shadow-premium-md"
                            >
                                Attribution
                            </Link>
                            <Link
                                to="/docs/twitter-mentions"
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-white/5 border border-blue-500/20 text-blue-500 dark:text-blue-400 rounded-2xl font-bold transition-premium text-sm"
                            >
                                Mentions
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* API Integrations */}
            <section className="space-y-8 bg-gray-50 dark:bg-white/5 p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <h2 className="text-4xl font-bold tracking-tight">Integrations</h2>
                        <p className="text-gray-600 dark:text-gray-400 font-normal max-w-xl">
                            Connect your payment provider to unlock deep insights into which marketing channels drive your revenue.
                        </p>
                    </div>
                    <div className="p-4 bg-cipher-red/10 rounded-2xl">
                        <FaCode className="text-cipher-red text-2xl" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: "Stripe", href: "/docs/stripe-checkout-api" },
                        { name: "Polar", href: "/docs/polar-checkout-api" },
                        { name: "DodoPayments", href: "/docs/dodo-checkout-api" },
                    ].map((p) => (
                        <Link
                            key={p.name}
                            to={p.href}
                            className="group p-6 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 hover:border-cipher-red/50 transition-all flex items-center justify-between"
                        >
                            <span className="font-bold text-lg">{p.name}</span>
                            <div className="size-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center font-bold group-hover:bg-cipher-red group-hover:text-white transition-colors">
                                →
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Core Concepts */}
            <section className="space-y-12">
                <h2 className="text-4xl font-bold tracking-tight text-center">Core Concepts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-blue-500">
                            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <FaBook className="text-xl" />
                            </div>
                            <h3 className="font-bold text-2xl">Custom Goals</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-normal leading-relaxed text-lg">
                            Track custom events that matter to your business. Whether it's a button click, a form submission, or a specific user milestone.
                        </p>
                        <LinkComponent href="/docs/custom-goals" text="Explore Goals Guide" isBold className="text-cipher-red" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-emerald-500">
                            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <FaRocket className="text-xl" />
                            </div>
                            <h3 className="font-bold text-2xl">Auto-Capture</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-normal leading-relaxed text-lg">
                            Our script automatically captures page views, referrers, and basic visitor metadata without any extra configuration or bloating your site.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
