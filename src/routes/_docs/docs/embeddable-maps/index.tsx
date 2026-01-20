import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "next-themes";

export const Route = createFileRoute("/_docs/docs/embeddable-maps/")({
    component: Page,
});

function Page() {
    const { resolvedTheme } = useTheme();

    const bgColor = resolvedTheme === "dark" ? "%230d0d0f" : "%23f9fafb";
    const iframeUrl = `${import.meta.env.VITE_WEBSITE_URL}/share/68d124eb001034bd8493/location?duration=last_7_days&primaryColor=%23FF003C&bgColor=${bgColor}&showLive=true`;

    return (
        <section className="space-y-8 pb-20 max-w-s2xl">
            <div className="space-y-4">
                <h1 className="font-extrabold text-4xl tracking-tight text-ink dark:text-white">
                    Embeddable Maps
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    Showcase your global reach with beautiful, interactive maps that can be embedded anywhere.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Live Preview</h2>
                <div className="glass-card rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-premium-lg">
                    <iframe
                        src={iframeUrl}
                        width="100%"
                        height="450px"
                        className="w-full border-none"
                        title="Interactive Map Preview"
                    />
                </div>
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">How to Use</h2>
                <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Follow these steps to get your embed code:
                    </p>
                    <ol className="space-y-3">
                        {[
                            "Open your Insightly Dashboard.",
                            "Select the website you want to share.",
                            "Navigate to the Settings page.",
                            "Click on the Share tab.",
                            "Customize your map and click 'Copy Embed Code'."
                        ].map((step, i) => (
                            <li key={i} className="flex gap-3 items-start text-gray-600 dark:text-gray-400 font-medium">
                                <span className="flex-none size-6 rounded-full bg-cipher-red/10 text-cipher-red flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Customization Options</h2>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                    You can customize the map's appearance using query parameters in the iframe URL.
                </p>

                <div className="grid grid-cols-1 gap-6">
                    <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                        <div className="flex items-center gap-2">
                            <code className="text-cipher-red font-bold text-sm">primaryColor</code>
                            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">HEX Color</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            Changes the accent color of the map (active countries, progress bars, etc.). Must be URL-encoded (e.g., <code className="text-xs opacity-70">#FF003C</code> becomes <code className="text-xs opacity-70">%23FF003C</code>).
                        </p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                        <div className="flex items-center gap-2">
                            <code className="text-cipher-red font-bold text-sm">bgColor</code>
                            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">HEX Color</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            Sets the background color of the map container. Use this to match the map to your website's theme.
                        </p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                        <div className="flex items-center gap-2">
                            <code className="text-cipher-red font-bold text-sm">showLive</code>
                            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Boolean</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            When set to <code className="text-xs opacity-70">true</code>, shows a real-time visitor counter at the top of the side panel.
                        </p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                        <div className="flex items-center gap-2">
                            <code className="text-cipher-red font-bold text-sm">layout</code>
                            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Enum</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            Choose between <code className="text-xs opacity-70">horizontal</code> (default) and <code className="text-xs opacity-70">vertical</code>. The vertical layout is recommended for narrow sidebars or mobile-focused embeds.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Real-World Example</h2>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                    See how <a href="https://sahil.appwrite.network/#analytics" target="_blank" rel="noopener noreferrer" className="text-cipher-red hover:underline">sahil.appwrite.network</a> uses embeddable maps to showcase their global visitor distribution.
                </p>
                <div className="glass-card rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-premium-lg">
                    <iframe
                        src="https://insightly.live/share/68d124eb001034bd8493/location?duration=last_30_days&primaryColor=%23FF003C&bgColor=%230d0d0f&showLive=false"
                        width="100%"
                        height="400px"
                        className="w-full border-none"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Responsive Design</h2>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                    The map is fully responsive and will automatically switch to a vertical layout on smaller screens.
                </p>
                <div className="bg-cipher-red/5 border border-cipher-red/20 rounded-2xl p-6 space-y-2">
                    <h4 className="font-bold text-cipher-red flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Pro Tip: Customize Height
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                        The ideal height for your embed depends on how many countries usually appear in your top list. If you have many visitors from diverse locations, consider increasing the <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">height</code> in your CSS or iframe attribute to avoid excessive scrolling.
                    </p>
                </div>
            </div>
        </section >
    );
}
