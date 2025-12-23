import { createFileRoute } from "@tanstack/react-router";
import { generateDummyData, seed } from "./actions";

const websiteId = "68d124eb001034bd8493";

export const Route = createFileRoute("/api/events/")({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const body = await request.json();
                try {
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - 1);
                    const endDate = new Date();
                    const { events, goalsData, revenues } = await generateDummyData({ startDate, endDate, websiteId, })
                    await seed("events", events);
                    await seed("goals", goalsData);
                    await seed("revenues", revenues);
                } catch (error) {
                    console.log("Error to receive an event", error, {
                        body: JSON.stringify(body),
                    });

                    return new Response(
                        JSON.stringify({ ok: false, error: (error as Error).message }),
                        {
                            status: 500,
                        }
                    );
                }
            },
        },
    }
})
