import { database, databaseId } from "@/configs/appwrite/serverConfig";
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

export async function deleteWebsite($id: string) {
  await database.deleteRow({
    databaseId,
    tableId: "websites",
    rowId: $id,
  });
}
