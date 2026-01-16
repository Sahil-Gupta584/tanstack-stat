import {
  Button,
  Select,
  SelectItem,
  SelectSection,
  SharedSelection,
} from "@heroui/react";
import { useCallback, useMemo } from "react";
import { IoSettingsSharp } from "react-icons/io5";

import { Favicon } from "@/components/favicon";
import type { TWebsite } from "@/lib/types";
import { Plus } from "lucide-react";
export const durationOptions = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last_24_hours", label: "Last 24 hours" },
  { key: "last_7_days", label: "Last 7 days" },
  { key: "last_30_days", label: "Last 30 days" },
  { key: "last_12_months", label: "Last 12 months" },
  { key: "all_time", label: "All time" },
];

function Filters({
  websiteId,
  duration,
  setDuration,
  data,
  isLoading,
  refetchMain,
  isDemo,
}: {
  websiteId: string;
  duration: string;
  setDuration: (duration: string) => void;
  data: TWebsite[];
  isLoading: boolean;
  refetchMain?: () => void;
  isDemo: boolean;
}) {
  const selectedDurationKeys = useMemo(() => [duration], [duration]);
  const selectedWebsiteKeys = useMemo(() => [websiteId], [websiteId]);

  const handleDurationChange = useCallback(
    (keys: SharedSelection) => {
      const newDuration = Array.from(keys)[0] as string;
      if (newDuration !== duration) {
        setDuration(newDuration);
      }
    },
    [duration, setDuration]
  );

  const handleRefetch = useCallback(() => {
    if (refetchMain) refetchMain();
  }, [refetchMain]);

  return (
    <div className="flex gap-3 items-center">
      <Select
        classNames={{
          trigger:
            "cursor-pointer gap-3 bg-white dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#3a3a3c] hover:border-[#d2d2d7] dark:hover:border-[#48484a] rounded-xl h-10 min-h-10 transition-colors",
          selectorIcon: "text-[#86868b] dark:text-[#636366]",
          spinner: "static",
          value:
            "font-medium text-sm text-[#1d1d1f] dark:text-[#f5f5f7]",
          innerWrapper: "w-fit block",
          base: "w-fit",
          popoverContent:
            "w-fit bg-white dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#3a3a3c] rounded-xl shadow-apple-lg",
        }}
        placeholder="Select website"
        defaultSelectedKeys={selectedWebsiteKeys}
        disallowEmptySelection
        labelPlacement="outside-left"
        selectorIcon={<SelectorIcon />}
        items={data}
        isLoading={isLoading}
        maxListboxHeight={400}
        renderValue={(items) =>
          items.map((item) => {
            return (
              <div
                className="font-medium text-sm flex items-center gap-2 text-[#1d1d1f] dark:text-[#f5f5f7]"
                key={item.textValue}
              >
                <Favicon domain={item.textValue as string} className="w-4 h-4" />
                {item.textValue}
              </div>
            );
          })
        }
      >
        <SelectSection showDivider className="border-[#e8e8ed] dark:border-[#3a3a3c]">
          {data &&
            data.map((website) => (
              <SelectItem
                key={website.$id}
                textValue={website.domain}
                href={`/dashboard/${website.$id}`}
                classNames={{
                  base: "rounded-lg data-[hover=true]:bg-[#f5f5f7] dark:data-[hover=true]:bg-[#2c2c2e]",
                }}
              >
                <div className="font-medium text-sm flex items-center gap-2 whitespace-nowrap text-[#1d1d1f] dark:text-[#f5f5f7]">
                  <Favicon domain={website.domain} className="w-4 h-4" />
                  {website.domain}
                </div>
              </SelectItem>
            ))}
        </SelectSection>
        <SelectSection className="p-0">
          {isDemo ? (
            <SelectItem
              key="setting"
              endContent={<Plus className="w-4 h-4 text-[#0071e3] dark:text-[#0a84ff]" />}
              href={`/new?ref=demo-filter-dropdown`}
              classNames={{
                base: "rounded-lg data-[hover=true]:bg-[#f5f5f7] dark:data-[hover=true]:bg-[#2c2c2e]",
              }}
            >
              <span className="text-[#0071e3] dark:text-[#0a84ff] font-medium">Add Your Website</span>
            </SelectItem>
          ) : (
            <SelectItem
              key="setting"
              endContent={<IoSettingsSharp className="text-[#86868b] dark:text-[#636366]" />}
              href={`/dashboard/${websiteId}/settings?domain=${data ? data.find((w) => w.$id === websiteId)?.domain : ""}`}
              classNames={{
                base: "rounded-lg data-[hover=true]:bg-[#f5f5f7] dark:data-[hover=true]:bg-[#2c2c2e]",
              }}
            >
              <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">Settings</span>
            </SelectItem>
          )}
        </SelectSection>
      </Select>

      <Select
        classNames={{
          trigger:
            "cursor-pointer bg-white dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#3a3a3c] hover:border-[#d2d2d7] dark:hover:border-[#48484a] rounded-xl h-10 min-h-10 transition-colors",
          base: "max-w-[160px]",
          value:
            "font-medium text-sm text-[#1d1d1f] dark:text-[#f5f5f7]",
          selectorIcon: "text-[#86868b] dark:text-[#636366]",
          popoverContent:
            "bg-white dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#3a3a3c] rounded-xl shadow-apple-lg",
        }}
        placeholder="Duration"
        selectedKeys={selectedDurationKeys}
        onSelectionChange={handleDurationChange}
        labelPlacement="outside-left"
        disallowEmptySelection
      >
        {durationOptions.map((d) => (
          <SelectItem
            key={d.key}
            classNames={{
              base: "rounded-lg data-[hover=true]:bg-[#f5f5f7] dark:data-[hover=true]:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]",
            }}
          >
            {d.label}
          </SelectItem>
        ))}
      </Select>

      <Button
        isLoading={isLoading}
        onPress={handleRefetch}
        isIconOnly
        className="w-10 h-10 min-w-10 rounded-xl bg-white dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#3a3a3c] hover:border-[#d2d2d7] dark:hover:border-[#48484a] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors"
      >
        <svg
          className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </Button>
    </div>
  );
}

export const SelectorIcon = () => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
      <path d="M8 9l4 -4l4 4" />
      <path d="M16 15l-4 4l-4 -4" />
    </svg>
  );
};
export default Filters;
