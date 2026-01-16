import { Favicon } from "@/components/favicon";
import type { TBucket } from "@/lib/types";
import { useUser } from "@/lib/userContext";
import { Button, Card, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { useEffect } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/_dashboard/dashboard/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Home | Dashboard" }] }),
});

function Dashboard() {
  const { user } = useUser();
  const getWebsitesQuery = useQuery({
    queryKey: ["getWebsites"],
    queryFn: async () => {
      if (!user?.$id) return null;
      const res = await axios("/api/website", {
        params: { userId: user.$id, events: true },
      });

      return res.data?.websites;
    },
    enabled: false,
  });

  useEffect(() => {
    getWebsitesQuery.refetch();
  }, [user?.$id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getEventsByDay(events: any) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts: TBucket = {};

    if (Array.isArray(events)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      events.forEach((e: any) => {
        const date = new Date(e.$createdAt);
        const day = days[date.getDay()];

        counts[day] = (counts[day] || 0) + 1;
      });
    }

    return days.map((d) => ({
      day: d,
      value: counts[d] || 0,
    }));
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              Your Websites
            </h1>
            <p className="text-[#6e6e73] dark:text-[#8e8e93] mt-1">
              Monitor performance across all your sites
            </p>
          </div>
          <Button
            as={Link}
            to="/dashboard/new"
            radius="full"
            className="bg-[#0071e3] dark:bg-[#0a84ff] text-white font-medium px-5 h-10 hover:bg-[#0066cc] dark:hover:bg-[#3d9eff] transition-colors shadow-none"
            startContent={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Add Website
          </Button>
        </div>

        {/* Website cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {getWebsitesQuery.isFetching && <Loader />}

          {Array.isArray(getWebsitesQuery.data) &&
            !getWebsitesQuery.isFetching &&
            getWebsitesQuery.data?.map((website) => (
              <Card
                as={Link}
                key={website.$id}
                href={`/dashboard/${website.$id}`}
                className="apple-card p-5 border-none cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
                    <Favicon domain={website.domain} className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                      {website.domain}
                    </h3>
                    <p className="text-sm text-[#6e6e73] dark:text-[#8e8e93]">
                      Last 7 days
                    </p>
                  </div>
                </div>

                {/* Mini chart */}
                <div className="relative h-16 mb-4">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    style={{ pointerEvents: "none" }}
                  >
                    <LineChart
                      data={getEventsByDay(website.events)}
                      className="!cursor-pointer"
                    >
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0071e3"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Stats */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {Array.isArray(website.events) ? website.events.length : 0}
                  </span>
                  <span className="text-sm text-[#6e6e73] dark:text-[#8e8e93]">
                    visitors today
                  </span>
                </div>
              </Card>
            ))}

          {Array.isArray(getWebsitesQuery.data) &&
            getWebsitesQuery.data.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#e8e8ed] dark:bg-[#2c2c2e] flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-[#86868b] dark:text-[#636366]"
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
                </div>
                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  No websites yet
                </h3>
                <p className="text-[#6e6e73] dark:text-[#8e8e93] mb-6 max-w-sm">
                  Add your first website to start tracking visitors and gaining
                  insights.
                </p>
                <Button
                  as={Link}
                  to="/dashboard/new"
                  radius="full"
                  className="bg-[#0071e3] dark:bg-[#0a84ff] text-white font-medium px-6 h-10 hover:bg-[#0066cc] dark:hover:bg-[#3d9eff] transition-colors shadow-none"
                >
                  Add Website
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return Array.from({ length: 3 }).map((_, i) => (
    <Card key={i} className="apple-card p-5 border-none">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 rounded-lg mb-2" />
          <Skeleton className="h-4 w-20 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-xl mb-4" />
      <Skeleton className="h-6 w-24 rounded-lg" />
    </Card>
  ));
}
