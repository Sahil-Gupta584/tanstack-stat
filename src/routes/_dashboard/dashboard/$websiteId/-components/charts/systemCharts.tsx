import { Card, CardBody, Tab, Tabs } from "@heroui/react";

import { CommonChart, type CommonChartProps } from "./commonChart";
import { classNames } from "./locationCharts";

interface SystemChartProps {
  browserData: CommonChartProps["data"];
  osData: CommonChartProps["data"];
  deviceData: CommonChartProps["data"];
}

export default function SystemCharts({
  browserData,
  deviceData,
  osData,
}: SystemChartProps) {
  return (
    <Card className="bg-white dark:bg-[#161619] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <CardBody className="h-80 p-0 bg-white dark:bg-[#161619]">
        <Tabs aria-label="systemCharts" classNames={{
          ...classNames,
          tabList: "bg-gray-50/50 dark:bg-[#1a1a1d]/50 p-2 border-b border-gray-200 dark:border-gray-800",
          base: "w-full",
          panel: "p-0 h-full bg-white dark:bg-[#161619]"
        }}>
          <Tab key="browser" title={<span>Browser</span>}>
            <CommonChart data={browserData} />
          </Tab>
          <Tab key="OS" title="OS">
            <CommonChart data={osData} />
          </Tab>
          <Tab key="Device" title="Device">
            <CommonChart data={deviceData} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
