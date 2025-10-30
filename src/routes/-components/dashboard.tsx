import { GraphLoader, MainGraphLoader } from "@/components/loaders";
import { account } from "@/configs/appwrite/clientConfig";
import { TWebsite } from "@/lib/types";
import { Card, CardHeader, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { CommonChart } from "../_dashboard/dashboard/$websiteId/-components/charts/commonChart";
import LocationCharts from "../_dashboard/dashboard/$websiteId/-components/charts/locationCharts";
import MainGraph from "../_dashboard/dashboard/$websiteId/-components/charts/mainGraph";
import SystemCharts from "../_dashboard/dashboard/$websiteId/-components/charts/systemCharts";
import CustomEvents from "../_dashboard/dashboard/$websiteId/-components/customEvents";
import Filters from "../_dashboard/dashboard/$websiteId/-components/filters";
import WaitForFirstEvent from "../_dashboard/dashboard/$websiteId/-components/WaitForFirstEvent";

export function Dashboard({
  websiteId,
  isDemo,
}: {
  websiteId: string;
  isDemo: boolean;
}) {
  const [duration, setDuration] = useState("last_7_days");

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

  const getWebsitesQuery = useQuery({
    queryKey: ["getWebsites"],
    queryFn: async () => {
      try {
        if (isDemo) {
          return [{ $id: websiteId, domain: "syncmate.xyz" }] as TWebsite[];
        }
        const user = await account.get();
        const res = await axios("/api/website", {
          params: { userId: user.$id },
        });

        return res.data?.websites as TWebsite[];
      } catch (error) {
        console.log(error);

        return [{ $id: websiteId, domain: "syncmate.xyz" }] as TWebsite[];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
    [mainGraphQuery.data?.dataset],
  );

  const totalVisitors = useMemo(() => {
    if (!chartData) return 0;

    return (
      Number(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chartData.reduce((prev: any, cur: any) => prev + cur.visitors, 0),
      ) || 0
    );
  }, [chartData]);

  const goalsQuery = useQuery({
    queryKey: ["goals", websiteId, duration],
    queryFn: async () => {
      return (
        await axios("/api/analytics/goals", {
          params: { duration, websiteId },
        })
      ).data;
    },
    enabled: !!websiteId && !!mainGraphQuery.data,
  });

  const handleRefetchAll = useCallback(() => {
    void mainGraphQuery.refetch();
    void otherGraphQuery.refetch();
    void goalsQuery.refetch();
  }, [mainGraphQuery.refetch, otherGraphQuery.refetch, goalsQuery.refetch]);

  return (
    <section className="mb-12">
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
            otherGraphQuery.isFetching
          }
          refetchMain={handleRefetchAll}
          isDemo={isDemo}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[minmax(459px,auto)] mt-4">
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
          <Card className="border border-neutral-200 dark:border-[#373737]">
            <CardHeader>Page</CardHeader>
            <Divider />
            <CommonChart data={pageData} />
          </Card>
        )}

        {otherGraphQuery.isFetching || !referrerData ? (
          <GraphLoader length={1} />
        ) : (
          <Card className="border border-neutral-200 dark:border-[#373737]">
            <CardHeader>Referrer</CardHeader>
            <Divider />
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
        {goalsQuery.isFetching || !goalsQuery.data ? (
          <GraphLoader className="md:col-span-2" length={1} />
        ) : (
          <CustomEvents
            goalsData={goalsQuery.data?.dataset}
            totalVisitors={totalVisitors}
          />
        )}
      </div>
    </section>
  );
}
