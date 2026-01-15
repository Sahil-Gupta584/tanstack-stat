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
    <Card className="bg-gray-50 dark:bg-[#23272f] border-2 border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30">
      <CardBody className="h-80 p-0 bg-gray-50 dark:bg-[#23272f]">
        <Tabs aria-label="systemCharts" classNames={classNames}>
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
