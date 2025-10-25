/* eslint-disable */
import { Account, Client, TablesDB } from 'node-appwrite'
declare global {
  interface ImportMeta {
    env: Record<string, string>
  }
}

const rawDatabaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID

if (!rawDatabaseId)
  throw new Error('Missing NEXT_PUBLIC_APPWRITE_DATABASE_ID in .env')

const databaseId: string = rawDatabaseId
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID
const projectKey = process.env.APPWRITE_KEY

if (!projectId)
  throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env')

export const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(projectId)
  .setKey(projectKey!)

export const account = new Account(client)
const database = new TablesDB(client)
const MODE = import.meta.env.NEXT_PUBLIC_MODE || 'dev'

export { database, databaseId, MODE }
