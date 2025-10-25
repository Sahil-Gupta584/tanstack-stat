import { Account, Client, TablesDB } from 'appwrite'

if (!import.meta.env.VITE_APPWRITE_PROJECT_ID)
  throw new Error('Invalid appwrite project url')

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

const account = new Account(client)
const db = new TablesDB(client)
export { account, client, db }
