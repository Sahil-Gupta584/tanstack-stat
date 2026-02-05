import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Kbd,
  Tooltip as HeroToolTip,
  useDisclosure,
} from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { FaRegThumbsUp } from "react-icons/fa6";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CommonTooltip from "../commonTooltip";

import AnimatedCounter from "@/components/animatedCounter";
import type { TLiveVisitor, TWebsite } from "@/lib/types";
import { getLabel } from "@/lib/utils/server";
import { Link, useNavigate } from "@tanstack/react-router";
import GlobalMap from "../globalMap";
import { subscribeToRealtime } from "../globalMap/-actions";
import TwitterMentionsModal, { TTwitterMention } from "../twitterMentionsModal";



interface MainGraphProps extends TWebsite {

   

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: any[]; // Using any because mainGraphQuery.data.dataset is dynamically typed
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedMentions, setSelectedMentions] = useState<TTwitterMention[]>([]);
  const navigate = useNavigate({ from: '/dashboard/$websiteId' });

  const realtime = useMemo(
    () => new URL(window.location.href).searchParams.get("realtime"),
    []
  );

  const [mentions, setMentions] = useState<TTwitterMention[]>([]);

  // Fetch cached mentions on mount
  useEffect(() => {
    const triggerFetch = async () => {
      try {
        const res = await fetch(`/api/analytics/twitter-mentions?websiteId=${$id}`);
        const data = await res.json();

        if (data.ok && data.mentions) {
          setMentions(data.mentions);
        }
      } catch (e) {
        console.error("Failed to fetch twitter mentions", e);
      }
    };

    // Small delay to allow initial render/hydration
    const timeout = setTimeout(triggerFetch, 1000);
    return () => clearTimeout(timeout);
  }, [$id]);

  const data = useMemo(() => {
    // Clone the base data
    const baseData =
      chartData?.map((d) => ({
        label: d.name,
        visitors: d.visitors,
        revenue: d.revenue,
        timestamp: d.timestamp,
        id: d.id,
        twitterMentions: [...(d.twitterMentions || [])] as TTwitterMention[],
      })) || [];

    if (mentions.length > 0) {
      mentions.forEach((mention) => {
        const mentionTime = new Date(mention.timestamp).getTime();

        const bucketIndex = baseData.findIndex((b, i: number) => {
          const bucketTime = new Date(b.timestamp).getTime();
          const nextBucketTime = baseData[i + 1]
            ? new Date(baseData[i + 1].timestamp).getTime()
            : Infinity;
          return mentionTime >= bucketTime && mentionTime < nextBucketTime;
        });

        if (bucketIndex >= 0) {
          const exists = baseData[bucketIndex].twitterMentions.some(
            (m) => m.id === mention.id
          );
          if (!exists) {
            baseData[bucketIndex].twitterMentions.push(mention);
          }
        } else if (baseData.length > 0) {
          // If very new, check last bucket
          const lastBucket = baseData[baseData.length - 1];
          if (mentionTime > new Date(lastBucket.timestamp).getTime()) {
            const exists = lastBucket.twitterMentions.some(
              (m) => m.id === mention.id
            );
            if (!exists) lastBucket.twitterMentions.push(mention);
          }
        }
      });
    }

    return baseData;
  }, [chartData, mentions]);

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
        <text textAnchor="middle" fill="#999" fontSize={12}>
          {data[index].label}
        </text>
      </g>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function TwitterDot(props: any) {
    const { cx, cy, payload } = props;

    if (!payload.twitterMentions || payload.twitterMentions.length === 0) {
      return null;
    }

    return (
      <g
        className="cursor-pointer transition-transform hover:scale-150 z-50"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedMentions(payload.twitterMentions);
          onOpen();
        }}
      >
        <defs>
          <clipPath id={`circleClip-${payload.id}`}>
            <circle cx={cx} cy={cy} r={10} />
          </clipPath>
        </defs>

        {/* Border stroke */}
        <circle cx={cx} cy={cy} r={11} fill="transparent" stroke="#5b5e5e" strokeWidth={1} />

        <image
          x={cx - 10}
          y={cy - 10}
          width={20}
          height={20}
          href={payload.twitterMentions[0].image}
          clipPath={`url(#circleClip-${payload.id})`}
        />

      </g>
    );
  }

  const revenue = chartData.reduce((prev, cur) => prev + (cur.revenue || 0), 0);

  const headerData = [
    {
      name: "",
      icon: (
        <Checkbox
          classNames={{
            base: "p-0 m-0 ",
            label: "text-neutral-500 dark:text-neutral-300",
          }}
          radius="sm"
          isSelected={isVisitorsSelected}
          size="sm"
          onValueChange={setIsVisitorsSelected}
        >
          Visitors
        </Checkbox>
      ),
      value: totalVisitors,
    },
    // only add revenue block if revenue > 0
    ...(revenue > 0
      ? [
        {
          name: "Revenue/visitor",
          value:
            totalVisitors > 0
              ? "$" + (revenue / totalVisitors).toFixed(2)
              : "$0",
        },
      ]
      : []),
    {
      name: "",
      icon: (
        <Checkbox
          color="secondary"
          radius="sm"
          classNames={{
            base: "p-0 m-0  ",
            label: "text-neutral-500 dark:text-neutral-300",
          }}
          size="sm"
          isSelected={isRevenueSelected}
          onValueChange={setIsRevenueSelected}
        >
          Revenue
        </Checkbox>
      ),
      value: "$" + revenue,
    },
    {
      name: "Conversion rate",
      value: (conversionRate || 0).toFixed(2) + "%",
    },
    {
      name: "Bounce rate",
      value: bounceRate + "%",
    },
    {
      name: "Session time",
      value: `${(avgSessionTime / 60).toFixed(2)} min`,
    },
  ];

  return (
    <>
      <Card className="mt-2 lg:col-span-2 bg-white dark:bg-[#161619] border border-gray-200 dark:border-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-gray-50/50 dark:bg-[#1a1a1d]/50 border-b border-gray-200 dark:border-gray-800 rounded-t-xl sm:rounded-t-2xl px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 items-center w-full gap-y-2">
            {headerData.map((d, i) => (
              <ul
                className="px-2 sm:px-4 pr-1 sm:pr-2 my-2 sm:my-3.5 border-r border-r-gray-200 dark:border-r-gray-800 last:border-r-0 even:border-r-0 sm:even:border-r md:border-r lg:last:border-r-0"
                key={i}
              >
                <li className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {d.icon && <span className="[&>label]:text-[10px] [&>label]:sm:text-xs">{d.icon}</span>}
                  <span className="truncate">{d.name}</span>
                </li>
                <li className="text-base sm:text-lg md:text-xl font-extrabold text-ink dark:text-white mt-0.5 sm:mt-1">
                  {d.value}
                </li>
              </ul>
            ))}
            <ul
              className="relative px-2 sm:pl-2.5 my-2 sm:my-4 group cursor-pointer"
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
              <li className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-neutral-400">
                <span className="hidden sm:inline">Visitors</span> now
                <span className="relative flex size-3 sm:size-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-primary rounded-full opacity-75" />
                  <span className="inline-flex size-1.5 sm:size-2 rounded-full bg-primary items-center justify-center" />
                </span>
              </li>
              <li className="text-lg sm:text-xl md:text-[1.5rem] font-bold">
                <AnimatedCounter value={liveVisitors.length} />
              </li>

              <span className="absolute left-0 top-full mt-1 text-xs sm:text-sm text-neutral-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden sm:block">
                Watch in real time
              </span>
            </ul>
          </div>
        </CardHeader>
        <CardBody className="h-64 sm:h-80 md:h-96 bg-white dark:bg-[#161619] rounded-b-xl sm:rounded-b-2xl p-2 sm:p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} className="outline-none">
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF003C" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#FF003C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />

              <XAxis
                dataKey="id"
                tickFormatter={(_, idx) => data[idx]?.label}
                tickLine={false}
                tick={<Tick />}
              />

              <YAxis stroke="#999" />

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
                stroke="#FF003C"
                strokeWidth={2}
                fill="url(#lineGradient)"
                isAnimationActive
                activeDot={{ r: 6 }}
                hide={!isVisitorsSelected}
                dot={false}
              />

              <Bar
                hide={!isRevenueSelected}
                dataKey="revenue"
                fill="#e78468"
                radius={[6, 6, 0, 0]}
                barSize={25}
              />

              <Area
                type="monotone"
                dataKey="visitors"
                stroke="transparent"
                fill="transparent"
                isAnimationActive={false}
                activeDot={false}
                hide={!isVisitorsSelected}
                dot={<TwitterDot />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
      <AnimatePresence>
        {showMap && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full h-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlobalMap
                liveVisitors={liveVisitors}
                domain={domain}
                websiteId={$id}
              />
              <Button
                // variant="light"
                isIconOnly
                onPress={() => navigate({ to: ".", search: {} })}
                className="absolute top-4 right-4 "
              >
                ✕
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex gap-2 fixed bottom-5 left-0 right-0 items-center justify-center z-10">
        <HeroToolTip
          content={
            <p className="flex gap-2">
              Open real time map <Kbd>M</Kbd>
            </p>
          }
          className="text-foreground-50"
          showArrow
          color="foreground"
        >
          <Button
            isIconOnly
            data-insightly-goal="real-time-map-bottom-btn"
            className="text-2xl "
            color="primary"
            onPress={() =>
              navigate({
                to: ".",
                search: () => ({
                  realtime: 1,
                }),
              })
            }
            datafast-goal="real-time-map-bottom-btn"
          >
            <CiGlobe fill="white" />
          </Button>
        </HeroToolTip>
        <HeroToolTip
          content={
            <p className="flex gap-2">
              Suggest a Feedback <Kbd>F</Kbd>
            </p>
          }
          className="text-foreground-50"
          showArrow
          color="foreground"
        >
          <Button
            isIconOnly
            className="text-2xl"
            color="primary"
            as={Link}
            to="https://x.com/sahil_builds"
            target="_blank"
          >
            <FaRegThumbsUp fill="white" />
          </Button>
        </HeroToolTip>
      </div>
      <TwitterMentionsModal isOpen={isOpen} onOpenChange={onOpenChange} selectedMentions={selectedMentions} />
    </>
  );
}

export default MainGraph;
