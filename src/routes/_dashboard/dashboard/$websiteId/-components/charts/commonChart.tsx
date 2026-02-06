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
import { ExternalLinkIcon } from "lucide-react";

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
        className={`group-hover:opacity-40 hover:!opacity-100 flex items-center ${bar === "visitor" ? "" : "rounded-r-md"} ${!hasRevenue ? "rounded-r-md" : ""} h-full transition ${bar == "visitor" ? "bg-primary-500/40 mr-[2px]" : "bg-[#e78468]/60"} pointer-events-none`}
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
    <CardBody className={`space-y-2 px-0 h-full scrollbar-hide`}>
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
                  if (index === undefined) return null;
                  const item = sortedData[index];

                  return (
                    <foreignObject x={10} y={y} width="calc(100% - 20px)" height={height}>
                      <div className="w-full h-full flex items-center justify-between pointer-events-auto group">
                        {/* Left side: Icon + Label */}
                        <div className="flex items-center gap-2 min-w-0 pr-4">
                          {item.imageUrl && (
                            <img
                              className="size-[18px] shrink-0"
                              alt=""
                              src={item.imageUrl}
                            />
                          )}
                          <span className="truncate text-sm font-medium">
                            {value}
                          </span>

                          {/* Link Button (only shows on hover) */}
                          {typeof value === "string" && (value.startsWith("https://") || value.startsWith("http://")) && (
                            <div className="hidden group-hover:flex items-center shrink-0">
                              <a
                                href={value}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 bg-foreground/10 hover:bg-foreground/20 rounded-md transition-all shadow-sm"
                                title="Open link"
                              >
                                <ExternalLinkIcon className="size-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex items-baseline shrink-0 pl-2 gap-1.5 opacity-90">
                          <span className="text-[11px] md:text-sm font-bold">
                            {formatNumber(item.visitors)}
                          </span>
                          {item.pageviews !== undefined && item.pageviews > item.visitors && (
                            <span className="text-[9px] md:text-[10px] opacity-60 font-medium">
                              {formatNumber(item.pageviews)} <span className="opacity-70 text-[8px] md:text-[9px]">PVs</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </foreignObject>
                  );
                }}
                position="top"
                dataKey="label"
              />
            </Bar>
            <Bar dataKey="revenue" shape={<CustomBarShape />} stackId="a" />

            <Tooltip
              cursor={{ fill: "none" }}
              allowEscapeViewBox={{ y: true }}
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
        <span className="m-auto text-warning">No Data Found</span>
      )}
    </CardBody>
  );
}
