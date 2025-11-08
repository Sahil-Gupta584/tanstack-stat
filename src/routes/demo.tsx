import { Nav } from "@/components/navbar";
import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "./-components/dashboard";
import { Providers } from "./-components/providers";

export const Route = createFileRoute("/demo")({
  component: Page,
});

function Page() {
  return (
    <Providers>
      <div className="min-h-screen max-w-6xl m-auto">
        <Nav />
        <main className="container mx-auto max-w-6xl pt-6 px-6 flex-grow">
          <Dashboard websiteId="68d124eb001034bd8493" isDemo={true} />
        </main>
      </div>
    </Providers>
  );
}
