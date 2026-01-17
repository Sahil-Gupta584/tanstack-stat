import { useUser } from "@/lib/userContext";
import { createFileRoute } from "@tanstack/react-router";
import {
  FAQSection,
  FeaturesSection,
  FooterSection,
  HeroSection,
  LandingNav,
  ManifestoSection,
  PricingSection,
  ShowcaseSection,
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
      {/* <TechStackSection /> */}
      <FeaturesSection />
      <ShowcaseSection />
      <PricingSection user={user} />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
