import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/lib/userContext";
import {
  PricingSection,
} from "./-components/landing";

export const Route = createFileRoute("/pricing")({
    component: HomeComponent,
});

function HomeComponent() {
    const { user } = useUser();

    return (
        <main className="bg-white dark:bg-[#0a0a0c] min-h-screen">
            <PricingSection user={user} />
        </main>
    );
}