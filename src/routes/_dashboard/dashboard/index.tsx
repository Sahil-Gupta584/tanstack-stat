import { Favicon } from '@/components/favicon'
import { useUser } from '@/hooks/useUser'
import type { TBucket } from '@/lib/types'
import { Button, Card, Skeleton } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import axios from 'axios'
import { useEffect } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

export const Route = createFileRoute('/_dashboard/dashboard/')({
  component: Dashboard,
  head: () => ({ meta: [{ title: 'Home | Dashboard' }] }),
})

function Dashboard() {
  const user = useUser()
  const getWebsitesQuery = useQuery({
    queryKey: ['getWebsites'],
    queryFn: async () => {
      if (!user?.$id) return null
      const res = await axios('/api/website', {
        params: { userId: user.$id, events: true },
      })

      return res.data?.websites
    },
    enabled: false,
  })

  useEffect(() => {
    getWebsitesQuery.refetch()
  }, [user?.$id])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getEventsByDay(events: any) {
    // Example: group by weekday
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const counts: TBucket = {}

    if (Array.isArray(events)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      events.forEach((e: any) => {
        const date = new Date(e.$createdAt)
        const day = days[date.getDay()]

        counts[day] = (counts[day] || 0) + 1
      })
    }

    return days.map((d) => ({
      day: d,
      value: counts[d] || 0,
    }))
  }

  return (
    <div className="min-h-screen w-full    p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <Link to="/dashboard/new" className="self-end">
          <Button
            href="/dashboard/new"
            startContent={<FaPlus />}
            color="primary"
            variant="shadow"
            className="hover:scale-105"
          >
            Add Website
          </Button>
        </Link>

        {/* Website cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getWebsitesQuery.isFetching && <Loader />}

          {Array.isArray(getWebsitesQuery.data) &&
            !getWebsitesQuery.isFetching &&
            getWebsitesQuery.data?.map((website) => (
              <Card
                as={Link}
                key={website.$id}
                href={`/dashboard/${website.$id}`}
                className="gap-2 flex-row p-3 border-medium border-default-200 dark:hover:border-white/40 hover:shadow-lg transition duration-500"
              >
                <div className="self-start mt-[3px]">
                  <Favicon domain={website.domain} />
                </div>

                <div className="grow">
                  <h3 className=" font-semibold">{website.domain}</h3>
                  {/* Mini chart */}
                  <div className="relative h-20">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      style={{ pointerEvents: 'none' }}
                    >
                      <LineChart
                        data={getEventsByDay(website.events)}
                        className="scale-[1.03] !cursor-pointer"
                      >
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#ec4899"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Stats */}
                  <p className="flex items-center gap-2 text-sm ">
                    <span className="font-bold  ">
                      {Array.isArray(website.events)
                        ? website.events.length
                        : 0}
                    </span>
                    <span className="text-default-500">
                      visitors in last 24h
                    </span>
                  </p>
                </div>
              </Card>
            ))}

          {Array.isArray(getWebsitesQuery.data) &&
            getWebsitesQuery.data.length === 0 && (
              <p className="col-span-full text-center text-neutral-400">
                No websites added yet. Click{' '}
                <Link
                  to="/dashboard/new"
                  className="text-primary hover:underline"
                >
                  Add Website
                </Link>{' '}
                to get started 🚀
              </p>
            )}
        </div>
      </div>
    </div>
  )
}

function Loader() {
  return Array.from({ length: 3 }).map((_, i) => (
    <Card key={i} className="p-3">
      <div className="flex items-center gap-3 mb-1">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-5 w-32 rounded" />
      </div>
      <Skeleton className="h-20 w-full rounded-lg mb-2" />
      <Skeleton className="h-4 w-28 rounded" />
    </Card>
  ))
}
