import { useEffect, useState } from "react";

import { useTimeZones, useUser } from "@/hooks/useUser";
import { tryCatchWrapper } from "@/lib/utils/client";
import { addWebsiteSchema, type TAddWebsiteForm } from "@/lib/zodSchemas";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Tab,
  Tabs,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { IoIosArrowRoundUp } from "react-icons/io";
import z from "zod";
import BackBtn from "../$websiteId/-components/backBtn";
import { Time } from "../$websiteId/-components/time";
import { createDomain, isDomainExists } from "./-actions";
import { AddScriptCard } from "./-components/addScriptCard";
import RevenueConnectTab from "./-components/revenueConnectTab";
import Title from "./-components/tabTitle";

const websiteDataSchema = z.object({
  websiteId: z.string().optional(),
  domain: z.string().optional(),
  step: z.string().optional(),
});
export const Route = createFileRoute("/_dashboard/dashboard/new/")({
  component: NewWebsite,
  validateSearch: websiteDataSchema,
});
type WebsiteData = { websiteId: string; step: string; domain: string };

function NewWebsite() {
  const timeZones = useTimeZones();
  const [isLoading, setIsLoading] = useState(true);
  const [websiteData, setWebsiteData] = useState<null | WebsiteData>(null);
  const router = useRouter();
  const user = useUser();
  const { domain, step, websiteId } = Route.useSearch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TAddWebsiteForm>({
    resolver: zodResolver(addWebsiteSchema),
    defaultValues: {
      domain: domain || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  useEffect(() => {
    async function init() {
      if (domain && domain.trim()) setValue("domain", domain);
      if (step && websiteId && domain) {
        setWebsiteData({ step, domain, websiteId });
      }
      setIsLoading(false);
    }
    init();
  }, [domain, step, websiteId, router]);

  const onSubmit = async (formdata: TAddWebsiteForm) => {
    if (!user?.$id) return;

    return tryCatchWrapper({
      callback: async () => {
        const isDomainExistsRes = await isDomainExists(formdata.domain);

        if (isDomainExistsRes && isDomainExistsRes.rows[0]?.$id) {
          addToast({
            color: "warning",
            title: "Warning",
            description: "Website already exists.",
          });

          return;
        }

        const res = await createDomain({
          domain: formdata.domain,
          timezone: formdata.timezone,
          userId: user.$id,
        });

        if (res && res?.$id) {
          router.navigate({
            to: `/dashboard/new?step=addScript&websiteId=${res.$id}&domain=${res.domain}`,
          });
          addToast({
            color: "success",
            title: "Website Added Successfully",
            description: `${formdata.domain} has been added to your dashboard.`,
          });
        }
      },
      errorMsg: "Failed to add website. Please try again.",
    });
  };
  const selectedTimeZone = watch("timezone");

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <BackBtn text="Dashboard" pathname="/dashboard" />
      <Tabs
        aria-label="Options"
        selectedKey={websiteData?.step || "addSite"}
        onSelectionChange={(k) =>
          setWebsiteData((prev) => ({ ...prev, step: k }) as WebsiteData)
        }
        classNames={{
          base: "w-full py-4",
          tabList: ["bg-transparent px-0 "],
          tabContent: "group-data-[selected=true]: ",
          cursor: "bg-transparent! shadow-none",
          panel: "p-0 w-full",
          tab: "opacity-100!",
        }}
      >
        <Tab
          key="addSite"
          isDisabled={Boolean(websiteData?.step)}
          title={
            <Title
              status={!websiteData?.step ? "active" : "completed"}
              text="Add site"
            />
          }
        >
          <Card className="w-full">
            <CardBody className="p-0 w-full">
              <CardHeader className="text-lg font-semibold p-4">
                Add a new website
              </CardHeader>
              <Divider />
              <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                <Input
                  value={websiteData?.domain}
                  onValueChange={(v) => {
                    let domain;
                    try {
                      domain = new URL(v).hostname;
                    } catch {
                      domain = v;
                    }
                    setWebsiteData(
                      (prev) => ({ ...prev, domain }) as WebsiteData
                    );
                    setValue("domain", domain);
                  }}
                  label="Domain"
                  labelPlacement="outside"
                  placeholder="unicorn.com"
                  variant="bordered"
                  isInvalid={!!errors.domain}
                  errorMessage={errors.domain?.message}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        https://
                      </span>
                    </div>
                  }
                />

                <Autocomplete
                  {...register("timezone")}
                  labelPlacement="outside"
                  label="Timezone"
                  placeholder="Select timezone"
                  isLoading={isLoading}
                  inputValue={selectedTimeZone.replace("/", " - ")}
                  description="This defines what 'today' means for your reports"
                  selectedKey={selectedTimeZone}
                  onInputChange={(val) => setValue("timezone", val)}
                  onSelectionChange={(key) =>
                    setValue("timezone", key?.toString() || "")
                  }
                  variant="bordered"
                  classNames={{
                    popoverContent: "border border-default-200",
                  }}
                  items={timeZones}
                  endContent={<Time selectedTimeZone={selectedTimeZone} />}
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
                  type="submit"
                  isLoading={isSubmitting}
                  color="primary"
                  className="shadow-md"
                >
                  Add website
                </Button>
              </form>
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="addScript"
          title={
            <Title
              status={
                websiteData?.step === "addScript"
                  ? "active"
                  : websiteData?.step === "addSite"
                    ? "inactive"
                    : websiteData?.step === "revenue"
                      ? "completed"
                      : "inactive"
              }
              text="Install script"
            />
          }
          isDisabled={!websiteData?.step || websiteData?.step === "addSite"}
        >
          <AddScriptCard
            title="Install the Insightly script"
            domain={websiteData?.domain as string}
            websiteId={websiteData?.websiteId as string}
            Btn={
              <Button
                onPress={() => {
                  const url = websiteData?.step
                    ? window.location.href.replace("addScript", "revenue")
                    : "/dashboard/new?step=revenue";

                  setWebsiteData(
                    (prev) => ({ ...prev, step: "revenue" }) as WebsiteData
                  );
                  router.navigate({ to: url });
                }}
                isLoading={isSubmitting}
                color="primary"
                endContent={<IoIosArrowRoundUp className="rotate-90 size-6" />}
                className="shadow-md"
              >
                OK, I've installed the script
              </Button>
            }
          />
        </Tab>

        <Tab
          key="revenue"
          title={
            <Title
              status={websiteData?.step === "revenue" ? "active" : "inactive"}
              text="Attribute revenue (optional)"
            />
          }
          isDisabled={websiteData?.step !== "revenue"}
        >
          <Card className="w-full">
            <CardBody className="p-4 w-full">
              <RevenueConnectTab websiteId={websiteData?.websiteId as string} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
