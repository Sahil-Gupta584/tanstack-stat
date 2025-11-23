import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createServerFn } from "@tanstack/react-start";
import type { TWebsiteData } from "./settings/-components/generalTab";

export async function saveWebsiteData({
  $id,
  domain,
  timezone,
}: TWebsiteData & { $id: string }) {
  await database.updateRow({
    databaseId,
    tableId: "websites",
    rowId: $id,
    data: {
      domain,
      timezone,
    },
  });
}

export const deleteWebsite = createServerFn({ method: "POST" })
  .inputValidator((d: { websiteId: string }) => d)
  .handler(
    async ({ data }) =>
      await database.deleteRow({
        databaseId,
        tableId: "websites",
        rowId: data.websiteId,
      })
  );

export const getWebsite = createServerFn({ method: "POST" })
  .inputValidator((d: { websiteId: string; queries?: string[] }) => d)
  .handler(
    async ({ data }) =>
      await database.getRow({
        databaseId,
        tableId: "websites",
        rowId: data.websiteId,
        queries: data.queries,
      })
  );
