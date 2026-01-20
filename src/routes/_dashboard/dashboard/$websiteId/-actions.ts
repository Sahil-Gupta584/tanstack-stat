import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { createServerFn } from "@tanstack/react-start";
import { addWebsiteSchema } from "@/lib/zodSchemas";
import { ID } from "node-appwrite";
import z from "zod";

export const createWebsite = createServerFn({ method: 'POST' }).inputValidator(addWebsiteSchema.extend({ userId: z.string() })).handler(async ({ data }) => {
  try {
    const res = await database.createRow({
      databaseId,
      rowId: ID.unique(),
      tableId: "websites",
      data: data,
    });
    return { ok: true, data: res };
  } catch (error) {
    console.log("appwrite err", JSON.stringify(error));
    return { ok: false, error: (error as Error).message };
  }
})
export const updateWebsite = createServerFn({ method: 'POST' }).inputValidator(addWebsiteSchema.partial().extend({ websiteId: z.string() })).handler(async ({ data }) => {
  try {
    const res = await database.updateRow({
      databaseId,
      rowId: data.websiteId,
      tableId: "websites",
      data: data,
    });
    return { ok: true, data: res };
  } catch (error) {
    console.log("appwrite err", JSON.stringify(error));
    return { ok: false, error: (error as Error).message };
  }
})
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
