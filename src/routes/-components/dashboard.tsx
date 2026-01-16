import { GraphLoader, MainGraphLoader } from "@/components/loaders";
import { TWebsite } from "@/lib/types";
import { useUser } from "@/lib/userContext";
import { Card, CardHeader } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { lazy, useCallback, useMemo, useState } from "react";
import { CommonChart } from "../_dashboard/dashboard/$websiteId/-components/charts/commonChart";
import LocationCharts from "../_dashboard/dashboard/$websiteId/-components/charts/locationCharts";
import MainGraph from "../_dashboard/dashboard/$websiteId/-components/charts/mainGraph";
import SystemCharts from "../_dashboard/dashboard/$websiteId/-components/charts/systemCharts";
import CustomEvents from "../_dashboard/dashboard/$websiteId/-components/customEvents";
import Filters from "../_dashboard/dashboard/$websiteId/-components/filters";

const WaitForFirstEvent = lazy(
  () =>
    import("../_dashboard/dashboard/$websiteId/-components/WaitForFirstEvent")
);

export function Dashboard({
  websiteId,
  isDemo,
}: {
  websiteId: string;
  isDemo: boolean;
}) {
  const [duration, setDuration] = useState("last_7_days");
  const { user } = useUser();

  const getWebsitesQuery = useQuery({
    queryKey: ["getWebsites"],
    queryFn: async () => {
      try {
        if (isDemo) {
          return [{ $id: websiteId, domain: "syncmate.xyz" }] as TWebsite[];
        }

        const res = await axios("/api/website", {
          params: { userId: user?.$id },
        });

        return res.data?.websites as TWebsite[];
      } catch (error) {
        console.log(error);

        return [{ $id: websiteId, domain: "syncmate.xyz" }] as TWebsite[];
      }
    },
    enabled: !!user?.$id,
  });

  const mainGraphQuery = useQuery({
    queryKey: ["mainGraph", websiteId, duration],
    queryFn: async () => {
      return (
        await axios("/api/analytics/main", { params: { duration, websiteId } })
      ).data;
    },
    enabled: !!websiteId,
  });

  const otherGraphQuery = useQuery({
    queryKey: ["otherGraphs", websiteId, duration],
    queryFn: async () => {
      return (
        await axios("/api/analytics/others", {
          params: { duration, websiteId },
        })
      ).data;
    },
    enabled: !!websiteId && !!mainGraphQuery.data,
  });

  const {
    pageData,
    referrerData,
    countryData,
    regionData,
    cityData,
    browserData,
    deviceData,
    osData,
  } = otherGraphQuery.data?.dataset || {};

  const currentWebsite = useMemo(() => {
    return (
      getWebsitesQuery?.data?.find((w) => w?.$id === websiteId) || {
        $id: websiteId,
        domain: "",
      }
    );
  }, [getWebsitesQuery.data, websiteId]);

  const chartData = useMemo(
    () => mainGraphQuery.data?.dataset,
    [mainGraphQuery.data?.dataset]
  );

  const totalVisitors = useMemo(() => {
    if (!chartData) return 0;

    return (
      Number(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chartData.reduce((prev: any, cur: any) => prev + cur.visitors, 0)
      ) || 0
    );
  }, [chartData]);

  const goalsQuery = useQuery({
    queryKey: ["goals", websiteId, duration],
    queryFn: async () => {
      const goalsData = (
        await axios("/api/analytics/goals", {
          params: { duration, websiteId },
        })
      ).data;
      return typeof goalsData === "string" ? JSON.parse(goalsData) : goalsData;
    },
    enabled: !!websiteId && !!mainGraphQuery.data,
  });

  const funnelsQuery = useQuery({
    queryKey: ["funnels", websiteId, duration],
    queryFn: async () => {
      const funnelsData = (
        await axios("/api/analytics/funnels", {
          params: { duration, websiteId },
        })
      ).data;
      return typeof funnelsData === "string"
        ? JSON.parse(funnelsData)
        : funnelsData;
    },
    enabled: !!websiteId && !!mainGraphQuery.data,
  });

  const handleRefetchAll = useCallback(() => {
    void mainGraphQuery.refetch();
    void otherGraphQuery.refetch();
    void goalsQuery.refetch();
    void funnelsQuery.refetch();
    void getWebsitesQuery.refetch();
  }, [
    mainGraphQuery.refetch,
    otherGraphQuery.refetch,
    goalsQuery.refetch,
    funnelsQuery.refetch,
    getWebsitesQuery.refetch,
    user?.$id,
  ]);

  return (
    <section className="pb-12">
      {mainGraphQuery.data && mainGraphQuery.data?.isEmpty && (
        <WaitForFirstEvent
          websiteId={websiteId as string}
          currentWebsite={currentWebsite}
        />
      )}

      {getWebsitesQuery.data && (
        <Filters
          duration={duration}
          setDuration={setDuration}
          websiteId={websiteId as string}
          data={getWebsitesQuery.data}
          isLoading={
            getWebsitesQuery.isFetching ||
            mainGraphQuery.isFetching ||
            otherGraphQuery.isFetching ||
            funnelsQuery.isFetching
          }
          refetchMain={handleRefetchAll}
          isDemo={isDemo}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-[minmax(420px,auto)] mt-6">
        {mainGraphQuery.isFetching || !mainGraphQuery.data ? (
          <MainGraphLoader />
        ) : (
          <MainGraph
            totalVisitors={totalVisitors}
            chartData={chartData!}
            duration={duration}
            avgSessionTime={mainGraphQuery.data.avgSessionTime}
            bounceRate={mainGraphQuery.data.bounceRate}
            $id={websiteId as string}
            domain={currentWebsite?.domain || ""}
            conversionRate={otherGraphQuery.data?.overallConversionRate}
          />
        )}

        {otherGraphQuery.isFetching || !pageData ? (
          <GraphLoader length={1} />
        ) : (
          <Card className="apple-card border-none overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-[#e8e8ed] dark:border-[#2c2c2e]">
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Pages
              </h3>
            </CardHeader>
            <CommonChart data={pageData} />
          </Card>
        )}

        {otherGraphQuery.isFetching || !referrerData ? (
          <GraphLoader length={1} />
        ) : (
          <Card className="apple-card border-none overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-[#e8e8ed] dark:border-[#2c2c2e]">
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Referrers
              </h3>
            </CardHeader>
            <CommonChart data={referrerData} />
          </Card>
        )}

        {otherGraphQuery.isFetching ||
        !countryData ||
        !cityData ||
        !regionData ? (
          <GraphLoader length={3} />
        ) : (
          <LocationCharts
            countryData={countryData}
            regionData={regionData}
            cityData={cityData}
          />
        )}

        {otherGraphQuery.isFetching ||
        !browserData ||
        !deviceData ||
        !osData ? (
          <GraphLoader length={3} />
        ) : (
          <SystemCharts
            browserData={browserData}
            deviceData={deviceData}
            osData={osData}
          />
        )}

        {goalsQuery.isFetching ||
        !goalsQuery.data ||
        funnelsQuery.isFetching ||
        !funnelsQuery.data ? (
          <GraphLoader className="md:col-span-2" length={1} />
        ) : (
          <CustomEvents
            goalsData={goalsQuery.data?.dataset}
            funnelsData={funnelsQuery.data?.dataset}
            totalVisitors={totalVisitors}
            websiteId={websiteId}
            duration={duration}
            refetchFunnels={funnelsQuery.refetch}
            isDemo={isDemo}
          />
        )}
      </div>
    </section>
  );
}
