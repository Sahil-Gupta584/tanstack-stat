import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createServerFn } from "@tanstack/react-start";
import { ID } from "appwrite";
import { Query } from "node-appwrite";
import { TFunnelStep } from "../customEvents/funnelChart";

export const createOrUpdateWebsiteFunnel = createServerFn()
  .inputValidator(
    (d: { websiteId: string; name: string; funnelId?: string }) => d
  )
  .handler(async ({ data }) => {
    const { funnelId, name, websiteId } = data;
    return await database.upsertRow({
      rowId: funnelId || ID.unique(),
      databaseId,
      tableId: "funnels",
      data: { name, website: websiteId },
    });
  });

export const createOrUpdateFunnelSteps = createServerFn({ method: "POST" })
  .inputValidator((d: TFunnelStep) => d)
  .handler(async ({ data }) => {
    await database.upsertRow({
      databaseId,
      rowId: data.$id || ID.unique(),
      tableId: "funnelsteps",
      data,
    });
  });

export const deleteFunnel = createServerFn()
  .inputValidator((d: { funnelId: string }) => d)
  .handler(async ({ data }) => {
    await database.deleteRow({
      databaseId,
      tableId: "funnels",
      rowId: data.funnelId,
    });
    await deleteFunnelSteps({ data: { funnelId: data.funnelId } });
  });
export const deleteFunnelSteps = createServerFn()
  .inputValidator((d: { funnelId: string; stepIds?: string[] }) => d)
  .handler(async ({ data }) => {
    const queries = [Query.equal("funnelId", data.funnelId)];
    if (data.stepIds?.length) {
      queries.push(Query.equal("$id", data.stepIds));
    }
    await database.deleteRows({
      databaseId,
      tableId: "funnelsteps",
      queries,
    });
  });
