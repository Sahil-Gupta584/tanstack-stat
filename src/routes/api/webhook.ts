import { MODE, users } from '@/configs/appwrite/serverConfig';
import { createFileRoute } from '@tanstack/react-router'
import { Webhook } from "standardwebhooks";
export const Route = createFileRoute("/api/webhook")({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const bodyText = await request.text() // ✅ raw body
                console.log({ bodyText });

                return new Response("OK", { status: 200 });
            },
            POST: async ({ request }) => {
                console.log('🔔 Received DodoPayments Webhook')

                try {
                    const secret = process.env.DODO_WEBHOOK_SECRET
                    if (!secret) throw new Error('webhook secret not found')

                    const bodyText = await request.text() // ✅ raw body
                    const headers = Object.fromEntries(request.headers.entries())

                    const webhook = new Webhook(secret)
                    const event = await webhook.verify(bodyText, headers) as any
                    console.log('Webhook Payload:', JSON.stringify(event, null, 2))

                    const type = event?.type
                    const data = event?.data
                    if (!type || !data) {
                        return new Response(JSON.stringify({ error: 'Invalid payload' }), {
                            status: 400,
                            headers: { 'Content-Type': 'application/json' },
                        })
                    }

                    if (type === 'subscription.active') {
                        const product_id = data.product_id
                        const subscription_id = data.subscription_id
                        const userId = data.metadata.userId

                        if (!userId) {
                            console.log('Received unknownd webhook without userId', JSON.stringify(event));
                            return new Response(JSON.stringify({ error: 'Missing userId' }), {
                                status: 400,
                                headers: { 'Content-Type': 'application/json' },
                            })
                        }


                        const user = await users.get(userId)

                        if (!user) {
                            return new Response(JSON.stringify({ error: 'User not found' }), {
                                status: 404,
                                headers: { 'Content-Type': 'application/json' },
                            })
                        }

                        const currentPrefs = user.prefs || {}

                        let plan: 'free' | 'pro' = 'free'
                        let creditsToAdd = 1500

                        if (product_id === process.env.DODO_PAYMENTS_PRO_PLAN_ID) {
                            plan = 'pro'
                            creditsToAdd = 4500
                        }
                        console.log({ user, userId, currentPrefs, users });

                        const newCredits = (Number(currentPrefs.credits) || 0) + creditsToAdd

                        const res = await users.updatePrefs(userId, {
                            ...currentPrefs,
                            plan,
                            credits: newCredits,
                            subscriptionId: subscription_id || currentPrefs.subscriptionId || null,
                            lastRefillAt: Date.now(),
                        })
                        console.log({ res });

                    }

                    return new Response(JSON.stringify({ received: true }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    })
                } catch (error) {
                    console.error("Error in checkout POST handler:", error);

                    return new Response(
                        JSON.stringify({ error: "Internal server error" }),
                        { status: 500 },
                    );
                }
            },
        },
    },
});
