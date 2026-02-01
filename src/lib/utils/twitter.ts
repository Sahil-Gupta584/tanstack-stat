/**
 * Utility functions for handling Twitter link attribution
 * Resolves t.co redirect URLs to original post URLs
 */

export interface ResolvedTwitterLink {
  originalUrl: string;
  tweetId?: string;
  postUrl?: string;
  error?: string;
}

/**
 * Resolves a t.co shortened URL to get the original URL
 * Follows redirects to find the real destination
 */
export async function resolveTwitterLink(
  tcoUrl: string
) {
  try {
    if (!tcoUrl || !tcoUrl.includes("t.co")) {
      return {
        originalUrl: tcoUrl,
        error: "Not a t.co URL"
      };
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(tcoUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    }).catch(async (err) => {
      // If HEAD fails, try GET
      if (err.name === "AbortError") {
        throw new Error("Timeout resolving t.co URL");
      }
      return fetch(tcoUrl, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
      });
    });

    clearTimeout(timeoutId);

    const originalUrl = response.url;
    const tweetId = extractTweetIdFromUrl(originalUrl);
    return {
      originalUrl,
      tweetId,
      postUrl: originalUrl,
    };
  } catch (error) {
    console.error("Error resolving t.co URL:", error);
    return {
      originalUrl: tcoUrl,
      error: error instanceof Error ? error.message : "Failed to resolve URL",
    };
  }
}

/**
 * Extracts tweet ID from a Twitter URL
 * Works with both twitter.com and x.com URLs
 */
export function extractTweetIdFromUrl(url: string): string | undefined {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Match patterns like /i/web/status/1234567890 or /username/status/1234567890
    const match = pathname.match(/\/(?:i\/web\/)?status\/(\d+)/);
    return match ? match[1] : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Checks if a URL is a t.co shortened link
 */
export function isTcoLink(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === "t.co";
  } catch {
    return false;
  }
}
