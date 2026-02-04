import { database, databaseId } from "@/configs/appwrite/serverConfig";
import { faker } from "@faker-js/faker";
import fs from "fs";
import { ID } from "node-appwrite";
const hrefs = [
  { href: "/dashboard", weight: 30 },
  { href: "/", weight: 50 },
  { href: "/auth", weight: 20 },
];

const countries = [
  { code: "IN", city: "Thane", region: "Maharashtra", weight: 70 },
  { code: "US", city: "Brooklyn", region: "New York", weight: 10 },
  { code: "DE", city: "Berlin", region: "State of Berlin", weight: 10 },
  { code: "GB", city: "London", region: "England", weight: 10 },
];

const browsers = [
  { name: "chrome", weight: 50 },
  { name: "firefox", weight: 5 },
  { name: "safari", weight: 5 },
  { name: "edge", weight: 40 },
];

const devices = [
  { type: "desktop", weight: 90 },
  { type: "mobile", weight: 5 },
  { type: "tablet", weight: 5 },
];

const referrers = [
  { referrer: null, weight: 20 },
  { referrer: "https://x.com", weight: 40 },
  { referrer: "https://instagram.com", weight: 10 },
  { referrer: "https://google.com", weight: 30 },
];

const operatingSystems = [
  { name: "windows", weight: 60 },
  { name: "android", weight: 10 },
  { name: "macos", weight: 20 },
  { name: "linux", weight: 10 },
];

// --- New: goal types ---
const goals = [
  { name: "landing-hero", weight: 40 },
  { name: "landing-cta", weight: 30 },
  { name: "landing-demo-interation", weight: 15 },
  { name: "landing-pricing", weight: 10 },
  { name: "publish-first-video", weight: 5.1 },
];

const twitterReferralLinks = [
  { slug: "g4OLWm5rwM", tweetId: "1947318149830922658", resolved: "x.com/sahil_builds/1947318149830922658", weight: 25 },
  { slug: "g4OLWm5Zmk", tweetId: "1949138667701973503", resolved: "x.com/sahil_builds/1949138667701973503", weight: 25 },
  { slug: "g4OLWm5rwM", tweetId: "1956811193630240792", resolved: "x.com/sahil_builds/1956811193630240792", weight: 25 },
  { slug: "g4OLWm5rwM", tweetId: "1943318019561918532", resolved: "x.com/sahil_builds/1943318019561918532", weight: 25 },
];

// --- Helpers ---
function weightedRandom<T extends { weight: number }>(arr: T[]) {
  const totalWeight = arr.reduce((sum, item) => sum + item.weight, 0);
  let rnd = Math.random() * totalWeight;
  for (const item of arr) {
    if (rnd < item.weight) return item;
    rnd -= item.weight;
  }
  return arr[0];
}

function randomDateWithPeak(dayStart: Date) {
  const peakHour = faker.number.int({ min: 10, max: 22 });
  const minutes = faker.number.int({ min: 0, max: 59 });
  const seconds = faker.number.int({ min: 0, max: 59 });
  return new Date(
    dayStart.getFullYear(),
    dayStart.getMonth(),
    dayStart.getDate(),
    peakHour,
    minutes,
    seconds
  ).toISOString();
}

// --- Main data generator with FUNNEL LOGIC ---
export async function generateDummyData({
  startDate,
  endDate,
  websiteId,
  writeInFiles,
}: {
  startDate: Date;
  endDate: Date;
  websiteId: string;
  writeInFiles?: boolean;
}) {
  const events = [];
  const revenues = [];
  const goalsData = [];
  const mentions = [];
  const linksData = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // More visitors per day to match analytics (351 total / 8 days ≈ 44 per day)
    const visitorsToday = Array.from(
      { length: faker.number.int({ min: 10, max: 20 }) },
      () => faker.string.uuid()
    );

    const dayStart = new Date(d);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    // Create visitor journeys with funnel logic
    for (const visitorId of visitorsToday) {
      const sessionId = faker.string.uuid();
      const country = weightedRandom(countries);
      const device = weightedRandom(devices).type;
      const os = weightedRandom(operatingSystems).name;
      const browser = weightedRandom(browsers).name;
      const referrerObj = weightedRandom(referrers);
      const referrer = referrerObj.referrer;

      // New: If referrer is X, simulate a link conversion from the specific posts (low 5% chance)
      if (referrer === "https://x.com" && Math.random() < 0.05) {
        const twitterLink = weightedRandom(twitterReferralLinks);
        // Simulate some as resolved, some as raw (80% resolved to show the cache/resolver feature)
        const isResolved = Math.random() < 0.8;

        linksData.push({
          website: websiteId,
          link: isResolved ? twitterLink.resolved : `t.co/${twitterLink.slug}`,
          sessionId,
          visitorId,
          extraDetail: twitterLink.slug,
          tweetId: isResolved ? twitterLink.tweetId : null,
          $createdAt: randomDateWithPeak(dayStart),
        });
      }

      // Helper to create event with sequential timestamps
      let currentTime = new Date(randomDateWithPeak(dayStart));
      const createEvent = (page: string, addMinutes: number = 0) => {
        currentTime = new Date(currentTime.getTime() + addMinutes * 60000);
        return {
          type: "pageview",
          website: websiteId,
          page,
          visitorId,
          sessionId,
          referrer,
          os,
          browser,
          countryCode: country.code,
          city: country.city,
          region: country.region,
          device,
          $createdAt: currentTime.toISOString(),
        };
      };

      // STEP 1: Everyone visits landing page (/)
      events.push(createEvent("/", 0));

      // Maybe trigger landing goals
      if (Math.random() < 0.4) {
        const goal = weightedRandom(
          goals.filter((g) => g.name.startsWith("landing"))
        );
        goalsData.push({
          name: goal.name,
          website: websiteId,
          visitorId,
          sessionId,
          metadata: JSON.stringify({
            url: "/",
            conversionValue: faker.number.int({ min: 10, max: 50 }),
          }),
          $createdAt: new Date(currentTime.getTime() + 5000).toISOString(), // 5 seconds after pageview
        });
      }

      // STEP 2: ~43% proceed to /auth (based on your analytics: 152/351)
      const goesToAuth = Math.random() < 0.43;
      if (goesToAuth) {
        events.push(createEvent("/auth", faker.number.int({ min: 1, max: 3 })));

        // STEP 3: ~85% of those who visit /auth go to /dashboard (130/152)
        const goesToDashboard = Math.random() < 0.85;
        if (goesToDashboard) {
          events.push(
            createEvent("/dashboard", faker.number.int({ min: 1, max: 5 }))
          );

          // Dashboard users might trigger purchase/revenue
          if (Math.random() < 0.15) {
            const purchaseEvent = createEvent("/dashboard", 1);
            purchaseEvent.type = "purchase";
            events.push(purchaseEvent);

            const baseRevenue = faker.number.int({ min: 10, max: 100 });
            const hasRenewal = Math.random() < 0.3;
            const renewalRevenue = hasRenewal
              ? Math.round(
                baseRevenue * faker.number.float({ min: 0.2, max: 0.5 })
              )
              : 0;
            const isRefunded = Math.random() < 0.05;
            const refundedRevenue = isRefunded
              ? Math.round(
                baseRevenue * faker.number.float({ min: 0.2, max: 1.0 })
              )
              : 0;
            const sales = baseRevenue + renewalRevenue - refundedRevenue;

            revenues.push({
              website: websiteId,
              sessionId,
              visitorId,
              revenue: baseRevenue,
              renewalRevenue,
              refundedRevenue,
              sales,
              eventType: "purchase",
              $createdAt: purchaseEvent.$createdAt,
            });
          }

          // Dashboard goal
          if (Math.random() < 0.2) {
            goalsData.push({
              name: "publish-first-video",
              website: websiteId,
              visitorId,
              sessionId,
              metadata: JSON.stringify({
                url: "/dashboard",
                conversionValue: faker.number.int({ min: 50, max: 200 }),
              }),
              $createdAt: new Date(currentTime.getTime() + 10000).toISOString(),
            });
          }
        }
      }

      // Some visitors browse multiple pages (add noise)
      const extraPageViews = faker.number.int({ min: 0, max: 3 });
      for (let i = 0; i < extraPageViews; i++) {
        const randomPage = weightedRandom(hrefs).href;
        events.push(
          createEvent(randomPage, faker.number.int({ min: 1, max: 2 }))
        );
      }
    }

    // MENTIONS Generation (40% chance today, 1-8 count)
    if (Math.random() < 0.4) {
      const mentionCount = faker.number.int({ min: 1, max: 8 });
      for (let i = 0; i < mentionCount; i++) {
        const mentionTime = new Date(
          dayStart.getTime() + Math.random() * (dayEnd.getTime() - dayStart.getTime())
        );
        mentions.push({
          tweetId: faker.string.numeric(18),
          website: websiteId,
          username: faker.person.fullName(),
          handle: faker.internet.username(),
          content: faker.helpers.arrayElement([
            "Checking out the analytics on @syncmatedotxyz. The real-time maps are fire! 🔥",
            "Just integrated @syncmatedotxyz into my project. Super easy setup.",
            "The dashboard on @syncmatedotxyz is really sleek. Love it!",
            "Finally an analytics tool that isn't bloated. Great job @syncmatedotxyz.",
            "Love the mission of @syncmatedotxyz. Open source analytics is the way.",
          ]),
          image: faker.image.avatar(),
          isVerified: Math.random() < 0.7, // 70% chance of being verified
          timestamp: mentionTime.toISOString(),
          keyword: "syncmate",
          $createdAt: mentionTime.toISOString(),
        });
      }
    }
  }

  if (writeInFiles) {
    fs.writeFileSync(
      "events.ts",
      `export const eventsData = ${JSON.stringify(events, null, 2)}`
    );
    fs.writeFileSync(
      "revenues.ts",
      `export const revenuesData = ${JSON.stringify(revenues, null, 2)}`
    );
    fs.writeFileSync(
      "goals.ts",
      `export const goalsData = ${JSON.stringify(goalsData, null, 2)}`
    );
    fs.writeFileSync(
      "mentions.ts",
      `export const mentionsData = ${JSON.stringify(mentions, null, 2)}`
    );
    fs.writeFileSync(
      "links.ts",
      `export const linksData = ${JSON.stringify(linksData, null, 2)}`
    );
  }
  console.log(
    `✅ Generated ${events.length} events, ${revenues.length} revenues, ${goalsData.length} goals, ${mentions.length} mentions, ${linksData.length} links`
  );
  return { events, revenues, goalsData, mentions, linksData };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function seed(tableId: string, data: any[]) {
  for (const [i, row] of data.entries()) {
    const checkDate = row?.$createdAt || row?.timestamp;
    if (checkDate && new Date(checkDate).getTime() > Date.now()) continue;

    await database.createRow({
      databaseId,
      tableId,
      rowId: ID.unique(),
      data: row,
    });
    console.log(`Inserted ${i} into ${tableId}`);
  }
}

export async function updateCacheWithSeededData(
  websiteId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenues: any[]
) {
  try {
    const { updateCache } = await import("@/configs/redis");

    // Update cache with each event
    for (const event of events) {
      await updateCache({
        websiteId,
        type: "visitors",
        data: {
          page: event.page,
          referrer: event.referrer,
          countryCode: event.countryCode,
          region: event.region,
          city: event.city,
          browser: event.browser,
          os: event.os,
          device: event.device,
          goalLabel: event.goalLabel,
        },
      });
    }

    // Update cache with each revenue record
    for (const rev of revenues) {
      await updateCache({
        websiteId,
        type: "revenues",
        revenue: rev.revenue,
        data: {
          page: rev.page,
          referrer: rev.referrer,
          countryCode: rev.countryCode,
          region: rev.region,
          city: rev.city,
          browser: rev.browser,
          os: rev.os,
          device: rev.device,
        },
      });
    }

    console.log(`✅ Cache updated with seeded data for website: ${websiteId}`);
  } catch (error) {
    console.error("Error updating cache with seeded data:", error);
  }
}

export async function fetchAndStoreMentions(websiteId: string, keywords: string[], lastFetchedAt?: string) {
  if (!keywords || keywords.length === 0) return [];

  const X_KEY = process.env.X_KEY;
  const X_HOST = process.env.X_HOST;

  if (!X_KEY || !X_HOST) {
    console.error("Missing X key or host");
    return [];
  }

  // Collect stored mentions
  const allStoredMentions = [];

  // Query each keyword individually for better accuracy
  for (const keyword of keywords) {
    if (!keyword) continue;

    try {

      const url = new URL(`https://${X_HOST}/search/tweet`);
      url.searchParams.append("query", keyword);
      url.searchParams.append("count", "100");

      const response = await fetch(url.toString(), {
        headers: {
          "x-rapidapi-host": X_HOST,
          "x-rapidapi-key": X_KEY
        }
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`X Error for "${keyword}":`, { status: response.status, err, url: url.toString() });
        continue;
      }

      const json = await response.json();
      const tweets = json?.data?.data
      if (!tweets) {
        console.log({ tweets });
      }

      console.log(`📥 Fetched ${tweets.length} tweets for "${keyword}". Filtering & Storing...`);

      for (const tweet of tweets) {
        const tweetId = tweet?.legacy?.id_str || tweet.id;
        const content = tweet?.legacy?.full_text || tweet.text;
        const user = tweet?.core?.user_results?.result;

        const timestamp = new Date(tweet?.legacy?.created_at).toISOString()
        if (lastFetchedAt && timestamp < lastFetchedAt) {
          continue
        }
        if (!tweetId || !user || !content) {
          console.log({ tweetId, content, user });

          continue
        };

        const mentionData = {
          tweetId: String(tweetId),
          website: websiteId,
          username: user?.core?.name,
          handle: user?.core?.screen_name || user?.core?.username,
          inReplyToUserHandle: tweet?.in_reply_to_screen_name,
          inReplyToTweetId: tweet?.in_reply_to_status_id_str,
          content: content,
          image: user?.avatar?.image_url || user.profile_image_url,
          isVerified: user?.is_blue_verified,
          timestamp,
          keyword,
        };

        try {
          await database.createRow({
            databaseId,
            tableId: "mentions",
            rowId: ID.unique(),
            data: mentionData,
          });
          allStoredMentions.push(mentionData);
        } catch (e) {
          console.log("Error storing mention", e, { mentionData });
        }

        // Add to result list (either newly stored or existing match)
      }
    } catch (error) {
      console.error(`Error processing keyword "${keyword}":`, error);
    }
  }

  return allStoredMentions;
}
