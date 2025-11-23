import { useUser } from "@/lib/userContext";
import { createFileRoute } from "@tanstack/react-router";
import AddWebsiteForm from "./-components/addWebsiteForm";
import HowItWorks from "./-components/howItWorks";
import LandingPageNav from "./-components/landingNav";
import Pricing from "./-components/pricing";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { user } = useUser();

  return (
    <main className="bg-[ghostwhite] dark:bg-[#19191C]">
      <LandingPageNav user={user} />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <article
          insightly-scroll="landing-hero"
          className="flex gap-4 flex-col items-center p-4 mx-auto space-y-5"
        >
          <h2 className="font-extrabold md:text-6xl text-4xl">
            Know Your Visitors
          </h2>
          <p className="text-xl text-gray-400 text-center">
            Understand who’s visiting, where they come from <br /> and what
            keeps them engaged.
          </p>
          <AddWebsiteForm user={user} />
        </article>

        <article
          insightly-scroll="landing-demo-interation"
          className="my-15 backdrop-blur-md dark:bg-black/30 bg-black/10 border-11 border-primary/30 mx-auto font-mono shadow-xl text-sm sm:text-xl rounded-4xl overflow-hidden relative group dark:hover:border-white/20 hover:border-black/20 transition-all duration-300"
        >
          <div className="relative flex items-center h-10 px-4 dark:bg-[#19191C] bg-white">
            <div className="flex space-x-1.5 absolute left-4">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>

            <p className="absolute left-1/2 -translate-x-1/2 text-xs sm:text-sm text-neutral-500">
              https://appwrite.insightly.network/
              <span className=" ">syncmate.xyz</span>
            </p>
          </div>

          <div className="p-4 leading-relaxed bg-e dark:bg-inherit">
            <article className="w-full">
              <iframe
                src="/demo"
                frameBorder="2"
                className="w-full h-196"
                title="Demo"
              />
            </article>
          </div>
        </article>
        <HowItWorks />
        <article className="my-10 " insightly-scroll="landing-cta">
          <AddWebsiteForm user={user} />
        </article>
        <Pricing user={user} />
      </section>
    </main>
  );
}
