import axios from 'axios'
import { ID, Query } from 'node-appwrite'

import { database, databaseId } from '@/configs/appwrite/serverConfig'
import { updateCache } from '@/configs/redis'
import { TPaymentProviders } from '@/lib/types'
import {
  dodoApiBaseUrl,
  getTimestamp,
  polarBaseUrl,
  stripeApiBaseUrl,
} from '@/lib/utils/server'
import { eventExtraDataForm } from '@/lib/zodSchemas'
export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
export async function handleStripePaymentLinks({
  csid,
  sId,
  vId,
  websiteId,
}: {
  csid: string
  websiteId: string
  vId: string
  sId: string
}) {
  try {
    const key = await getWebsiteKey(websiteId, 'Stripe')

    if (!key) return

    const params = new URLSearchParams()

    params.append('metadata[insightly_visitor_id]', vId)
    params.append('metadata[insightly_session_id]', sId)
    const checkoutRes = await axios(
      stripeApiBaseUrl + `/checkout/sessions/${csid}`,
      {
        headers: { Authorization: `Bearer ${key}` },
        validateStatus: () => true,
      },
    )
    if (!checkoutRes.data?.mode) {
      console.log('Stripe checkout session not found', {
        csid,
        websiteId,
        res: checkoutRes.data,
      })
      return
    }
    if (checkoutRes.data.mode === 'subscription') {
      const updateSessionRes = await axios.post(
        stripeApiBaseUrl + `/checkout/sessions/${csid}`,
        params,
        {
          headers: { Authorization: `Bearer ${key}` },
          validateStatus: () => true,
        },
      )

      if (!updateSessionRes?.data?.id) {
        console.log('Failed to update checkout stripe checkout session', {
          websiteId,
          csid,
          res: updateSessionRes.data,
        })

        return
      } else {
        console.log('updated stripe checkout session', {
          csid,
          websiteId,
        })
      }
    }
    await database.createRow({
      databaseId,
      tableId: 'revenues',
      rowId: ID.unique(),
      data: {
        website: websiteId,
        eventType: 'purchase',
        revenue: Number((checkoutRes.data?.amount_subtotal / 100).toFixed()),
        renewalRevenue: 0,
        refundedRevenue: 0,
        sessionId: sId,
        visitorId: vId,
        sales: 1,
      },
    })
    console.log('Handled stripe link for mode:', checkoutRes.data?.mode, {
      websiteId,
      csid,
    })

    // console.log("updateStripeCheckSession:", JSON.stringify(res?.data));
  } catch (error) {
    console.log('Error updating stripe session metadata', error, {
      csid,
      websiteId,
    })

    return
  }
}

export async function getSessionMetaFromStripe(
  payIntId: string,
  websiteId: string,
) {
  try {
    const key = await getWebsiteKey(websiteId, 'Stripe')

    if (!key) return
    const res = await axios.get(
      stripeApiBaseUrl + `/checkout/sessions?payment_intent=${payIntId}`,
      {
        headers: { Authorization: `Bearer ${key}` },
        validateStatus: () => true,
      },
    )
    const sessionData = res?.data?.data?.[0]

    if (!sessionData) {
      console.log('Unable to find session using paymentIntent', {
        payIntId,
        websiteId,
        sessionData: res.data,
      })

      return
    }

    if (
      !sessionData?.metadata?.insightly_session_id ||
      !sessionData?.metadata?.insightly_visitor_id
    ) {
      console.log('No metadata found in stripe checkout session', {
        payIntId,
        websiteId,
      })

      return
    }

    return {
      visitorId: sessionData?.metadata.insightly_visitor_id,
      sessionId: sessionData?.metadata.insightly_session_id,
      mode: sessionData?.mode,
    }
  } catch (error) {
    console.log('Error fetching stripe payment metadata', error, {
      payIntId,
      websiteId,
    })

    return
  }
}

export async function isFirstRenewalDodo({
  subId,
  websiteId,
}: {
  subId: string
  websiteId: string
}) {
  try {
    const key = await getWebsiteKey(websiteId, 'Dodo')

    if (!key) return
    const paymentsRes = await axios.get(
      dodoApiBaseUrl + `/payments?subscription_id=${subId}`,
      { headers: { Authorization: `Bearer ${key}` } },
    )

    // console.log("paymentsRes:", JSON.stringify(paymentsRes.data));

    return paymentsRes.data?.items?.length === 1
  } catch (error) {
    console.log('Error checking first renewal for dodo', error, {
      subId,
      websiteId,
    })

    return false
  }
}

export async function handleDodoSubscriptionLink({
  sId,
  subId,
  vId,
  websiteId,
}: {
  subId: string
  websiteId: string
  vId: string
  sId: string
}) {
  try {
    const key = await getWebsiteKey(websiteId, 'Dodo')

    if (!key) return

    const subRes = await axios.get(dodoApiBaseUrl + `/subscriptions/${subId}`, {
      headers: { Authorization: `Bearer ${key}` },
    })
    const subscription = subRes.data
    const isMetadataExists =
      subscription.metadata?.insightly_session_id &&
      subscription.metadata?.insightly_visitor_id

    if (isMetadataExists) {
      console.log('Metadata already exists for dodo subscription', {
        subId,
        websiteId,
      })

      return
    }
    await database.createRow({
      databaseId,
      tableId: 'revenues',
      rowId: ID.unique(),
      data: {
        website: websiteId,
        sessionId: sId,
        visitorId: vId,
        revenue: Number(
          (subscription.recurring_pre_tax_amount / 100).toFixed(),
        ),
        renewalRevenue: 0,
        refundedRevenue: 0,
        sales: 1,
        eventType: 'purchase',
      },
    })
    const res = await axios.patch(
      dodoApiBaseUrl + `/subscriptions/${subId}`,
      {
        metadata: {
          insightly_visitor_id: vId,
          insightly_session_id: sId,
        },
      },
      { headers: { Authorization: `Bearer ${key}` } },
    )

    if (!res?.data?.subscription_id) {
      console.log(
        'Failed to add metadata for dodo subscription',
        sId,
        'website:',
        websiteId,
      )
    }
    console.log('Dodo Subscription recorded', {
      sId,
      subId,
      vId,
      websiteId,
    })
  } catch (error) {
    console.log('handleDodoSubscriptionLink Error', error, {
      sId,
      subId,
      websiteId,
    })
  }
}

export async function handleDodoPaymentLink({
  sId,
  payId,
  vId,
  websiteId,
}: {
  payId: string
  websiteId: string
  vId: string
  sId: string
}) {
  try {
    const key = await getWebsiteKey(websiteId, 'Dodo')

    if (!key) return
    const payRes = await axios.get(dodoApiBaseUrl + `/payments/${payId}`, {
      headers: { Authorization: `Bearer ${key}` },
    })
    const payment = payRes.data
    const isMetadataExists =
      payment?.metadata?.insightly_session_id &&
      payment?.metadata?.insightly_visitor_id

    if (isMetadataExists) {
      console.log('Metadata already exists for dodo Payment', {
        payId,
        websiteId,
      })

      return
    }
    if (payment.status !== 'succeeded') {
      console.log('Payment not succeeded, skipping revenue creation', {
        payId,
        websiteId,
        status: payment.status,
      })

      return
    }
    await database.createRow({
      databaseId,
      tableId: 'revenues',
      rowId: ID.unique(),
      data: {
        website: websiteId,
        sessionId: sId,
        visitorId: vId,
        revenue: Number((payment.settlement_amount / 100).toFixed()),
        renewalRevenue: 0,
        refundedRevenue: 0,
        sales: 1,
        eventType: 'purchase',
      },
    })
    console.log('Dodo payment recorded', { sId, payId, vId, websiteId })
  } catch (error) {
    console.log('handleDodoPaymentLink Error', error, {
      sId,
      payId,
      websiteId,
    })
  }
}

export async function updatePolarCustomer({
  chId,
  sId,
  vId,
  websiteId,
}: {
  chId: string
  websiteId: string
  vId: string
  sId: string
}) {
  try {
    const key = await getWebsiteKey(websiteId, 'Polar')

    if (!key) return

    // First, get the checkout to retrieve customer_id
    const checkoutRes = await axios.get(polarBaseUrl + `/checkouts/${chId}`, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
      validateStatus: () => true,
    })

    if (!checkoutRes.data?.customer_id) {
      console.log('Failed to get customer_id from checkout', {
        chId,
        websiteId,
        res: JSON.stringify(checkoutRes.data),
      })

      return
    }

    // Update customer metadata
    const updateCustomerRes = await axios.patch(
      polarBaseUrl + `/customers/${checkoutRes.data.customer_id}`,
      {
        metadata: {
          [`${websiteId}_insightlyVisitorId`]: vId,
          [`${websiteId}_insightlySessionId`]: sId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
        validateStatus: () => true,
      },
    )

    if (!updateCustomerRes.data?.id) {
      console.log('Failed to update polar customer metadata', {
        chId,
        websiteId,
        customer_id: checkoutRes.data.customer_id,
        res: JSON.stringify(updateCustomerRes.data),
      })
    } else {
      console.log('Successfully updated polar customer metadata', {
        chId,
        websiteId,
        customer_id: checkoutRes.data.customer_id,
      })
    }
  } catch (error) {
    console.log(
      'Unhandled error in updatePolarCheckout',
      {
        chId,
        websiteId,
      },
      error,
    )
  }
}

export async function getWebsiteKey(
  websiteId: string,
  provider: TPaymentProviders,
) {
  const res = await database.listRows({
    databaseId,
    tableId: 'keys',
    queries: [Query.equal('$id', websiteId)],
  })

  if (!res.rows[0]?.[provider.toLowerCase()]) {
    console.log(`No ${provider.toLowerCase()} key found for website`, {
      websiteId,
      res: JSON.stringify(res),
    })

    return
  }

  return res.rows[0]?.[provider.toLowerCase()] as string
}

export async function handleCustomEvent({
  extraData,
  sessionId,
  visitorId,
  websiteId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraData: any
  websiteId: string
  visitorId: string
  sessionId: string
}) {
  try {
    const { eventName, ...metadata } = extraData
    const formdata = eventExtraDataForm.safeParse(metadata)

    if (formdata.error)
      return new Response(JSON.stringify({ error: formdata.error.message }), {
        headers,
      })

    if (!eventName) {
      return new Response(JSON.stringify({ error: 'eventName is required' }), {
        headers,
      })
    }
    await database.createRow({
      databaseId: databaseId,
      tableId: 'goals',
      rowId: ID.unique(),
      data: {
        website: websiteId,
        visitorId,
        sessionId,
        name: eventName,
        metadata: JSON.stringify(metadata),
      },
    })

    return new Response(JSON.stringify({ ok: true }), { headers })
  } catch (error) {
    console.log('Error in handleCustomEvent', error)

    return new Response(JSON.stringify({ error: 'Unknown server error' }), {
      status: 500,
      headers,
    })
  }
}

export async function verifyAnalyticsPayload(req: Request) {
  const searchParams = new URL(req.url).searchParams
  const websiteId = searchParams.get('websiteId')
  const duration = searchParams.get('duration')

  if (!websiteId || !duration) throw new Error('Invalid payload')

  let timestamp: string | number | null = getTimestamp(duration)

  if (timestamp === null) throw new Error('Invalid duration.')
  if (timestamp === 0) {
    const row = await database.listRows({
      databaseId,
      tableId: 'events',
      queries: [
        Query.equal('website', websiteId),
        Query.limit(1),
        Query.orderAsc('$createdAt'),
      ],
    })

    timestamp = row.rows?.[0].$createdAt
  }

  return { websiteId, duration, timestamp }
}

export async function createRevenueAndUpdateCache({
  refundedRevenue,
  renewalRevenue,
  revenue,
  sales,
  sessionId,
  visitorId,
  website,
}: {
  website: string
  sessionId: string
  visitorId: string
  revenue: number
  renewalRevenue: number
  refundedRevenue: number
  sales: number
}) {
  revenue = Number((revenue / 100).toFixed())
  await database.createRow({
    databaseId,
    tableId: 'revenues',
    rowId: ID.unique(),
    data: {
      website,
      eventType: 'purchase',
      revenue,
      renewalRevenue:
        renewalRevenue > 0 ? Number((renewalRevenue / 100).toFixed()) : 0,
      refundedRevenue,
      sales,
      visitorId,
      sessionId,
    },
  })

  const firstEvent = await database.listRows({
    databaseId,
    tableId: 'events',
    queries: [
      Query.equal('visitorId', visitorId),
      Query.equal('sessionId', sessionId),
      Query.equal('website', website),
      Query.limit(1),
    ],
  })
  if (!firstEvent.rows[0]) {
    console.warn('Could not find first event for ', {
      visitorId,
      sessionId,
      website,
    })

    return
  }
  await updateCache({
    //@ts-expect-error appwrite doesnt gives types
    data: firstEvent.rows[0],
    type: 'revenues',
    websiteId: website,
    revenue,
  })
}
