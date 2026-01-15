import type { User } from "@/lib/types";
import { Button, Input } from "@heroui/react";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { GoGlobe } from "react-icons/go";

function AddWebsiteForm({ user }: { user: User | null }) {
  const [website, setWebsite] = useState("");
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleAddWebsite(e: any) {
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
    <form className="w-72 space-y-3 mx-auto" onSubmit={handleAddWebsite}>
      <Input
        startContent={
          website.trim() ? (
            <img
              className="size-5"
              src={`https://icons.duckduckgo.com/ip3/${website}.ico`}
              alt=""
            />
          ) : (
            <GoGlobe />
          )
        }
        placeholder="unicorn.com"
        classNames={{ 
          input: "pl-4!",
          inputWrapper: "border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:shadow-md transition-shadow rounded-xl",
          base: "w-full"
        }}
        variant="bordered"
        value={website}
        onValueChange={setWebsite}
      />
      <Button
        className="w-full bg-cipher-red hover:bg-cipher-dark text-white font-medium rounded-xl shadow-lg shadow-cipher-red/20 hover:shadow-xl hover:shadow-cipher-red/30 transition-all duration-300"
        radius="lg"
        type="submit"
        endContent={<FaArrowRightLong />}
      >
        Add my website
      </Button>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center font-medium">Try for free!</p>
    </form>
  );
}

export default AddWebsiteForm;
