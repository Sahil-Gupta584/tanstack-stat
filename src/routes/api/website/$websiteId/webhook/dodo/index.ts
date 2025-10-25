import {
  createRevenueAndUpdateCache,
  isFirstRenewalDodo,
} from '@/routes/api/-actions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/website/$websiteId/webhook/dodo/')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        try {
          const body = await request.json()
          const { websiteId } = params

          if (!websiteId) {
            return new Response(
              JSON.stringify({ error: 'websiteId is required' }),
              { status: 400 },
            )
          }
          const eventType = body?.type
          const data = body?.data
          const visitorId = data?.metadata?.insightly_visitor_id
          const sessionId = data?.metadata?.insightly_session_id
          let revenue = 0
          let renewalRevenue = 0
          let refundedRevenue = 0
          let sales = 0

          if (!visitorId || !sessionId) {
            console.log('No visitorId or sessionId in dodo hook', {
              websiteId,
              eventType,
              id: data?.id,
            })

            return new Response(JSON.stringify({ ok: true }), { status: 200 })
          }

          switch (eventType) {
            case 'subscription.renewed': {
              if (!visitorId || !sessionId) {
                console.log(
                  'No visitorId or sessionId found in metadata for dodo subscription.renewed',
                  { websiteId },
                )

                return new Response(
                  JSON.stringify({ ok: true, msg: 'metadata not found' }),
                  { status: 400 },
                )
              }
              const firstRenewal = await isFirstRenewalDodo({
                subId: data?.subscription_id,
                websiteId,
              })

              if (firstRenewal) {
                revenue = data?.recurring_pre_tax_amount
              } else {
                renewalRevenue = data?.recurring_pre_tax_amount
              }
              sales = 1
              console.log('Subscription renewed for:', {
                websiteId,
                subId: data?.subscription_id,
              })
              break
            }
            case 'payment.succeeded':
              if (data?.subscription_id) {
                console.log('Payment is for a subscription, ignoring', {
                  websiteId,
                  subsId: data?.subscription_id,
                })

                return new Response(JSON.stringify({ ok: true }))
              }
              revenue =
                (data?.settlement_amount &&
                  (data?.settlement_amount - data?.settlement_tax) / 100) ||
                0
              sales = 1
              console.log('Dodo Payment recorded for:', {
                websiteId,
                pay: data?.payment_id,
              })
              break
            case 'refund.succeeded':
              refundedRevenue =
                (data?.refunds && data.refunds[0] && data.refunds[0]?.amount) ||
                0
              break
            default:
              console.log('Unhandled event', eventType)
          }

          if (revenue > 0)
            await createRevenueAndUpdateCache({
              refundedRevenue,
              renewalRevenue,
              revenue,
              website: websiteId,
              sessionId,
              visitorId,
              sales,
            })

          return new Response(JSON.stringify({ ok: true }))
        } catch (error) {
          console.error('Error in checkout POST handler:', error)

          return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 },
          )
        }
      },
    },
  },
})
