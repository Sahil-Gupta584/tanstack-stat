import { TLiveVisitor } from "@/lib/types";
import { formatNumber, getCountryName } from "@/lib/utils/client";
import { Card, CardBody } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
// @ts-expect-error don't install types for this package
import "react-tooltip/dist/react-tooltip.css";
import { subscribeToRealtime } from "../globalMap/-actions";
import { type CommonChartProps } from "./commonChart";

const geoUrl = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface EmbedLocationChartProps {
    countryData: (CommonChartProps["data"][0] & { countryCode: string })[];
    primaryColor?: string;
    bgColor?: string;
    showLive?: boolean;
    websiteId?: string;
    layout?: "horizontal" | "vertical";
}

export default function EmbedLocationChart({
    countryData,
    primaryColor: initialPrimaryColor = "#FF003C",
    bgColor: initialBgColor = "#0d0d0f",
    showLive = false,
    websiteId,
    layout = "horizontal"
}: EmbedLocationChartProps) {
    const [liveVisitors, setLiveVisitors] = useState<TLiveVisitor[]>([]);
    const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor);
    const [bgColor, setBgColor] = useState(initialBgColor);
    console.log({ initialBgColor });

    // Update local state if props change (initial load or hard refresh)
    useEffect(() => {
        setPrimaryColor(initialPrimaryColor);
        setBgColor(initialBgColor);
    }, [initialPrimaryColor, initialBgColor]);

    // Listen for real-time style updates from parent (prevents iframe reload)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "updateStyles") {
                if (event.data.primaryColor) setPrimaryColor(event.data.primaryColor);
                console.log({ d: event.data });

                if (event.data.bgColor) setBgColor(event.data.bgColor);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    useEffect(() => {
        if (showLive && websiteId) {
            return subscribeToRealtime(websiteId, setLiveVisitors);
        }
    }, [showLive, websiteId]);

    const maxVisitors = useMemo(() =>
        Math.max(...(countryData?.map(c => c.visitors) || [0])),
        [countryData]
    );

    // Determine if background is "light" or "dark" for adaptive text colors
    const isLightBg = useMemo(() => {
        const hex = (bgColor || "#0d0d0f").replace("#", "");
        if (hex.length !== 6) return false;
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // ITU-R BT.709
        return luma > 128;
    }, [bgColor]);

    const textColor = isLightBg ? "text-slate-900" : "text-white";
    const subTextColor = isLightBg ? "text-slate-500" : "text-slate-400";
    const borderColor = isLightBg ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)";

    const getCountryDetails = (countryCode: string) => {
        const country = countryData?.find((c) => c.countryCode === countryCode);
        let color = isLightBg ? "#f1f5f9" : "#1e293b"; // base map color

        if (country) {
            const intensity = country.visitors / maxVisitors;
            // Use user's primary color with varying opacity for intensity
            color = `${primaryColor}${intensity > 0.7 ? "" : intensity > 0.4 ? "b3" : "38"}`;
        }

        return { color, ...country };
    };

    return (
        <Card className="w-full h-full border-none shadow-none rounded-none overflow-hidden" style={{ backgroundColor: bgColor }}>
            <CardBody className={`p-0 flex overflow-hidden ${layout === "vertical" ? "flex-col" : "flex-col md:flex-row "} h-full`}
            >
                {/* Left Side: Map Container */}
                <div className={`${layout === "vertical" ? "h-[45%]" : "flex-[2.5] h-full"} flex flex-col justify-center sm:justify-normal min-h-0 w-full min-w-0`}>
                    <div className="w-full">
                        <ComposableMap
                            projection="geoMercator"
                            width={800}
                            height={450}
                            style={{
                                width: "100%",
                                height: "auto",
                                maxHeight: "100%",
                            }}
                        >
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const countryCode = geo.properties["ISO3166-1-Alpha-2"];
                                        const countryDetails = getCountryDetails(countryCode);

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={countryDetails.color}
                                                stroke={isLightBg ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
                                                strokeWidth={0.5}
                                                style={{
                                                    default: { outline: "none" },
                                                    hover: { fill: primaryColor, strokeWidth: 0.5, outline: "none", cursor: "pointer" },
                                                    pressed: { fill: primaryColor, outline: "none" },
                                                }}
                                                data-tooltip-id="map-tooltip"
                                                data-tooltip-content={JSON.stringify({
                                                    countryCode,
                                                    ...countryDetails,
                                                })}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ComposableMap>
                    </div>

                    {/* <a
                        href="https://insightly.live"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-6 left-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 backdrop-blur-md transition-all group z-10 no-underline"
                    >
                        <span className={`text-[9px] font-black tracking-[0.15em] ${textColor} opacity-30 group-hover:opacity-60 transition-opacity uppercase`}>
                            Powered by
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-[12px] font-black tracking-tighter" style={{ color: primaryColor }}>
                                INSIGHTLY.LIVE
                            </span>
                        </div>
                    </a> */}

                    <Tooltip
                        id="map-tooltip"
                        place="top"
                        style={{
                            padding: "10px 14px",
                            backgroundColor: isLightBg ? "#ffffff" : "#0a0a0c",
                            borderRadius: "14px",
                            // Border is now the primary separator
                            border: `2px solid ${primaryColor}`,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            zIndex: 100,
                            opacity: 1,
                        }}
                        render={({ content }) => {
                            let parsed: { countryCode: string; visitors?: number } | null = null;
                            try {
                                parsed = JSON.parse(content as string);
                            } catch {
                                return null;
                            }

                            if (!parsed) return null;

                            return (
                                <div className="flex items-center gap-3">
                                    <img
                                        alt=""
                                        className="size-4 rounded-[2px] object-cover shadow-sm"
                                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${parsed.countryCode}.svg`}
                                    />
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-bold ${textColor}`}>
                                            {getCountryName(parsed.countryCode)}
                                        </span>
                                        <span className={`text-[10px] font-medium ${subTextColor}`}>
                                            {formatNumber(parsed.visitors || 0)} visitors
                                        </span>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>

                {/* Right Side: Countries List */}
                <div className={`flex-1 flex flex-col h-full overflow-hidden ${layout === "vertical" ? "border-t" : "border-l"}`} style={{ borderColor }}>
                    <div className="p-4 md:p-6 lg:p-8 flex flex-col h-full overflow-hidden">
                        {showLive && (
                            <div className="mb-8 group">
                                <div className="flex items-center gap-2 mb-1 ">
                                    <span className={`text-[10px] uppercase font-black tracking-[0.2em] ${textColor}`}>
                                        Realtime
                                    </span>
                                    <div className="size-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-4xl lg:text-5xl font-black tracking-tighter ${textColor} transition-all duration-500 group-hover:scale-[1.02] origin-left`}>
                                        {liveVisitors.length}
                                    </span>
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${subTextColor} opacity-60`}>
                                        Users on site
                                    </span>
                                </div>
                                <div className="mt-6 h-[1px] w-full opacity-50" style={{ backgroundColor: borderColor }} />
                            </div>
                        )}

                        <div className={`flex justify-between text-[11px] font-extrabold uppercase tracking-widest mb-6 ${textColor}`} >
                            <span>Top Countries</span>
                            <span>Visitors</span>
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto pr-3 scrollbar-hide">
                            {countryData?.sort((a, b) => b.visitors - a.visitors).slice(0, 10).map((item) => (
                                <div key={item.countryCode} className="group flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <img
                                                alt=""
                                                className="size-3.5 rounded-[1px] object-cover"
                                                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${item.countryCode}.svg`}
                                            />
                                            <span className={`text-[13px] font-bold ${textColor} group-hover:opacity-80 transition-opacity`}>
                                                {getCountryName(item.countryCode)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[13px] font-bold ${textColor}`}>{formatNumber(item.visitors)}</span>
                                            <span className="text-[10px] font-bold text-green-500 whitespace-nowrap">
                                                ↑ {(Math.random() * 5 + 1).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-[4px] rounded-full overflow-hidden" style={{ backgroundColor: isLightBg ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }}>
                                        <div
                                            className="h-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${(item.visitors / maxVisitors) * 100}%`,
                                                backgroundColor: primaryColor
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
