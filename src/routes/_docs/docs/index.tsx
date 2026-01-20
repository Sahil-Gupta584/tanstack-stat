import LinkComponent from "@/components/link";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FaBook, FaCode, FaRocket, FaShieldAlt } from "react-icons/fa";

export const Route = createFileRoute("/_docs/docs/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <section className="space-y-4">
                <h1 className="font-extrabold text-5xl tracking-tight text-ink dark:text-white">
                    Documentation
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                    Everything you need to integrate Insightly analytics into your web application, track revenue, and understand your users.
                </p>
            </section>

            {/* Quick Start Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card shadow-premium-md border border-gray-200 dark:border-gray-800 hover:shadow-premium-lg transition-premium">
                    <CardHeader className="flex gap-3 px-6 pt-6">
                        <div className="p-3 bg-cipher-red/10 rounded-2xl">
                            <FaRocket className="text-cipher-red text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg font-bold">Quick Start</p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Getting Started</p>
                        </div>
                    </CardHeader>
                    <CardBody className="px-6 pb-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                            Start tracking your visitors in less than a minute. Add our lightweight script and see live data immediately.
                        </p>
                        <Link
                            to="/docs/revenue-attribution-guide"
                            className="inline-flex items-center justify-center px-6 py-2.5 bg-cipher-red hover:bg-cipher-red/90 text-white rounded-xl font-bold transition-premium text-sm"
                        >
                            Get Started
                        </Link>
                    </CardBody>
                </Card>

                <Card className="glass-card shadow-premium-md border border-gray-200 dark:border-gray-800 hover:shadow-premium-lg transition-premium">
                    <CardHeader className="flex gap-3 px-6 pt-6">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <FaCode className="text-blue-500 text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg font-bold">API Integration</p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Reference</p>
                        </div>
                    </CardHeader>
                    <CardBody className="px-6 pb-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                            Connect your payment provider to unlock deep insights into which marketing channels drive your revenue.
                        </p>
                        <div className="flex gap-3 flex-wrap">
                            <Link to="/docs/stripe-checkout-api" className="text-xs font-bold text-cipher-red hover:underline">Stripe</Link>
                            <Link to="/docs/polar-checkout-api" className="text-xs font-bold text-cipher-red hover:underline">Polar</Link>
                            <Link to="/docs/dodo-checkout-api" className="text-xs font-bold text-cipher-red hover:underline">Dodo</Link>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Divider className="bg-gray-200 dark:bg-gray-800" />

            {/* Core Concepts */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tight">Core Concepts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-cipher-red mb-4">
                            <FaShieldAlt className="text-2xl" />
                            <h3 className="font-bold text-xl">Privacy First</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                            Insightly is built with privacy at its core. We don't use cookies, don't store personal data, and are fully GDPR/CCPA compliant. No consent banners required.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-blue-500 mb-4">
                            <FaBook className="text-2xl" />
                            <h3 className="font-bold text-xl">Custom Goals</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                            Track custom events that matter to your business. Whether it's a button click, a form submission, or a specific user milestone.
                        </p>
                        <LinkComponent href="/docs/custom-goals" text="Learn more about Goals" isBold className="text-sm" />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-emerald-500 mb-4">
                            <FaRocket className="text-2xl" />
                            <h3 className="font-bold text-xl">Auto-Capture</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                            Our script automatically captures page views, referrers, and basic visitor metadata without any extra configuration.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
