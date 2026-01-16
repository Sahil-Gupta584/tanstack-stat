import { Nav } from "@/components/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Providers } from "./-components/providers";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
});


function DashboardLayout() {
  return (
    <Providers>
      <main className="bg-[#f9fafb] dark:bg-[#0d0d0f] min-h-screen">
        <Nav />
        <div className="max-w-[60rem] mx-auto pt-24 px-4 pb-6">
          <Outlet />
        </div>
      </main>
    </Providers>
  );
}
