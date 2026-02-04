import { createFileRoute } from "@tanstack/react-router";
import { FaTwitter, FaBell, FaHashtag } from "react-icons/fa";

export const Route = createFileRoute("/_docs/docs/twitter-mentions/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="space-y-10 font-normal">
            <header className="space-y-4">
                <div className="flex items-center gap-3 text-cipher-red">
                    <FaTwitter className="text-3xl" />
                    <span className="text-xs font-bold uppercase tracking-widest bg-cipher-red/10 px-3 py-1 rounded-full text-cipher-red">Social Pulse</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight">Twitter Mentions</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                    Real-time monitoring of your brand's voice on X. Never miss a conversation that matters.
                </p>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cipher-red/10 rounded-lg">
                        <FaBell className="text-cipher-red" />
                    </div>
                    <h2 className="text-2xl font-bold m-0">Zero Configuration</h2>
                </div>
                <p className="font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
                    Insightly automatically tracks mentions of your website domain across X. There's no need to set up complex listeners or webhooks—it works out of the box as part of our core intelligence layer.
                </p>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                        <FaHashtag className="text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold m-0">Keyword Tracking</h2>
                </div>
                <p className="font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
                    Want to track more than just your domain? You can configure custom keywords (like your project name or competitor names) in your website settings to expand your social reach.
                </p>
                <div className="bg-cipher-red/5 border border-cipher-red/10 rounded-2xl p-6">
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-tight opacity-50 text-ink dark:text-white">What we display:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-background rounded-xl border border-base-200 dark:border-white/5 shadow-premium-sm">
                            <p className="font-bold text-sm mb-1 text-cipher-red">Live Feed</p>
                            <p className="text-xs text-gray-500">The last 50 relevant tweets mentioning your brand, updated every 15 minutes.</p>
                        </div>
                        <div className="p-4 bg-background rounded-xl border border-base-200 dark:border-white/5 shadow-premium-sm">
                            <p className="font-bold text-sm mb-1 text-cipher-red">Sentiment Pulse</p>
                            <p className="text-xs text-gray-500">A visual pulse of the community's emotional reaction to your latest launches.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold m-0 text-ink dark:text-white">Privacy First Integration</h2>
                <p className="font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
                    Unlike other tools, we never ask for your X login credentials. We use our own enterprise-grade API connection to gather public data, ensuring your account remains 100% secure.
                </p>
            </section>
        </div>
    );
}
