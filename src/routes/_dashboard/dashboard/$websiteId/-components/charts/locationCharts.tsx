import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
//@ts-expect-error dont install types for this package
import "react-tooltip/dist/react-tooltip.css";

import { useTheme } from "next-themes";

import CommonTooltip from "../commonTooltip";

import { getCountryName } from "@/lib/utils/client";
import { CommonChart, type CommonChartProps } from "./commonChart";

const geoUrl =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface LocationChartProps {
  countryData: (CommonChartProps["data"][0] & { countryCode: string })[];
  regionData: CommonChartProps["data"];
  cityData: CommonChartProps["data"];
}

export const classNames = {
  tabList: "bg-transparent p-3",
  tabContent:
    "group-data-[selected=true]:text-ink dark:group-data-[selected=true]:text-white group-data-[selected=true]:font-bold",
  // cursor: "bg-transparent",
  panel: "p-0 h-full overflow-x-hidden",
  base: "border-b-[1px] rounded-none w-full border-b-gray-200 dark:border-b-gray-800",
};

export default function LocationCharts({
  cityData,
  countryData,
  regionData,
}: LocationChartProps) {
  const { resolvedTheme } = useTheme();

  // 🎨 Define theme-based colors
  const colors = {
    dark: {
      base: "#1d1d21",
      stroke: "#4A5568",
      hoverStroke: "#FF003C",
      high: "#FF003C",
      medium: "#FF003Cb3",
      low: "#FF003C38",
    },
    light: {
      base: "#e5e7eb", // light gray
      stroke: "#d1d5db", // lighter border
      hoverStroke: "#FF003C", // cipher-red
      high: "#FF003C",
      medium: "#FF003Cb3",
      low: "#FF003C38",
    },
  };

  const themeColors = resolvedTheme === "light" ? colors.light : colors.dark;

  const getCountryDetails = (countryCode: string) => {
    const country = countryData.find((c) => c.countryCode == countryCode);
    let color = themeColors.base;

    if (country) {
      const maxVisitors = Math.max(...countryData.map((c) => c.visitors));
      const intensity = country.visitors / maxVisitors;

      if (intensity > 0.7) color = themeColors.high;
      else if (intensity > 0.4) color = themeColors.medium;
      else if (intensity > 0.1) color = themeColors.low;
    }

    return {
      color,
      ...country,
    };
  };

  return (
    <Card className="bg-gray-50 dark:bg-[#23272f] border-2 border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30">
      <CardBody className="h-80 overflow-hidden p-0 bg-gray-50 dark:bg-[#23272f]">
        <Tabs aria-label="Options" classNames={classNames}>
          <Tab key="map" title={<span>Map</span>}>
            <ComposableMap
              projection="geoMercator"
              width={800}
              height={400}
              style={{
                width: "100%",
                height: "100%",
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
                        stroke={themeColors.stroke}
                        strokeWidth={0.5}
                        style={{
                          default: {
                            fill: countryDetails.color,
                            stroke: themeColors.stroke,
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            stroke: themeColors.hoverStroke,
                            strokeWidth: 1,
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: themeColors.hoverStroke,
                            stroke: themeColors.hoverStroke,
                            strokeWidth: 1,
                            outline: "none",
                          },
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

            <Tooltip
              id="map-tooltip"
              place="bottom-end"
              style={{
                padding: 0,
                background: "transparent",
              }}
              render={({ content }) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let parsed: any;
                try {
                  parsed = JSON.parse(content as string);
                } catch {
                  return null;
                }

                return (
                  <CommonTooltip
                    data={parsed}
                    label={getCountryName(parsed?.countryCode)}
                  />
                );
              }}
            />
          </Tab>

          <Tab key="country" title="Country">
            <CommonChart data={countryData} />
          </Tab>
          <Tab key="Region" title="Region">
            <CommonChart data={regionData} />
          </Tab>
          <Tab key="City" title="City">
            <CommonChart data={cityData} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
