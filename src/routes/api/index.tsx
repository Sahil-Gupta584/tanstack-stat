import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/api/')({
  server: { 
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        return new Response(JSON.stringify({ message: `Hello, ${body.name}!` }))
      },
    },
  },
})