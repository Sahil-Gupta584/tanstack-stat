import { GraphLoader, MainGraphLoader } from '@/components/loaders'
import { account } from '@/configs/appwrite/clientConfig'
import type { TWebsite } from '@/lib/types'
import { Card, CardHeader, Divider } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { useCallback, useMemo, useState } from 'react'
import { CommonChart } from './-components/charts/commonChart'
import LocationCharts from './-components/charts/locationCharts'
import MainGraph from './-components/charts/mainGraph'
import SystemCharts from './-components/charts/systemCharts'
import CustomEvents from './-components/customEvents'
import Filters from './-components/filters'
import WaitForFirstEvent from './-components/WaitForFirstEvent'

export const Route = createFileRoute('/_dashboard/dashboard/$websiteId/')({
  component: Dashboard,
  loader: async ({ params }) => {
    try {
      const user = await account.get()
      const res = await axios('/api/website', {
        params: { userId: user.$id },
      })
      const websites = res.data?.websites as TWebsite[]
      const currentWebsite = websites?.find((w) => w.$id === params.websiteId)
      return { currentWebsite }
    } catch {
      return { currentWebsite: null }
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.currentWebsite?.domain
          ? `${loaderData.currentWebsite.domain} - Dashboard`
          : 'Dashboard',
      },
      {
        name: 'description',
        content: loaderData?.currentWebsite?.domain
          ? `Analytics dashboard for ${loaderData.currentWebsite.domain}`
          : 'Analytics dashboard for your website',
      },
    ],
  }),
})

function Dashboard() {
  const { websiteId } = Route.useParams()
  const [duration, setDuration] = useState('last_7_days')

  const mainGraphQuery = useQuery({
    queryKey: ['mainGraph', websiteId, duration],
    queryFn: async () => {
      return (
        await axios('/api/analytics/main', { params: { duration, websiteId } })
      ).data
    },
    enabled: !!websiteId,
  })

  const otherGraphQuery = useQuery({
    queryKey: ['otherGraphs', websiteId, duration],
    queryFn: async () => {
      return (
        await axios('/api/analytics/others', {
          params: { duration, websiteId },
        })
      ).data
    },
    enabled: !!websiteId && !!mainGraphQuery.data,
  })

  const {
    pageData,
    referrerData,
    countryData,
    regionData,
    cityData,
    browserData,
    deviceData,
    osData,
  } = otherGraphQuery.data?.dataset || {}

  const { currentWebsite: loaderWebsite } = Route.useLoaderData()

  const getWebsitesQuery = useQuery({
    queryKey: ['getWebsites'],
    queryFn: async () => {
      const user = await account.get()
      const res = await axios('/api/website', {
        params: { userId: user.$id },
      })

      return res.data?.websites as TWebsite[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: loaderWebsite ? [loaderWebsite] : undefined,
  })

  const currentWebsite = useMemo(() => {
    return getWebsitesQuery.data
      ? getWebsitesQuery.data.find((w) => w?.$id === websiteId)
      : loaderWebsite
  }, [getWebsitesQuery.data, websiteId, loaderWebsite])

  const chartData = useMemo(
    () => mainGraphQuery.data?.dataset,
    [mainGraphQuery.data?.dataset],
  )

  const totalVisitors = useMemo(() => {
    if (!chartData) return 0

    return (
      Number(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chartData.reduce((prev: any, cur: any) => prev + cur.visitors, 0),
      ) || 0
    )
  }, [chartData])

  const goalsQuery = useQuery({
    queryKey: ['goals', websiteId, duration],
    queryFn: async () => {
      return (
        await axios('/api/analytics/goals', {
          params: { duration, websiteId },
        })
      ).data
    },
    enabled: !!websiteId && !!mainGraphQuery.data,
  })

  const handleRefetchAll = useCallback(() => {
    void mainGraphQuery.refetch()
    void otherGraphQuery.refetch()
    void goalsQuery.refetch()
  }, [mainGraphQuery.refetch, otherGraphQuery.refetch, goalsQuery.refetch])

  return (
    <section className="mb-12">
      {mainGraphQuery.data && mainGraphQuery.data?.isEmpty && (
        <WaitForFirstEvent
          websiteId={websiteId}
          currentWebsite={currentWebsite}
        />
      )}
      {getWebsitesQuery.data && (
        <Filters
          duration={duration}
          setDuration={setDuration}
          websiteId={websiteId}
          data={getWebsitesQuery.data}
          isLoading={
            getWebsitesQuery.isFetching ||
            mainGraphQuery.isFetching ||
            otherGraphQuery.isFetching
          }
          refetchMain={handleRefetchAll}
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
            $id={websiteId}
            domain={''}
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
  )
}
