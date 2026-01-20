import { GraphLoader, MainGraphLoader } from "@/components/loaders";
import { CommonChart } from "@/routes/_dashboard/dashboard/$websiteId/-components/charts/commonChart";
import EmbedLocationChart from "@/routes/_dashboard/dashboard/$websiteId/-components/charts/embedLocationChart";
import MainGraph from "@/routes/_dashboard/dashboard/$websiteId/-components/charts/mainGraph";
import SystemCharts from "@/routes/_dashboard/dashboard/$websiteId/-components/charts/systemCharts";
import { Card, CardHeader, Divider } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from '@tanstack/react-router';
import axios from "axios";
import { useMemo } from "react";
import z from "zod";

export const Route = createFileRoute("/share/$websiteId/$chartType")({
    component: StandaloneChart,
    validateSearch: z.object({
        duration: z.string().optional().default("last_7_days"),
        primaryColor: z.string().optional().default("#FF003C"),
        bgColor: z.string().optional().default("#0d0d0f"),
        showLive: z.preprocess(
            (val) => String(val).replace(/["']/g, ""),
            z.string().optional().default("false")
        ),
        layout: z.enum(["horizontal", "vertical"]).optional().default("horizontal"),
    }),
});

function StandaloneChart() {
    const { websiteId, chartType } = Route.useParams();
    const { duration, primaryColor, bgColor, showLive, layout } = Route.useSearch();

    const isLiveEnabled = showLive === "true";
    // ... (rest of queries remain same)

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
        enabled: !!websiteId && (chartType !== "main"),
    });

    const {
        pageData,
        referrerData,
        countryData,
        browserData,
        deviceData,
        osData,
    } = otherGraphQuery.data?.dataset || {};

    const chartData = useMemo(
        () => mainGraphQuery.data?.dataset,
        [mainGraphQuery.data?.dataset]
    );

    const totalVisitors = useMemo(() => {
        if (!chartData) return 0;
        return (
            Number(
                chartData.reduce((prev: number, cur: { visitors: number }) => prev + cur.visitors, 0)
            ) || 0
        );
    }, [chartData]);

    const renderChart = () => {
        if (mainGraphQuery.isLoading || (chartType !== "main" && otherGraphQuery.isLoading)) {
            return chartType === "main" ? <MainGraphLoader /> : <GraphLoader length={1} />;
        }

        if (!mainGraphQuery.data) return <div>Data not found</div>;

        switch (chartType) {
            case "main":
                return (
                    <MainGraph
                        totalVisitors={totalVisitors}
                        chartData={chartData!}
                        duration={duration}
                        avgSessionTime={mainGraphQuery.data.avgSessionTime}
                        bounceRate={mainGraphQuery.data.bounceRate}
                        $id={websiteId as string}
                        domain=""
                        conversionRate={otherGraphQuery.data?.overallConversionRate}
                    />
                );
            case "page":
                return (
                    <Card className="bg-gray-50 dark:bg-[#23272f] border-2 border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 w-full h-full">
                        <CardHeader className="font-bold text-ink dark:text-white pb-3 bg-white dark:bg-[#1a1a1d] rounded-t-2xl px-6 pt-6">Page</CardHeader>
                        <Divider className="bg-gray-300 dark:bg-gray-600" />
                        <div className="bg-gray-50 dark:bg-[#23272f] rounded-b-2xl h-full overflow-auto">
                            <CommonChart data={pageData} />
                        </div>
                    </Card>
                );
            case "referrer":
                return (
                    <Card className="bg-gray-50 dark:bg-[#23272f] border-2 border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 w-full h-full">
                        <CardHeader className="font-bold text-ink dark:text-white pb-3 bg-white dark:bg-[#1a1a1d] rounded-t-2xl px-6 pt-6">Referrer</CardHeader>
                        <Divider className="bg-gray-300 dark:bg-gray-600" />
                        <div className="bg-gray-50 dark:bg-[#23272f] rounded-b-2xl h-full overflow-auto">
                            <CommonChart data={referrerData} />
                        </div>
                    </Card>
                );
            case "location":
                return (
                    <div className="w-full h-full">
                        <EmbedLocationChart
                            countryData={countryData}
                            primaryColor={primaryColor}
                            bgColor={bgColor}
                            showLive={isLiveEnabled}
                            websiteId={websiteId as string}
                            layout={layout as "horizontal" | "vertical"}
                        />
                    </div>
                );
            case "system":
                return (
                    <div className="w-full h-full">
                        <SystemCharts
                            browserData={browserData}
                            deviceData={deviceData}
                            osData={osData}
                        />
                    </div>
                );
            default:
                return <div>Invalid chart type</div>;
        }
    };

    return (
        <div
            className="w-full h-screen overflow-hidden"
            style={{ backgroundColor: bgColor }}
        >
            {renderChart()}
        </div>
    );
}
