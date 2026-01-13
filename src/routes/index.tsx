import { useUser } from "@/lib/userContext";
import { createFileRoute } from "@tanstack/react-router";
import {
  SmoothScroll,
  LandingNav,
  HeroSection,
  ManifestoSection,
  TechStackSection,
  FeaturesSection,
  OpenSourceSection,
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
    <SmoothScroll>
      <main className="bg-background dark:bg-[#131315] min-h-screen">
        <LandingNav user={user} />
        <HeroSection user={user} />
        <ManifestoSection />
        <TechStackSection />
        <FeaturesSection />
        <OpenSourceSection />
        <ShowcaseSection />
        <PricingSection user={user} />
        <FAQSection />
        <FooterSection />
      </main>
    </SmoothScroll>
  );
}
