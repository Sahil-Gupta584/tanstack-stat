import { createFileRoute, Link } from "@tanstack/react-router";
import { FaTwitter, FaLink, FaChartLine } from "react-icons/fa";

export const Route = createFileRoute("/_docs/docs/twitter-links/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="space-y-10 font-normal">
            <header className="space-y-4">
                <div className="flex items-center gap-3 text-cipher-red">
                    <FaLink className="text-3xl" />
                    <span className="text-sm font-bold uppercase tracking-widest bg-cipher-red/10 px-3 py-1 rounded-full">ROI & Attribution</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight">Twitter Links</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                    The ultimate answer to "Which tweet actually made me money?" Deep attribution for X referrers.
                </p>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cipher-red/10 rounded-lg">
                        <FaTwitter className="text-cipher-red" />
                    </div>
                    <h2 className="text-2xl font-bold m-0">The t.co Problem</h2>
                </div>
                <p className="font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
                    Standard analytics tools show "t.co" as the referrer for Twitter traffic. This anonymizes the source, leaving you guessing which post, reply, or DM drove the visitor.
                </p>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cipher-red/10 rounded-lg">
                        <FaChartLine className="text-cipher-red" />
                    </div>
                    <h2 className="text-2xl font-bold m-0">Proprietary Post Resolution</h2>
                </div>
                <p className="font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
                    When a visitor arrives via a <code>t.co</code> link, Insightly's backend instantly attempts to resolve the shortened URL back to the original X post.
                </p>
                <div className="bg-cipher-red/5 border border-cipher-red/10 rounded-2xl p-8 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-white dark:bg-white/5 px-4 py-2 rounded-lg border border-base-200 dark:border-white/10 font-mono text-xs mb-2">t.co/xyz123</div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Anonymous Source</span>
                        </div>
                        <div className="text-cipher-red text-2xl font-bold">→</div>
                        <div className="flex flex-col items-center">
                            <div className="bg-white dark:bg-white/5 px-4 py-2 rounded-lg border border-cipher-red/20 font-mono text-xs mb-2 text-cipher-red font-bold">x.com/ElonMusk/123...</div>
                            <span className="text-[10px] uppercase font-bold text-cipher-red tracking-widest shrink-0">Resolved Attribution</span>
                        </div>
                    </div>
                    <p className="text-sm text-center text-rose-600 dark:text-rose-400 font-medium italic">
                        "Our resolution engine can map traffic directly back to individual tweets with 98% accuracy."
                    </p>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold m-0 text-ink dark:text-white">Direct ROI Tracking</h2>
                <p className="font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
                    When combined with our <Link to="/docs/revenue-attribution-guide" className="text-cipher-red font-bold">Revenue Attribution</Link>, your dashboard will show a dollar amount next to every tweet. You can finally see the exact ROI of your social media strategy.
                </p>
            </section>
        </div>
    );
}
