import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Tooltip as HeroToolTip,
  Kbd,
} from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CommonTooltip from "../commonTooltip";
import { subscribeToRealtime } from "../globalMap/-actions";

import AnimatedCounter from "@/components/animatedCounter";
import type { TLiveVisitor, TWebsite } from "@/lib/types";
import { getLabel } from "@/lib/utils/server";
import { Link, useNavigate } from "@tanstack/react-router";
import GlobalMap from "../globalMap";

interface MainGraphProps extends TWebsite {
  chartData: {
    id: string;
    name: string;
    visitors: number;
    revenue: number;
    timestamp: string;
    renewalRevenue: number;
    refundedRevenue: number;
    customers: number;
    sales: number;
    goalCount: number;
  }[];
  duration: string;
  bounceRate: string;
  avgSessionTime: number;
  conversionRate: number;
  totalVisitors: number;
}

function MainGraph({
  chartData,
  duration,
  avgSessionTime,
  bounceRate,
  $id,
  domain,
  conversionRate,
  totalVisitors,
}: MainGraphProps) {
  const [isVisitorsSelected, setIsVisitorsSelected] = useState(true);
  const [isRevenueSelected, setIsRevenueSelected] = useState(true);
  const [liveVisitors, setLiveVisitors] = useState<TLiveVisitor[]>([]);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const realtime = useMemo(
    () => new URL(window.location.href).searchParams.get("realtime"),
    []
  );

  const data = useMemo(
    () =>
      chartData?.map((d) => ({
        label: d.name,
        visitors: d.visitors,
        revenue: d.revenue,
        timestamp: d.timestamp,
        id: d.id,
      })),
    [chartData]
  );

  useEffect(() => {
    subscribeToRealtime($id, setLiveVisitors);
  }, [$id]);

  useEffect(() => {
    if (realtime === "1") {
      setShowMap(true);
    }
  }, [realtime]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function Tick({ x, y, index }: any) {
    const step = Math.ceil(data.length / 8);
    const isVisible = index % step === 0 || index === data.length - 1;

    if (!isVisible) return null;

    return (
      <g transform={`translate(${x},${y + 10})`}>
        <text
          textAnchor="middle"
          className="fill-[#86868b] dark:fill-[#636366]"
          fontSize={11}
        >
          {data[index].label}
        </text>
      </g>
    );
  }

  const revenue = chartData.reduce((prev, cur) => prev + cur.revenue, 0);

  const stats = [
    {
      label: "Visitors",
      value: totalVisitors.toLocaleString(),
      toggle: (
        <Checkbox
          classNames={{
            base: "p-0 m-0",
            wrapper:
              "before:border-[#d2d2d7] dark:before:border-[#48484a] group-data-[selected=true]:before:border-[#0071e3] dark:group-data-[selected=true]:before:border-[#0a84ff]",
          }}
          radius="sm"
          isSelected={isVisitorsSelected}
          size="sm"
          onValueChange={setIsVisitorsSelected}
          color="primary"
        />
      ),
    },
    {
      label: "Revenue",
      value: "$" + revenue.toLocaleString(),
      toggle: (
        <Checkbox
          classNames={{
            base: "p-0 m-0",
            wrapper:
              "before:border-[#d2d2d7] dark:before:border-[#48484a] group-data-[selected=true]:before:border-[#34c759] dark:group-data-[selected=true]:before:border-[#30d158]",
          }}
          radius="sm"
          isSelected={isRevenueSelected}
          size="sm"
          onValueChange={setIsRevenueSelected}
          color="success"
        />
      ),
    },
    ...(revenue > 0
      ? [
          {
            label: "Rev/visitor",
            value:
              totalVisitors > 0
                ? "$" + (revenue / totalVisitors).toFixed(2)
                : "$0",
          },
        ]
      : []),
    {
      label: "Conversion",
      value: (conversionRate || 0).toFixed(1) + "%",
    },
    {
      label: "Bounce rate",
      value: bounceRate + "%",
    },
    {
      label: "Avg. session",
      value: `${(avgSessionTime / 60).toFixed(1)}m`,
    },
  ];

  return (
    <>
      <Card className="apple-card md:col-span-2 border-none overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-[#e8e8ed] dark:border-[#2c2c2e]">
          <div className="flex flex-wrap items-center gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex items-start gap-3 ${i < stats.length - 1 ? "pr-6 border-r border-[#e8e8ed] dark:border-[#3a3a3c]" : ""}`}
              >
                {stat.toggle && <div className="mt-1">{stat.toggle}</div>}
                <div>
                  <p className="text-xs font-medium text-[#86868b] dark:text-[#8e8e93] uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Live visitors */}
            <div
              className="flex items-start gap-3 cursor-pointer group"
              onClick={() =>
                navigate({
                  to: ".",
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  search: (prev: any) => ({
                    ...prev,
                    realtime: 1,
                  }),
                })
              }
            >
              <div className="mt-2 relative">
                <span className="absolute inline-flex h-2.5 w-2.5 animate-ping bg-[#34c759] dark:bg-[#30d158] rounded-full opacity-75" />
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#34c759] dark:bg-[#30d158]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#86868b] dark:text-[#8e8e93] uppercase tracking-wide">
                  Live now
                </p>
                <p className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5 group-hover:text-[#0071e3] dark:group-hover:text-[#0a84ff] transition-colors">
                  <AnimatedCounter value={liveVisitors.length} />
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody className="h-80 p-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} className="outline-none">
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0071e3" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#0071e3" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="id"
                tickFormatter={(_, idx) => data[idx].label}
                tickLine={false}
                axisLine={false}
                tick={<Tick />}
              />

              <YAxis
                stroke="#86868b"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                width={40}
              />

              <Tooltip
                content={({ payload }) => (
                  <CommonTooltip
                    data={payload?.[0]?.payload}
                    label={getLabel(
                      String(payload?.[0]?.payload?.timestamp),
                      duration
                    )}
                  />
                )}
              />

              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#0071e3"
                strokeWidth={2}
                fill="url(#lineGradient)"
                isAnimationActive
                activeDot={{
                  r: 5,
                  fill: "#0071e3",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                hide={!isVisitorsSelected}
              />
              <Bar
                hide={!isRevenueSelected}
                dataKey="revenue"
                fill="#34c759"
                opacity={0.8}
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <AnimatePresence>
        {showMap && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full h-full"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <GlobalMap
                liveVisitors={liveVisitors}
                domain={domain}
                websiteId={$id}
              />
              <Button
                isIconOnly
                onPress={() => navigate({ to: ".", search: {} })}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating action buttons */}
      <div className="flex gap-3 fixed bottom-6 left-1/2 -translate-x-1/2 z-10">
        <HeroToolTip
          content={
            <p className="flex items-center gap-2 text-sm">
              Real-time map <Kbd className="text-xs">M</Kbd>
            </p>
          }
          classNames={{
            content:
              "bg-[#1c1c1e] dark:bg-[#2c2c2e] text-white border-none shadow-apple-lg",
          }}
          showArrow
        >
          <Button
            isIconOnly
            data-insightly-goal="real-time-map-bottom-btn"
            className="w-12 h-12 rounded-full bg-[#0071e3] dark:bg-[#0a84ff] text-white shadow-apple-lg hover:scale-105 transition-transform"
            onPress={() =>
              navigate({
                to: ".",
                search: (prev) => ({
                  ...prev,
                  realtime: 1,
                }),
              })
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </Button>
        </HeroToolTip>
        <HeroToolTip
          content={
            <p className="flex items-center gap-2 text-sm">
              Send feedback <Kbd className="text-xs">F</Kbd>
            </p>
          }
          classNames={{
            content:
              "bg-[#1c1c1e] dark:bg-[#2c2c2e] text-white border-none shadow-apple-lg",
          }}
          showArrow
        >
          <Button
            isIconOnly
            className="w-12 h-12 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-apple-lg hover:scale-105 transition-transform"
            as={Link}
            to="https://x.com/sahil_builds"
            target="_blank"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </Button>
        </HeroToolTip>
      </div>
    </>
  );
}

export default MainGraph;
