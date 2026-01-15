import { Nav } from "@/components/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Providers } from "./-components/providers";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
});

// export const metadata: Metadata = {
//   title: { default: "Home | Dashboard", template: "%s | Dashboard" },
// };

function DashboardLayout() {
  return (
    <Providers>
      <main className="bg-white dark:bg-[#0a0a0c] min-h-screen">
        <Nav />
        <div className="max-w-6xl mx-auto pt-24 px-4 pb-6">
          <Outlet />
        </div>
      </main>
    </Providers>
  );
}
