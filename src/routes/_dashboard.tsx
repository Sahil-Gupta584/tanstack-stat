import { Nav } from "@/components/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Providers } from "./-components/providers";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <Providers>
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-black">
        <div className="max-w-6xl mx-auto">
          <Nav />
          <main className="px-6 pt-8 pb-12">
            <Outlet />
          </main>
        </div>
      </div>
    </Providers>
  );
}
