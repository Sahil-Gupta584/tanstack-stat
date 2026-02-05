import {
  Button,
  Select,
  SelectItem,
  SelectSection,
  SharedSelection,
} from "@heroui/react";
import { useCallback, useMemo } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { TfiReload } from "react-icons/tfi";

import { Favicon } from "@/components/favicon";
import type { TWebsite } from "@/lib/types";
import { Link } from "@tanstack/react-router";
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
    <div className="flex flex-wrap gap-2 sm:gap-4 items-end mb-2">
      <Select
        classNames={{
          trigger: "cursor-pointer gap-2 sm:gap-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161619] rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-cipher-red/50 text-sm sm:text-base min-h-[36px] sm:min-h-[40px]",
          selectorIcon: "static text-gray-600 dark:text-gray-400",
          spinner: "static",
          value: "text-ink dark:text-white text-sm sm:text-base",
          innerWrapper: "w-fit block",
          base: "w-fit min-w-0 flex-shrink",
          popoverContent: "w-fit border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161619] rounded-xl shadow-xl",
        }}
        placeholder="Select website"
        defaultSelectedKeys={selectedWebsiteKeys}
        disallowEmptySelection
        labelPlacement="outside-left"
        selectorIcon={<SelectorIcon />}
        items={data}
        isLoading={isLoading}
        maxListboxHeight={400}
        size="sm"
        renderValue={(items) =>
          items.map((item) => {
            return (
              <div
                className="text-sm sm:text-base flex items-center gap-1.5 sm:gap-2"
                key={item.textValue}
              >
                <Favicon domain={item.textValue as string} />
                <span className="truncate max-w-[100px] sm:max-w-[200px]">{item.textValue}</span>
              </div>
            );
          })
        }
      >
        <SelectSection showDivider>
          {data &&
            data.map((website) => (
              <SelectItem
                key={website.$id}
                textValue={website.domain}
                href={`/dashboard/${website.$id}`}
              >
                <div className="text-sm sm:text-base flex items-center gap-2 whitespace-nowrap">
                  <Favicon domain={website.domain} />
                  {website.domain}
                </div>
              </SelectItem>
            ))}
        </SelectSection>
        <SelectSection className="p-0">
          <SelectItem
            key="setting"
            endContent={<Plus className="size-4" />}
            href={`/new?ref=demo-filter-dropdown`}
          >
            Add Your Website
          </SelectItem>
        </SelectSection>
      </Select>

      <Select
        classNames={{
          trigger: "border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161619] rounded-lg sm:rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 hover:border-cipher-red/50 text-sm sm:text-base min-h-[36px] sm:min-h-[40px]",
          base: "w-[120px] sm:w-[160px] md:max-w-3xs",
          value: "text-ink dark:text-white text-sm sm:text-base",
          selectorIcon: "text-gray-600 dark:text-gray-400",
          popoverContent: "border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161619] rounded-xl shadow-xl",
        }}
        placeholder="Duration"
        selectedKeys={selectedDurationKeys}
        onSelectionChange={handleDurationChange}
        labelPlacement="outside-left"
        disallowEmptySelection
        size="sm"
      >
        {durationOptions.map((d) => (
          <SelectItem key={d.key}>{d.label}</SelectItem>
        ))}
      </Select>
      <Button
        isLoading={isLoading}
        onPress={handleRefetch}
        isIconOnly
        size="sm"
        spinner={<TfiReload className="animate-spinner-ease-spin" />}
        variant="bordered"
        className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161619] text-ink dark:text-white rounded-lg sm:rounded-xl hover:border-cipher-red hover:text-cipher-red hover:bg-cipher-red/10 transition-all duration-300 shadow-sm hover:shadow-md min-w-[36px] sm:min-w-[40px] h-[36px] sm:h-[40px]"
      >
        {!isLoading && <TfiReload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
      </Button>
      {!isDemo && <Button
        isIconOnly
        size="sm"
        variant="bordered"
        className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161619] text-ink dark:text-white rounded-lg sm:rounded-xl hover:border-cipher-red hover:text-cipher-red hover:bg-cipher-red/10 transition-all duration-300 shadow-sm hover:shadow-md min-w-[36px] sm:min-w-[40px] h-[36px] sm:h-[40px]"
        href={`/dashboard/${websiteId}/settings?domain=${data ? data.find((w) => w.$id === websiteId)?.domain : ""}`}
        as={Link}
      >
        <IoSettingsSharp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Button>}
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
