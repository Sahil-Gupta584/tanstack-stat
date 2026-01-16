import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "./-components/dashboard";
import { Providers } from "./-components/providers";

export const Route = createFileRoute("/demo")({
  component: Page,
});

function Page() {
  return (
    <Providers>
      <div className="min-h-screen bg-white dark:bg-[#1a1a1d]">
        <main className="max-w-6xl mx-auto px-4 py-6">
          <Dashboard websiteId="68d124eb001034bd8493" isDemo={true} />
        </main>
      </div>
    </Providers>
  );
}
