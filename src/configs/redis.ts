import { getDateName } from '@/lib/utils/server'
import { createClient } from 'redis'

export async function getRedis() {
  // return null
  try {
    const redis = await createClient({ url: process.env.REDIS_URL }).connect()
    return redis
  } catch (error) {
    console.log('Failed to create redis Client', error)
  }
}

interface TUpdateCacheData {
  websiteId: string
  type: 'visitors' | 'revenues'
  revenue?: number
  data: {
    referrer: string
    countryCode: string
    region: string
    city: string
    browser: string
    os: string
    device: string
    page: string
  }
}
export async function updateCache(props: TUpdateCacheData) {
  try {
    const { websiteId, data, revenue } = props
    const { referrer, city, countryCode, region, browser, os, device, page } =
      data
    const redis = await createClient().connect()
    const cacheKeyPatterns = [
      `${websiteId}:main:*`,
      `${websiteId}:others:*`,
      `${websiteId}:goals*`,
    ]

    for (const patternKey of cacheKeyPatterns) {
      let { keys } = await redis.scan('0', { MATCH: patternKey })

      for (const key of keys) {
        let cache = JSON.parse((await redis.get(key)) as string)
        let name = ''

        if (key.includes(':main:')) {
          if (!Array.isArray(cache?.dataset)) return
          // console.log('exis', JSON.stringify(cache.dataset))

          const date = new Date()
          if (key.includes('days')) name = getDateName(date, 'last_7_days')

          if (
            key.includes('yesterday') ||
            key.includes('today') ||
            key.includes('last_24_hours')
          ) {
            name = getDateName(date, 'last_24_hours')
          }

          const datasetRecord = cache.dataset?.findIndex(
            (r: { name: string }) => r?.name === name,
          ) as number

          if (datasetRecord >= 0) {
            cache.dataset[datasetRecord].visitors++
            if (revenue && revenue > 0) {
              cache.dataset[datasetRecord].revenue += revenue
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
            })
          }
        }

        if (key.includes(':others:')) {
          if (!cache?.dataset) return

          const pageRecord = cache.dataset?.pageData?.findIndex(
            (p: { label: any }) => p?.label === page,
          )

          if (pageRecord >= 0) {
            cache.dataset.pageData[pageRecord].visitors++

            if (revenue && revenue > 0)
              cache.dataset.pageData[pageRecord].revenue += revenue
          } else {
            cache.dataset.pageData.push({
              label: page,
              visitors: 1,
              revenue: 0,
              convertingVisitors: 1,
              conversionRate: 100,
            })
          }

          const hostname = referrer ? new URL(referrer).hostname : 'Direct'
          const referrerRecord = cache.dataset?.referrerData?.findIndex(
            (r: { label: any }) => r?.label === hostname,
          )

          if (referrerRecord >= 0) {
            cache.dataset.referrerData[referrerRecord].visitors++

            if (revenue && revenue > 0)
              cache.dataset.referrerData[referrerRecord].revenue += revenue
          } else {
            cache.dataset.referrerData.push({
              label: hostname,
              visitors: 1,
              revenue: 0,
              convertingVisitors: 1,
              conversionRate: 100,
              imageUrl: `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
            })
          }

          const imageUrl = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`
          const countryRecord = cache.dataset?.countryData?.findIndex(
            (p: { countryCode: any }) => p?.countryCode === countryCode || 'XX',
          )
          if (countryRecord >= 0) {
            cache.dataset.countryData[countryRecord].visitors++

            if (revenue && revenue > 0)
              cache.dataset.countryData[countryRecord].revenue += revenue
          } else {
            cache.dataset.countryData.push({
              label: countryCode,
              visitors: 1,
              revenue: 0,
              convertingVisitors: 1,
              conversionRate: 100,
              imageUrl,
            })
          }

          const regionRecord = cache.dataset?.regionData?.findIndex(
            (p: { label: any }) => p?.label === region,
          )
          if (regionRecord >= 0) {
            cache.dataset.regionData[regionRecord].visitors++

            if (revenue && revenue > 0)
              cache.dataset.regionData[regionRecord].revenue += revenue
          } else {
            cache.dataset.regionData.push({
              label: region,
              visitors: 1,
              revenue: 0,
              convertingVisitors: 1,
              conversionRate: 100,
              imageUrl,
            })
          }

          const cityRecord = cache.dataset?.cityData?.findIndex(
            (p: { label: any }) => p?.label === city,
          )
          if (cityRecord >= 0) {
            cache.dataset.cityData[cityRecord].visitors++

            if (revenue && revenue > 0)
              cache.dataset.cityData[cityRecord].revenue += revenue
          } else {
            cache.dataset.cityData.push({
              label: city,
              visitors: 1,
              revenue: 0,
              convertingVisitors: 1,
              conversionRate: 100,
              imageUrl,
            })
          }

          const browserRecord = cache.dataset?.browserData?.findIndex(
            (p: { label: string }) => p?.label === browser,
          )
          if (browserRecord >= 0) {
            cache.dataset.browserData[browserRecord].visitors++

            if (revenue && revenue > 0)
              cache.dataset.browserData[browserRecord].revenue += revenue
          } else {
            cache.dataset.browserData.push({
              label: browser,
              visitors: 1,
              revenue: 0,
              convertingVisitors: 1,
              conversionRate: 100,
              imageUrl,
            })
          }

          const osRecord = cache.dataset?.osData?.findIndex(
            (p: { label: string }) => p?.label === os,
          )
          if (osRecord >= 0) {
            cache.dataset.osData[osRecord].visitors++

            if (revenue && revenue > 0)
              cache.dataset.osData[osRecord].revenue += revenue
          } else {
            cache.dataset.osData.push({
              label: os,
              visitors: 1,
              revenue: 0,
              convertingVisitors: 1,
              conversionRate: 100,
              imageUrl,
            })
          }

          const deviceRecord = cache.dataset?.deviceData?.findIndex(
            (p: { label: string }) => p?.label === device,
          )
          if (deviceRecord >= 0) {
            cache.dataset.deviceData[deviceRecord].visitors++

            if (revenue && revenue > 0)
              cache.dataset.deviceData[deviceRecord].revenue += revenue
          } else {
            cache.dataset.deviceData.push({
              label: device,
              visitors: 1,
              revenue: 0,
              convertingVisitors: 1,
              conversionRate: 100,
              imageUrl,
            })
          }
        }

        await redis.set(key, JSON.stringify(cache))
      }
    }
  } catch (error) {
    console.log('Failed to update cache', error, {
      props: JSON.stringify(props),
    })
  }
}
