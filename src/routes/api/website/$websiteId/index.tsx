import { account, client } from '@/configs/appwrite/serverConfig'
import { addWebsiteSchema } from '@/lib/zodSchemas'
import { createFileRoute } from '@tanstack/react-router'
import { Account, AppwriteException } from 'node-appwrite'

export const Route = createFileRoute('/api/website/$websiteId/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formdata = await addWebsiteSchema.parseAsync(
            await request.json(),
          )
          const session = await account.getSession({
            sessionId:
              'a_session_68d11fc50036ddd8b1d1=eyJpZCI6IjY4ZDEyNDk5MTQzYmE1N2RjMGY4Iiwic2VjcmV0IjoiNTlhNGNkYTc1ZTJhM2RhZDc1OWQxY2M3MTZlMjQ5MGVjN2Q0ODViMmYzYmMwODA0ZmQ1Mzg4NTczY2JhNjcxNmI0ODdjNGY3YjRiMTkwYzE1OGE4MjliZGVjYTA4ZDRjNDIxZjhjZGE3NDY1NDM0Yjc2NWM5OGU1YmFjNWU5N2FhNmFhOTBmYjAwYjhlOGIxOTdiMGFhNTkwOTVjYTdmMWI0MzQwYTU3ZTY0OThhOGU3NDIzZjhiNzliODBiNDEzOTM4M2MxMGQ2YjA3ZTgwNTRhNDUzYmRiOWY4NzU2NTc2ZDZmM2ZiNTk5YTRjNjRlZmE0YmRkMzhmMWRkNjZhYiJ9',
          })
          if (!session.$id)
            return new Response(JSON.stringify({ error: 'Unauthenticated' }), {
              status: 401,
            })
          client.setSession(session.$id)

          const user = await new Account(client).get()

          //   const res = await db.createRow({
          //             databaseId,
          //             rowId: ID.unique(),
          //             tableId: 'websites',
          //             data: {
          //               domain: formdata.domain,
          //               timezone: formdata.timezone,
          //               userId: user.$id,
          //             },
          //             permissions: [Permission.create(Role.user(user.$id))],
          //           })
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
