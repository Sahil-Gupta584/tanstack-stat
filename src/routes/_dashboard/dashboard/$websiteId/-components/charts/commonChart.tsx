import { CardBody } from "@heroui/react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CommonTooltip from "../commonTooltip";

import type { Metric } from "@/lib/types";
import { formatNumber } from "@/lib/utils/client";
import { useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomBarShape({ x, y, width, height, bar, payload }: any) {
  const hasRevenue = payload?.revenue;

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      className="cursor-pointer"
    >
      <div
        className={`group-hover:opacity-40 hover:!opacity-100 flex items-center ${bar === "visitor" ? "" : "rounded-r-lg"} ${!hasRevenue ? "rounded-r-lg" : ""} h-full transition cursor-pointer ${bar == "visitor" ? "bg-[#0071e3]/30 dark:bg-[#0a84ff]/30 mr-[2px]" : "bg-[#34c759]/40 dark:bg-[#30d158]/40"} `}
      />
    </foreignObject>
  );
}

export interface CommonChartProps {
  data: Metric[];
  totalVisitors?: number;
  showConversion?: boolean;
}
export function CommonChart({
  data,
  showConversion,
  totalVisitors,
}: CommonChartProps) {
  const sortedData = useMemo(
    () => [...(data || [])].sort((a, b) => b.visitors - a.visitors),
    [data]
  );

  return (
    <CardBody className={`space-y-2 px-6 py-4 h-full scrollbar-hide`}>
      {sortedData?.length > 0 ? (
        <ResponsiveContainer
          width="100%"
          height={sortedData.length * 40}
          className="max-h-[381px]"
        >
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            barGap={4}
            className="group"
          >
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="label" hide />

            <Bar
              legendType="cross"
              dataKey="visitors"
              stackId={"a"}
              shape={<CustomBarShape bar={"visitor"} />}
            >
              <LabelList
                content={({ height, y, value, index }) => {
                  return (
                    <foreignObject x={10} y={y} width="100%" height={height}>
                      <div className="w-full h-full flex flex-col cursor-pointer">
                        <span className="flex gap-2 items-center pt-1 text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                          {index !== undefined &&
                            sortedData[index].imageUrl && (
                              <img
                                className="w-4 h-4 rounded"
                                alt=""
                                src={sortedData[index].imageUrl}
                              />
                            )}

                          {value}
                        </span>
                      </div>
                    </foreignObject>
                  );
                }}
                position="top"
                dataKey="label"
              />
            </Bar>
            <Bar dataKey="revenue" shape={<CustomBarShape />} stackId="a">
              <LabelList
                content={({ height, y, value }) => (
                  <foreignObject x={-5} y={y} width="100%" height={height}>
                    <div className="w-full h-full flex flex-col cursor-pointer">
                      <span className="self-end pr-2 mt-[2px] text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {formatNumber(Number(value) || 0)}
                        {showConversion && totalVisitors ? (
                          <span className="text-[#86868b] dark:text-[#8e8e93]">
                            &nbsp;(
                            {(+(Number(value) / totalVisitors) * 100).toFixed(
                              2
                            )}
                            %)
                          </span>
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </foreignObject>
                )}
                position="top"
                dataKey="visitors"
              />
            </Bar>

            <Tooltip
              cursor={{ fill: "none" }}
              content={({ payload }) => (
                <CommonTooltip
                  data={payload?.[0]?.payload}
                  label={payload?.[0]?.payload?.label}
                />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-[#86868b] dark:text-[#8e8e93] text-sm">No data available</span>
        </div>
      )}
    </CardBody>
  );
}
