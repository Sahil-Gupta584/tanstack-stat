import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { useTheme } from "next-themes";

import { CommonChart, type CommonChartProps } from "../charts/commonChart";
import { classNames } from "../charts/locationCharts";

import LinkComponent from "@/components/link";
import { Link } from "@tanstack/react-router";

function CustomEvents({
  goalsData,
  totalVisitors,
}: {
  goalsData: CommonChartProps["data"];
  totalVisitors: number;
}) {
  const theme = useTheme();
  return (
    <Card className="border border-neutral-200 dark:border-[#373737] mt-4 md:col-span-2">
      <CardBody className="h-80 overflow-hidden p-0">
        <Tabs
          aria-label="Custom events"
          className=" border-b-[1px] rounded-none w-full border-b-neutral-200 dark:border-b-[#ffffff26]"
          classNames={{
            ...classNames,
            tabList: classNames.tabList + " w-full relative",
            tab: "w-fit",
          }}
          color="secondary"
        >
          <Tab key="Goals" title="Goals" className="pr-4">
            {goalsData?.length > 0 ? (
              <CommonChart
                data={goalsData}
                totalVisitors={totalVisitors}
                showConversion={true}
              />
            ) : (
              <div className="relative flex h-full">
                <img
                  src={`/images/goals${theme.resolvedTheme === "light" ? "-light" : ""}.png`}
                  alt=""
                  className="grow opacity-[0.25]"
                />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Card isBlurred className="p-4">
                    <CardHeader className="flex-col items-center justify-center gap-4 font-bold">
                      Track what visitors do on your site
                      <Button
                        color="primary"
                        startContent={"✕"}
                        as={Link}
                        href="/docs/custom-goals"
                      >
                        ✚ Add Goals
                      </Button>
                    </CardHeader>
                    <CardFooter className="text-sm text-secondary">
                      Revenue-related goals are automatically tracked with{" "}
                      <LinkComponent
                        text="revenue attribution"
                        blank
                        href="/docs/revenue-attribution-guide"
                      />
                    </CardFooter>
                  </Card>
                </div>
              </div>
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
