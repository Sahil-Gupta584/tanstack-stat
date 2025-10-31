import { Query } from "node-appwrite";

import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { TPaymentProviders } from "@/lib/types";
import { createServerFn } from "@tanstack/react-start";

export async function isDomainExists(domain: string) {
  try {
    return await database.listRows({
      databaseId,
      tableId: "websites",
      queries: [Query.equal("domain", domain)],
    });
  } catch {
    return null;
  }
}

export const disconnectProvider = createServerFn({ method: "POST" })
  .inputValidator((d: { websiteId: string; provider: TPaymentProviders }) => d)
  .handler(async ({ data }) => {
    const { websiteId, provider } = data;
    const website = await database.getRow({
      databaseId,
      rowId: websiteId,
      tableId: "websites",
      queries: [Query.select(["paymentProviders"])],
    });

    const updatedProviders = (website.paymentProviders || []).filter(
      (p: string) => p !== provider
    );

    await database.updateRow({
      databaseId,
      rowId: websiteId,
      tableId: "websites",
      data: {
        paymentProviders: updatedProviders,
      },
    });
  });
