'use server'

import { Query } from 'node-appwrite'

import { database, databaseId } from '@/configs/appwrite/serverConfig'
import type { TPaymentProviders } from '@/lib/types'

export async function isDomainExists(domain: string) {
  try {
    return await database.listRows({
      databaseId,
      tableId: 'websites',
      queries: [Query.equal('domain', domain)],
    })
  } catch {
    return null
  }
}

export async function disconnectProvider(
  websiteId: string,
  provider: TPaymentProviders,
) {
  const website = await database.getRow({
    databaseId,
    rowId: websiteId,
    tableId: 'websites',
    queries: [Query.select(['paymentProviders'])],
  })

  const updatedProviders = (website.paymentProviders || []).filter(
    (p: string) => p !== provider,
  )

  // update row
  await database.updateRow({
    databaseId,
    rowId: websiteId,
    tableId: 'websites',
    data: {
      paymentProviders: updatedProviders,
    },
  })
}
