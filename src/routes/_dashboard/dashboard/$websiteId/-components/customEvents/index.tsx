import { Card, CardBody, Tab, Tabs } from "@heroui/react";

import { CommonChart, type CommonChartProps } from "../charts/commonChart";
import { classNames } from "../charts/locationCharts";

import { Link } from "@tanstack/react-router";
import EmptyEvent from "./emptyEvent";
import { FunnelChart, TFunnelData } from "./funnelChart";

function CustomEvents({
  goalsData,
  funnelsData = [],
  totalVisitors,
  websiteId,
  duration,
  refetchFunnels,
  isDemo,
}: {
  goalsData: CommonChartProps["data"];
  funnelsData?: TFunnelData[];
  totalVisitors: number;
  websiteId: string;
  duration: string;
  refetchFunnels: () => void;
  isDemo: boolean;
}) {
  return (
    <Card className="border border-neutral-200 dark:border-[#373737] mt-4 md:col-span-2">
      <CardBody className="h-[500px] overflow-hidden p-0">
        <Tabs
          aria-label="Custom events"
          className=" border-b-[1px] rounded-none w-full border-b-neutral-200 dark:border-b-[#ffffff26]"
          classNames={{
            ...classNames,
            tabList: classNames.tabList + " w-full relative gap-2",
            tab: "w-fit",
          }}
        >
          <Tab key="Goals" title="Goals">
            {goalsData?.length > 0 ? (
              <CommonChart
                data={goalsData}
                totalVisitors={totalVisitors}
                showConversion={true}
              />
            ) : (
              <EmptyEvent websiteId={websiteId} chartType="goals" />
            )}
          </Tab>
          <Tab key="Funnels" title="Funnels">
            {funnelsData?.length > 0 ? (
              <FunnelChart
                funnelsData={funnelsData}
                duration={duration}
                websiteId={websiteId}
                refetchFunnels={refetchFunnels}
                isDemo={isDemo}
              />
            ) : (
              <EmptyEvent
                websiteId={websiteId}
                chartType="funnels"
                refetchFunnels={refetchFunnels}
              />
            )}
          </Tab>
          <Tab
            key={"aaa"}
            title="+ Add goals"
            className="absolute right-5"
            as={Link}
            href="/docs/custom-goals"
            target="_blank"
          ></Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}

export default CustomEvents;
