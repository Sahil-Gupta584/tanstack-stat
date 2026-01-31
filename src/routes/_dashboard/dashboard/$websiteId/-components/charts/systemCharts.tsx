import { Card, CardBody, Tab, Tabs } from "@heroui/react";

import { CommonChart, type CommonChartProps } from "./commonChart";
import { tabsClassNames } from "@/lib/utils/client";

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
        <Tabs aria-label="systemCharts"
          classNames={tabsClassNames}
        >
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
