import { database, databaseId } from '@/configs/appwrite/serverConfig'
import { addWebsiteSchema } from '@/lib/zodSchemas'
import { createFileRoute } from '@tanstack/react-router'
import { AppwriteException, ID, Permission, Query, Role } from 'node-appwrite'
import z from 'zod'
const getWebsiteSchema = z.object({
  userId: z.string().min(1),
  events: z.boolean(),
})
export const Route = createFileRoute('/api/website/')({
  validateSearch: getWebsiteSchema,
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const searchParams = new URL(request.url).searchParams
          const userId = searchParams.get('userId')
          const isEvents = searchParams.get('events')

          if (!userId) throw new Error('Invalid userId')

          const websiteRes = await database.listRows({
            databaseId: databaseId,
            tableId: 'websites',
            queries: [Query.equal('userId', userId)],
          })
          let websites = websiteRes.rows

          if (isEvents) {
            websites = await Promise.all(
              websiteRes.rows.map(async (w) => {
                const eventsRes = await database.listRows({
                  databaseId: databaseId,
                  tableId: 'events',
                  queries: [
                    Query.equal('website', w.$id),
                    Query.greaterThanEqual(
                      '$createdAt',
                      new Date(
                        new Date().getTime() - 24 * 60 * 60 * 1000,
                      ).toISOString(),
                    ),
                    Query.limit(1000000),
                  ],
                })

                return { ...w, events: eventsRes.rows }
              }),
            )
          }

          return new Response(JSON.stringify({ ok: true, websites }))
        } catch (error) {
          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
          )
        }
      },
      POST: async ({ request }) => {
        try {
          const formdata = await addWebsiteSchema
            .extend({
              userId: z.string().min(1, 'userId is required'),
            })
            .parseAsync(await request.json())

          const website = await database.listRows({
            databaseId,
            tableId: 'websites',
            queries: [Query.equal('domain', formdata.domain)],
          })
          if (website.rows?.[0]?.$id)
            throw new Error('Domain name already exists')

          console.log(JSON.stringify({ formdata }))

          const res = await database.createRow({
            databaseId,
            rowId: ID.unique(),
            tableId: 'websites',
            data: formdata,
            permissions: [
              Permission.read(Role.user(formdata.userId)),
              Permission.write(Role.user(formdata.userId)),
              Permission.update(Role.user(formdata.userId)),
              Permission.delete(Role.user(formdata.userId)),
            ],
          })
          return new Response(JSON.stringify({ ok: true, data: res }))
        } catch (error) {
          if (error instanceof AppwriteException) {
            console.log('appwrite err', JSON.stringify(error))
          }
          return new Response(
            JSON.stringify({ ok: false, error: (error as Error).message }),
          )
        }
      },
    },
  },
})
