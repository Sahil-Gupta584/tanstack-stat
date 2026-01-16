import { useUser } from "@/lib/userContext";
import { createFileRoute } from "@tanstack/react-router";
import AddWebsiteForm from "./-components/addWebsiteForm";
import HowItWorks from "./-components/howItWorks";
import LandingPageNav from "./-components/landingNav";
import Pricing from "./-components/pricing";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { user } = useUser();

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <LandingPageNav user={user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f7] to-white dark:from-[#1c1c1e] dark:to-black opacity-50" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20">
          <article
            insightly-scroll="landing-hero"
            className="flex flex-col items-center text-center space-y-8 animate-fade-in"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-sm text-[#6e6e73] dark:text-[#8e8e93]">
              <span className="w-2 h-2 rounded-full bg-[#34c759] dark:bg-[#30d158] animate-pulse-subtle" />
              Simple. Powerful. Private.
            </div>

            {/* Main headline */}
            <h1 className="font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] max-w-3xl">
              Know Your Visitors
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-[#6e6e73] dark:text-[#8e8e93] max-w-2xl leading-relaxed font-normal">
              Understand who's visiting, where they come from, and what keeps
              them engaged — all without compromising privacy.
            </p>

            {/* CTA Form */}
            <div className="w-full max-w-md mt-4">
              <AddWebsiteForm user={user} />
            </div>
          </article>
        </div>
      </section>

      {/* Demo Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <article
          insightly-scroll="landing-demo-interation"
          className="relative rounded-3xl overflow-hidden shadow-apple-xl"
        >
          {/* Browser chrome */}
          <div className="relative flex items-center h-12 px-5 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-b border-[#e8e8ed] dark:border-[#3a3a3c]">
            <div className="flex space-x-2 absolute left-5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#3a3a3c]">
              <svg
                className="w-3.5 h-3.5 text-[#86868b]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-xs text-[#6e6e73] dark:text-[#8e8e93] font-medium">
                insightly.network
              </span>
            </div>
          </div>

          {/* Demo content */}
          <div className="bg-white dark:bg-[#1c1c1e]">
            <iframe
              src="/demo"
              frameBorder="0"
              className="w-full h-[600px]"
              title="Demo"
            />
          </div>
        </article>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#f5f5f7] dark:bg-[#1c1c1e]">
        <div className="max-w-6xl mx-auto px-6">
          <HowItWorks />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-xl mx-auto px-6 text-center">
          <article insightly-scroll="landing-cta" className="space-y-8">
            <h2 className="text-[#1d1d1f] dark:text-[#f5f5f7]">
              Start tracking today
            </h2>
            <p className="text-lg text-[#6e6e73] dark:text-[#8e8e93]">
              Set up in under a minute. No credit card required.
            </p>
            <AddWebsiteForm user={user} />
          </article>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-[#f5f5f7] dark:bg-[#1c1c1e]">
        <div className="max-w-6xl mx-auto px-6">
          <Pricing user={user} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-black border-t border-[#e8e8ed] dark:border-[#2c2c2e]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[#86868b] dark:text-[#636366]">
            Built with privacy in mind. No cookies, no tracking scripts, just
            insights.
          </p>
        </div>
      </footer>
    </main>
  );
}
