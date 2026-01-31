/**
 * Test utilities for Twitter Link Attribution
 * Use these to verify the feature is working correctly
 */

import {
  resolveTwitterLink,
  extractTweetIdFromUrl,
  isTwitterReferrer,
} from "./twitter";

export async function testTwitterLinkResolution() {
  console.log("🧪 Testing Twitter Link Resolution...\n");

  // Test t.co link resolution
  const testLinks = [
    "https://t.co/example123",
    "https://twitter.com/user/status/1234567890",
    "https://x.com/user/status/1234567890",
  ];

  for (const link of testLinks) {
    console.log(`Testing: ${link}`);
    const result = await resolveTwitterLink(link);
    console.log("Result:", result);
    console.log("---");
  }
}

export function testTwitterDetection() {
  console.log("🧪 Testing Twitter Referrer Detection...\n");

  const testReferrers = [
    { url: "https://twitter.com/user/status/123", expected: true },
    { url: "https://x.com/user/status/123", expected: true },
    { url: "https://t.co/abc123", expected: true },
    { url: "https://google.com", expected: false },
    { url: "https://facebook.com", expected: false },
  ];

  for (const test of testReferrers) {
    try {
      const hostname = new URL(test.url).hostname;
      const result = isTwitterReferrer(hostname);
      const status = result === test.expected ? "✅" : "❌";
      console.log(`${status} ${test.url}: ${result}`);
    } catch (error) {
      console.error(`❌ Error testing ${test.url}:`, error);
    }
  }
}

export function testTweetIdExtraction() {
  console.log("🧪 Testing Tweet ID Extraction...\n");

  const testUrls = [
    "https://twitter.com/user/status/1234567890123",
    "https://x.com/user/status/9876543210987",
    "https://twitter.com/i/web/status/1111111111111",
    "https://invalid.com/status/123",
  ];

  for (const url of testUrls) {
    try {
      const tweetId = extractTweetIdFromUrl(url);
      console.log(`${url}`);
      console.log(`  -> Tweet ID: ${tweetId || "Not found"}`);
    } catch (error) {
      console.error(`Error extracting from ${url}:`, error);
    }
  }
}

export async function runAllTests() {
  console.log("=".repeat(50));
  console.log("TWITTER LINK ATTRIBUTION - TEST SUITE");
  console.log("=".repeat(50));
  console.log("");

  try {
    testTwitterDetection();
    console.log("\n");

    testTweetIdExtraction();
    console.log("\n");

    await testTwitterLinkResolution();
  } catch (error) {
    console.error("Test suite failed:", error);
  }

  console.log("\n" + "=".repeat(50));
  console.log("TESTS COMPLETE");
  console.log("=".repeat(50));
}

// Usage: Call in browser console or test environment
// import { runAllTests } from '@/lib/utils/twitter-test'
// runAllTests()
