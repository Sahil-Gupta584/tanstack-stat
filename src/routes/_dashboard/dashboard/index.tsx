import { Favicon } from "@/components/favicon";
import type { TBucket } from "@/lib/types";
import { useUser } from "@/lib/userContext";
import { Button, Card, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import { Line, LineChart, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/_dashboard/dashboard/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Home | Dashboard" }] }),
});

function Dashboard() {
  const { user } = useUser();
  const getWebsitesQuery = useQuery({
    queryKey: ["getWebsites", user?.$id],
    queryFn: async () => {
      if (!user?.$id) return null;
      const res = await axios("/api/website", {
        params: { userId: user.$id, events: true },
      });

      return res.data?.websites;
    },
    enabled: !!user?.$id,
  });

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
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-ink dark:text-white">
              Your Websites
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Manage and track your analytics
            </p>
          </div>
          <Link to="/dashboard/new" className="self-start sm:self-auto">
            <Button
              startContent={<FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />}
              className="bg-cipher-red hover:bg-cipher-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors duration-300"
            >
              Add Website
            </Button>
          </Link>
        </div>

        {/* Website cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {getWebsitesQuery.isFetching && <Loader />}

          {Array.isArray(getWebsitesQuery.data) &&
            !getWebsitesQuery.isFetching &&
            getWebsitesQuery.data?.map((website) => (
              <Card
                as={Link}
                key={website.$id}
                href={`/dashboard/${website.$id}`}
                className="gap-2 flex-row p-3 sm:p-4 md:p-5 bg-white dark:bg-[#1a1a1d] border-2 border-gray-300 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl shadow-black/10 dark:shadow-black/30 hover:border-cipher-red hover:shadow-xl sm:hover:shadow-2xl hover:shadow-cipher-red/20 dark:hover:shadow-cipher-red/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="self-start mt-[3px]">
                  <Favicon domain={website.domain} />
                </div>

                <div className="grow min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-ink dark:text-white truncate">{website.domain}</h3>
                  {/* Mini chart */}
                  <div className="relative h-14 sm:h-16 md:h-20">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      style={{ pointerEvents: "none" }}
                    >
                      <LineChart
                        data={getEventsByDay(website.events)}
                        className="scale-[1.03] !cursor-pointer"
                      >
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#FF003C"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Stats */}
                  <p className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <span className="font-bold text-cipher-red">
                      {Array.isArray(website.events)
                        ? website.events.length
                        : 0}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      visitors in last 24h
                    </span>
                  </p>
                </div>
              </Card>
            ))}

          {Array.isArray(getWebsitesQuery.data) &&
            getWebsitesQuery.data.length === 0 && (
              <div className="col-span-full text-center py-8 sm:py-12">
                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-4">
                  No websites added yet.
                </p>
                <Link to="/dashboard/new">
                  <Button className="bg-cipher-red hover:bg-cipher-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors duration-300">
                    Add Website to get started 🚀
                  </Button>
                </Link>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function Loader() {
  const skeletonClass = "bg-black/5 dark:bg-white/5";
  return Array.from({ length: 3 }).map((_, i) => (
    <Card key={i} className="p-3">
      <div className="flex items-center gap-3 mb-1">
        <Skeleton className={`h-6 w-6 rounded ${skeletonClass}`} />
        <Skeleton className={`h-5 w-32 rounded ${skeletonClass}`} />
      </div>
      <Skeleton className={`h-20 w-full rounded-lg mb-2 ${skeletonClass}`} />
      <Skeleton className={`h-4 w-28 rounded ${skeletonClass}`} />
    </Card>
  ));
}
