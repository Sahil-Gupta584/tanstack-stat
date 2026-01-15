import { useUser } from "@/lib/userContext";
import { createFileRoute } from "@tanstack/react-router";
import {
  LandingNav,
  HeroSection,
  ManifestoSection,
  TechStackSection,
  FeaturesSection,
  ShowcaseSection,
  PricingSection,
  FAQSection,
  FooterSection,
} from "./-components/landing";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { user } = useUser();

  return (
    <main className="bg-white dark:bg-[#0a0a0c] min-h-screen">
      <LandingNav user={user} />
      <HeroSection user={user} />
      <ManifestoSection />
      <TechStackSection />
      <FeaturesSection />
      <ShowcaseSection />
      <PricingSection user={user} />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
