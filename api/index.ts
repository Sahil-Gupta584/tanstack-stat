import { createServer } from 'vite'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const server = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })

    server.middlewares(req, res)
  } catch (error) {
    console.error(error)
    res.status(500).end('Internal Server Error')
  }
}