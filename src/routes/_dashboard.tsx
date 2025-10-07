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
      <div className="min-h-screen max-w-6xl m-auto">
        <Nav />
        <main className="container mx-auto max-w-6xl pt-6 px-6 flex-grow">
          <Outlet />
        </main>
      </div>
    </Providers>
  );
}
