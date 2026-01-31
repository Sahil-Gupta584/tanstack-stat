// import { db } from "@/configs/appwrite/clientConfig";
import { useTimeZones } from "@/hooks/useUser";
import { tryCatchWrapper } from "@/lib/utils/client";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input
} from "@heroui/react";
import { useRouter } from "@tanstack/react-router";
import { AppwriteException } from "appwrite";
import { useEffect, useState } from "react";
import { deleteWebsite, getWebsite, updateWebsite } from "../../-actions";
import { Time } from "../../-components/time";
import { AddScriptCard } from "../../../new/-components/addScriptCard";

export interface TWebsiteData {
  domain: string;
  timezone: string;
  twitterKeywords?: string[];
}
function GeneralTab({
  websiteId,
  domain,
}: {
  websiteId: string;
  domain: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState<TWebsiteData>({
    domain,
    timezone: "",
  });
  const timeZones = useTimeZones();
  const router = useRouter();
  useEffect(() => {
    async function init() {
      try {
        const website = await getWebsite({ data: { websiteId } });

        setWebsiteData({ domain: website.domain, timezone: website.timezone });
      } catch (error) {
        if (error instanceof AppwriteException) {
          if (error.code === 404) {
            addToast({
              title: "Error",
              description: "Website not found",
              color: "danger",
            });
            router.navigate({ to: "/dashboard" });
          }
          return;
        }
        console.log("Unexpected Error", error);
      }
    }

    init();
  }, [websiteId]);

  async function handleDelete() {
    tryCatchWrapper({
      async callback() {
        const value = prompt(`Are you sure you want to delete this website?
          Please type 'delete' to confirm the deletion.
          `);
        setIsLoading(true);
        if (value == "delete") {
          await deleteWebsite({ data: { websiteId } });
          router.navigate({ to: "/dashboard" });
          return true;
        }
        setIsLoading(false);
      },
      successMsg: "Website deleted successfully",
      errorMsg: "Failed to delete message",
      errorCallback: () => setIsLoading(false),
    });
  }

  async function saveField({ field }: { field: "domain" | "timezone" }) {
    tryCatchWrapper({
      callback: async () => {
        setIsLoading(true);
        await updateWebsite({
          data: {
            websiteId,
            payload: {
              [field]: websiteData[field],
            },
          },
        });
        setIsLoading(false);
        return true;
      },
      successMsg: `${field} updated successfully.`,
    });
  }

  return (
    <>
      <Card className="bg-white dark:bg-[#161619] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <CardHeader className="font-bold bg-gray-50/50 dark:bg-[#1a1a1d]/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl">Domain</CardHeader>
        <CardBody className="p-6 space-y-4">
          <Input
            variant="bordered"
            value={websiteData.domain}
            onValueChange={(v) =>
              setWebsiteData((prev) => ({ ...prev, domain: v }))
            }
            description={
              <p className="text-gray-400">
                Your website ID is
                <span className="m-1 font-semibold   hover:underline cursor-pointer">
                  {websiteId}
                </span>
              </p>
            }
          />
          <Button
            variant="ghost"
            className="w-fit self-end"
            onPress={() => saveField({ field: "domain" })}
            isLoading={isLoading}
          >
            Save
          </Button>
        </CardBody>
      </Card>
      <Card className="bg-white dark:bg-[#161619] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <CardHeader className="font-bold bg-gray-50/50 dark:bg-[#1a1a1d]/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl">Timezone</CardHeader>
        <CardBody className="p-6 space-y-4">
          <Autocomplete
            labelPlacement="outside"
            label="Timezone"
            placeholder="Select timezone"
            isLoading={isLoading}
            inputValue={websiteData.timezone.replace("/", " - ")}
            description="This defines what 'today' means for your reports"
            selectedKey={websiteData.timezone}
            onValueChange={(v) =>
              setWebsiteData((prev) => ({ ...prev, timezone: v }))
            }
            variant="bordered"
            classNames={{
              popoverContent: "border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161619] rounded-xl shadow-xl",
            }}
            items={timeZones}
            endContent={<Time selectedTimeZone={websiteData.timezone} />}
          >
            {(item) => (
              <AutocompleteItem key={item.value}>
                <ul className="flex items-center justify-between">
                  <li>{item.value.replace("/", " - ")}</li>
                  <li className="text-gray-400">{item.label}</li>
                </ul>
              </AutocompleteItem>
            )}
          </Autocomplete>

          <Button
            variant="ghost"
            className="w-fit self-end"
            onPress={() => saveField({ field: "timezone" })}
            isLoading={isLoading}
          >
            Save
          </Button>
        </CardBody>
      </Card>
      <AddScriptCard
        domain={websiteData.domain}
        title="Analytics script"
        websiteId={websiteId}
        Btn={
          <CardFooter>
            <p className="text-desc">
              Tip:
              <span className="underline">
                proxy the script through your own domain
              </span>
              &nbsp;to avoid ad blockers.
            </p>
          </CardFooter>
        }
      />
      <Button
        onPress={handleDelete}
        color="danger"
        className="w-full"
        isLoading={isLoading}
      >
        Delete
      </Button>
    </>
  );
}

export default GeneralTab;
