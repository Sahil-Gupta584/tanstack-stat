import type { User } from "@/lib/types";
import { Button, Input } from "@heroui/react";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { GoGlobe } from "react-icons/go";

function AddWebsiteForm({ user }: { user: User | null }) {
  const [website, setWebsite] = useState("");
  const router = useRouter();

  function handleAddWebsite(e: React.FormEvent) {
    e?.preventDefault();
    if (user && user.$id) {
      router.navigate({ to: `/dashboard/new?domain=${website}` });
    } else {
      router.navigate({
        to: `/auth?redirect=/dashboard/new?domain=${website}`,
      });
    }
  }

  return (
    <form className="w-full max-w-sm mx-auto space-y-4" onSubmit={handleAddWebsite}>
      <div className="flex gap-3">
        <Input
          startContent={
            website.trim() ? (
              <img
                className="w-5 h-5 rounded"
                src={`https://icons.duckduckgo.com/ip3/${website}.ico`}
                alt=""
              />
            ) : (
              <GoGlobe className="w-5 h-5 text-[#86868b] dark:text-[#636366]" />
            )
          }
          placeholder="yoursite.com"
          classNames={{
            base: "flex-1",
            input: "text-base pl-2",
            inputWrapper: [
              "h-12",
              "bg-[#f5f5f7] dark:bg-[#1c1c1e]",
              "border border-transparent",
              "hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e]",
              "group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-[#1c1c1e]",
              "group-data-[focus=true]:border-[#0071e3] dark:group-data-[focus=true]:border-[#0a84ff]",
              "group-data-[focus=true]:ring-4 group-data-[focus=true]:ring-[#0071e3]/10 dark:group-data-[focus=true]:ring-[#0a84ff]/10",
              "transition-all duration-200",
            ].join(" "),
          }}
          radius="lg"
          value={website}
          onValueChange={setWebsite}
        />
        <Button
          className="h-12 px-6 bg-[#0071e3] dark:bg-[#0a84ff] text-white font-medium hover:bg-[#0066cc] dark:hover:bg-[#3d9eff] shadow-none transition-colors"
          radius="lg"
          type="submit"
        >
          Get Started
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Button>
      </div>
      <p className="text-sm text-[#86868b] dark:text-[#636366] text-center">
        Free to start. No credit card required.
      </p>
    </form>
  );
}

export default AddWebsiteForm;
