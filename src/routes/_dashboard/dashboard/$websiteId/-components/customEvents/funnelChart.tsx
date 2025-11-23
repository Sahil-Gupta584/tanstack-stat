import { FunnelChartLoader } from "@/components/loaders";
import { Tab, Tabs, useDisclosure } from "@heroui/react";
import { ResponsiveFunnel } from "@nivo/funnel";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import FunnelCommonModal from "../funnel/funnelCommonModal";
import EmptyEvent from "./emptyEvent";
import { FunnelDropDown, PRIMARY_COLORS } from "./funnelDropdown";

export type TFunnelData = {
  $id: string;
  website: string;
  name: string;
};

export type TFunnelStep = {
  $id?: string;
  name: string;
  kind: "page" | "goal";
  descriptor: string; // url or goal id/label
  visitors?: number;
  dropoff?: number;
  funnelId: string;
  order: number;
};

export function FunnelChart({
  funnelsData,
  duration,
  websiteId,
  refetchFunnels,
}: {
  refetchFunnels: () => void;
  funnelsData: TFunnelData[];
  duration: string;
  websiteId: string;
}) {
  const disclosure = useDisclosure();
  const [funnels, setFunnels] = useState(funnelsData);
  const [selectedFunnelIndex, setSelectedFunnelIndex] = useState<number>(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const {
    refetch,
    isLoading,
    isRefetching,
    data: funnelStepsData,
  } = useQuery({
    queryKey: ["funnelSteps", selectedFunnelIndex, duration],
    queryFn: async () => {
      const response = await axios.get(
        `/api/analytics/funnels/${funnels[selectedFunnelIndex].$id}`,
        { params: { websiteId, duration } }
      );
      return response.data?.dataset as TFunnelStep[];
    },
    enabled: funnels.length > 0,
  });

  useEffect(() => {
    refetch();
  }, [selectedFunnelIndex]);

  if (isLoading || isRefetching) return <FunnelChartLoader />;

  if (!funnels || funnels.length === 0)
    return <EmptyEvent chartType="funnels" websiteId={websiteId} />;

  const nivoData =
    funnelStepsData?.map((s) => ({
      id: s.$id || "",
      value: s.visitors || 0,
      label: s.name,
      dropoff: s.dropoff || 0,
    })) || [];

  return (
    <div className="flex h-full w-full">
      {/* Main Chart */}
      <div className="flex-1 flex flex-col h-full ">
        <div className="h-[85%]">
          <ResponsiveFunnel
            data={nivoData}
            direction="horizontal"
            valueFormat={(v) => `${v} visitors`}
            colors={PRIMARY_COLORS}
            borderWidth={15}
            beforeSeparatorLength={80}
            afterSeparatorLength={80}
            currentBorderWidth={30}
            shapeBlending={0.6}
            tooltip={({ part }) => (
              <div
                style={{
                  padding: "6px 10px",
                  background: "var(--heroui-background)",
                  border: "1px solid var(--heroui-border)",
                  borderRadius: 6,
                }}
              >
                <div>{part.label}</div>
                <div>{part.value} visitors</div>
                <div>Drop-off: {part.data.dropoff}</div>
              </div>
            )}
          />
        </div>

        {/* Step Info BELOW */}
        <div
          className="grid grow"
          style={{
            gridTemplateColumns: `repeat(${nivoData.length}, minmax(0, 1fr))`,
          }}
        >
          {nivoData.map((step, index) => (
            <div
              key={index}
              className="text-center border-l dark:border-base-700 border-base-300"
            >
              <div className="font-semibold">{step.value} visitors</div>

              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] mx-auto">
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className="
      border-l border-neutral-200 dark:border-[#373737]
      overflow-y-auto
      transition-[width] duration-300 ease-in-out
      w-[5%] hover:w-[25%] flex flex-col justify-between bg-content2 dark:bg-content4
    "
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <Tabs
          aria-label="Funnel List"
          isVertical
          selectedKey={String(selectedFunnelIndex)}
          onSelectionChange={(key) => setSelectedFunnelIndex(Number(key))}
          className="w-full mt-2"
          classNames={{
            tabList: "w-full bg-transparent rounded-none border-0 p-0",
            tab: "truncate h-fit border-0 rounded-none outline-none shadow-none justify-start ",
            cursor:
              "truncate h-fit border-0 rounded-none !bg-content1 !dark:bg-content3 outline-none shadow-none justify-start ",
            tabContent: "w-full",
          }}
        >
          {funnels.map((funnel, index) => (
            <Tab
              key={index}
              title={
                <div className="relative w-full flex flex-col items-start justify-start py-2">
                  <span className=" font-medium ">{funnel.name}</span>
                  <span className=" text-xs text-base-500">
                    {nivoData.length} steps
                  </span>
                  <div className="absolute top-0 right-0">
                    <FunnelDropDown
                      isCollapsed={!isSidebarExpanded}
                      setFunnels={setFunnels}
                      websiteId={websiteId}
                      prevData={{
                        name: funnel.name,
                        steps: funnelStepsData || [],
                        $id: funnel.$id,
                      }}
                      refetchFunnels={refetchFunnels}
                    />
                  </div>
                </div>
              }
            />
          ))}
        </Tabs>
        <div className="p-2 w-full">
          <FunnelCommonModal
            disclosure={disclosure}
            refetchFunnels={refetchFunnels}
            websiteId={websiteId}
            variant="bordered"
            isCollapsed={!isSidebarExpanded}
          />
        </div>
      </div>
    </div>
  );
}
