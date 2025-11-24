/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDateName } from "@/lib/utils/server";
import { Redis } from "@upstash/redis";
import { createClient } from "redis";
import { MODE } from "./appwrite/serverConfig";

let redisInstance: any = null;
let isUpstash = false;

async function initRedis() {
  if (redisInstance) return redisInstance;
  console.log({ MODE });

  if (MODE === "prod") {
    // 🟢 Upstash
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    console.log("✅ Using Upstash Redis (HTTP)");
    redisInstance = redis;
    isUpstash = true;
  } else {
    // 🟢 Local Redis
    const redis = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });
    redis.on("error", (err) => console.error("Redis Client Error:", err));
    if (!redis.isOpen) await redis.connect();
    console.log("✅ Using Local Redis (TCP)");
    redisInstance = redis;
    isUpstash = false;
  }

  return redisInstance;
}

export async function getRedis() {
  await initRedis();

  return {
    async get(key: string) {
      return await redisInstance.get(key);
    },

    async set(
      key: string,
      value: any,
      options?: { expiration?: { type: "EX" | "PX"; value: number } }
    ) {
      if (isUpstash) {
        if (options?.expiration) {
          return await redisInstance.set(key, JSON.stringify(value), {
            ex: options.expiration.value,
          });
        }
        return await redisInstance.set(key, JSON.stringify(value));
      } else {
        if (options?.expiration) {
          return await redisInstance.set(
            key,
            JSON.stringify(value),
            options.expiration.type,
            options.expiration.value
          );
        }
        return await redisInstance.set(key, JSON.stringify(value));
      }
    },

    async scan(cursor = "0", options?: { MATCH?: string; COUNT?: number }) {
      if (isUpstash) {
        // Upstash Redis (HTTP) doesn’t support native SCAN — emulate it using KEYS + filter
        const pattern = options?.MATCH?.replace("*", "") || "";
        const allKeys: string[] = await redisInstance.keys("*");

        const filteredKeys = options?.MATCH
          ? allKeys.filter((k) => k.includes(pattern))
          : allKeys;

        return {
          cursor: "0",
          keys: filteredKeys,
        };
      } else {
        // Node Redis supports SCAN natively
        const result = await redisInstance.scan(cursor, options || {});
        return {
          cursor: result.cursor || result[0],
          keys: result.keys || result[1],
        };
      }
    },
  };
}

interface TUpdateCacheData {
  websiteId: string;
  type: "visitors" | "revenues";
  revenue?: number;
  data?: {
    referrer?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    browser?: string;
    os?: string;
    device?: string;
    page?: string;
    goalLabel?: string;
  };
}

export async function updateCache(props: TUpdateCacheData) {
  try {
    const { websiteId, data, revenue } = props;

    if (!data) return;

    const { referrer, city, countryCode, region, browser, os, device, page } =
      data;
    const redis = await getRedis();
    const cacheKeyPatterns = [
      `${websiteId}:main:*`,
      `${websiteId}:others:*`,
      `${websiteId}:goals:*`,
    ];

    for (const patternKey of cacheKeyPatterns) {
      const { keys } = await redis.scan("0", { MATCH: patternKey });
      const key = keys[0];
      if (!key) continue;

      const cache = JSON.parse((await redis.get(key)) as string);
      if (!Array.isArray(cache?.dataset)) continue;

      if (key.includes(":main:")) {
        let name = "";
        const date = new Date();
        if (key.includes("days")) name = getDateName(date, "last_7_days");

        if (
          key.includes("yesterday") ||
          key.includes("today") ||
          key.includes("last_24_hours")
        ) {
          name = getDateName(date, "last_24_hours");
        }

        const datasetRecord = cache.dataset?.findIndex(
          (r: { name: string }) => r?.name === name
        ) as number;

        if (datasetRecord >= 0) {
          cache.dataset[datasetRecord].visitors++;
          if (revenue && revenue > 0) {
            cache.dataset[datasetRecord].revenue += revenue;
          }
        } else {
          cache.dataset.push({
            id: date.toISOString(),
            visitors: 1,
            name,
            revenue: 0,
            renewalRevenue: 0,
            refundedRevenue: 0,
            customers: 0,
            sales: 0,
            goalCount: 0,
            timestamp: date.toISOString(),
          });
        }
      }

      if (key.includes(":others:")) {
        const pageRecord = cache.dataset?.pageData?.findIndex(
          (p: { label: string }) => p?.label === page
        );

        if (pageRecord >= 0) {
          cache.dataset.pageData[pageRecord].visitors++;

          if (revenue && revenue > 0)
            cache.dataset.pageData[pageRecord].revenue += revenue;
        } else {
          cache.dataset.pageData.push({
            label: page,
            visitors: 1,
            revenue: 0,
            convertingVisitors: 1,
            conversionRate: 100,
          });
        }

        const hostname = referrer ? new URL(referrer).hostname : "Direct";
        const referrerRecord = cache.dataset?.referrerData?.findIndex(
          (r: { label: string }) => r?.label === hostname
        );

        if (referrerRecord >= 0) {
          cache.dataset.referrerData[referrerRecord].visitors++;

          if (revenue && revenue > 0)
            cache.dataset.referrerData[referrerRecord].revenue += revenue;
        } else {
          cache.dataset.referrerData.push({
            label: hostname,
            visitors: 1,
            revenue: 0,
            convertingVisitors: 1,
            conversionRate: 100,
            imageUrl: `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
          });
        }

        const imageUrl = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`;
        const countryRecord = cache.dataset?.countryData?.findIndex(
          (p: { countryCode: string }) => p?.countryCode === countryCode || "XX"
        );
        if (countryRecord >= 0) {
          cache.dataset.countryData[countryRecord].visitors++;

          if (revenue && revenue > 0)
            cache.dataset.countryData[countryRecord].revenue += revenue;
        } else {
          cache.dataset.countryData.push({
            label: countryCode,
            visitors: 1,
            revenue: 0,
            convertingVisitors: 1,
            conversionRate: 100,
            imageUrl,
          });
        }

        const regionRecord = cache.dataset?.regionData?.findIndex(
          (p: { label: string }) => p?.label === region
        );
        if (regionRecord >= 0) {
          cache.dataset.regionData[regionRecord].visitors++;

          if (revenue && revenue > 0)
            cache.dataset.regionData[regionRecord].revenue += revenue;
        } else {
          cache.dataset.regionData.push({
            label: region,
            visitors: 1,
            revenue: 0,
            convertingVisitors: 1,
            conversionRate: 100,
            imageUrl,
          });
        }

        const cityRecord = cache.dataset?.cityData?.findIndex(
          (p: { label: string }) => p?.label === city
        );
        if (cityRecord >= 0) {
          cache.dataset.cityData[cityRecord].visitors++;

          if (revenue && revenue > 0)
            cache.dataset.cityData[cityRecord].revenue += revenue;
        } else {
          cache.dataset.cityData.push({
            label: city,
            visitors: 1,
            revenue: 0,
            convertingVisitors: 1,
            conversionRate: 100,
            imageUrl,
          });
        }

        const browserRecord = cache.dataset?.browserData?.findIndex(
          (p: { label: string }) => p?.label === browser
        );
        if (browserRecord >= 0) {
          cache.dataset.browserData[browserRecord].visitors++;

          if (revenue && revenue > 0)
            cache.dataset.browserData[browserRecord].revenue += revenue;
        } else {
          cache.dataset.browserData.push({
            label: browser,
            visitors: 1,
            revenue: 0,
            convertingVisitors: 1,
            conversionRate: 100,
            imageUrl,
          });
        }

        const osRecord = cache.dataset?.osData?.findIndex(
          (p: { label: string }) => p?.label === os
        );
        if (osRecord >= 0) {
          cache.dataset.osData[osRecord].visitors++;

          if (revenue && revenue > 0)
            cache.dataset.osData[osRecord].revenue += revenue;
        } else {
          cache.dataset.osData.push({
            label: os,
            visitors: 1,
            revenue: 0,
            convertingVisitors: 1,
            conversionRate: 100,
            imageUrl,
          });
        }

        const deviceRecord = cache.dataset?.deviceData?.findIndex(
          (p: { label: string }) => p?.label === device
        );
        if (deviceRecord >= 0) {
          cache.dataset.deviceData[deviceRecord].visitors++;

          if (revenue && revenue > 0)
            cache.dataset.deviceData[deviceRecord].revenue += revenue;
        } else {
          cache.dataset.deviceData.push({
            label: device,
            visitors: 1,
            revenue: 0,
            convertingVisitors: 1,
            conversionRate: 100,
            imageUrl,
          });
        }
      }

      if (key.includes(":goals:")) {
        const goalIndex = cache.dataset?.findIndex(
          (g: { label: string }) => g.label === data.goalLabel
        );

        if (goalIndex >= 0) {
          cache.dataset[goalIndex].visitors++;
        }
      }
      await redis.set(key, JSON.stringify(cache));
    }
  } catch (error) {
    console.log("Failed to update cache", error, {
      props: JSON.stringify(props),
    });
  }
}
