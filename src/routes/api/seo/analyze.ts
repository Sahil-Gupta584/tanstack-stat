import type { SEOCheck, SEOReport, SEOStatus } from "@/lib/seo-types";
import { SEO_CHECKS } from "@/lib/seo-types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/seo/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { url } = body as { url: string };

          if (!url) {
            return new Response(
              JSON.stringify({ error: "URL is required" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Validate URL format
          let parsedUrl: URL;
          try {
            parsedUrl = new URL(url);
          } catch {
            return new Response(
              JSON.stringify({ error: "Invalid URL format" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Fetch the page
          let html: string;
          let responseHeaders: Headers;
          let responseTime: number;
          let contentLength: number;
          let isHttps: boolean;

          try {
            const startTime = Date.now();
            const response = await fetch(url, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (compatible; InsightlySEOBot/1.0; +https://insightly.live)",
              },
            });
            responseTime = Date.now() - startTime;
            responseHeaders = response.headers;
            html = await response.text();
            contentLength = html.length;
            isHttps = parsedUrl.protocol === "https:";
          } catch (error) {
            return new Response(
              JSON.stringify({
                error: `Failed to fetch URL: ${(error as Error).message}`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Analyze the page
          const checks = analyzeHTML(
            html,
            parsedUrl,
            responseHeaders,
            responseTime,
            contentLength,
            isHttps
          );

          // Calculate overall score
          const overallScore = calculateScore(checks);

          const report: SEOReport = {
            url: url,
            domain: parsedUrl.hostname,
            overallScore,
            timestamp: new Date().toISOString(),
            checks,
            summary: {
              critical: checks.filter((c) => c.status === "fail").length,
              warnings: checks.filter((c) => c.status === "warning").length,
              passed: checks.filter((c) => c.status === "pass").length,
            },
          };

          return new Response(JSON.stringify(report), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("SEO Analysis error:", error);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});

function analyzeHTML(
  html: string,
  url: URL,
  _headers: Headers,
  responseTime: number,
  contentLength: number,
  isHttps: boolean
): SEOCheck[] {
  const checks: SEOCheck[] = [];

  // Helper to extract content between tags
  const getTagContent = (tag: string): string | null => {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
    const match = html.match(regex);
    return match ? match[1].trim() : null;
  };

  // Helper to get meta tag content
  const getMetaContent = (name: string): string | null => {
    const regex = new RegExp(
      `<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`,
      "i"
    );
    const match = html.match(regex);
    if (match) return match[1];
    // Try alternate order
    const regex2 = new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`,
      "i"
    );
    const match2 = html.match(regex2);
    return match2 ? match2[1] : null;
  };

  // 1. Title Tag Analysis
  const title = getTagContent("title");
  const checkDef = SEO_CHECKS.find((c) => c.id === "title")!;
  if (!title) {
    checks.push({
      ...checkDef,
      status: "fail",
      value: null,
      recommendation: "Add a title tag to your page. This is essential for SEO.",
    });
  } else if (title.length < 30) {
    checks.push({
      ...checkDef,
      status: "warning",
      value: `${title.length} characters`,
      recommendation: `Title is too short (${title.length} chars). Aim for 50-60 characters.`,
    });
  } else if (title.length > 60) {
    checks.push({
      ...checkDef,
      status: "warning",
      value: `${title.length} characters`,
      recommendation: `Title is too long (${title.length} chars). May be truncated in search results. Keep under 60 characters.`,
    });
  } else {
    checks.push({
      ...checkDef,
      status: "pass",
      value: `${title.length} characters`,
      recommendation: "Title tag is well optimized.",
    });
  }

  // 2. Meta Description
  const metaDescription = getMetaContent("description");
  const metaDescCheck = SEO_CHECKS.find((c) => c.id === "meta_description")!;
  if (!metaDescription) {
    checks.push({
      ...metaDescCheck,
      status: "fail",
      value: null,
      recommendation:
        "Add a meta description. It helps improve click-through rates from search results.",
    });
  } else if (metaDescription.length < 120) {
    checks.push({
      ...metaDescCheck,
      status: "warning",
      value: `${metaDescription.length} characters`,
      recommendation: `Meta description is short (${metaDescription.length} chars). Aim for 150-160 characters.`,
    });
  } else if (metaDescription.length > 160) {
    checks.push({
      ...metaDescCheck,
      status: "warning",
      value: `${metaDescription.length} characters`,
      recommendation: `Meta description is too long (${metaDescription.length} chars). May be truncated.`,
    });
  } else {
    checks.push({
      ...metaDescCheck,
      status: "pass",
      value: `${metaDescription.length} characters`,
      recommendation: "Meta description is well optimized.",
    });
  }

  // 3. H1 Structure
  const h1Matches = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  const h1Check = SEO_CHECKS.find((c) => c.id === "h1")!;
  if (h1Matches.length === 0) {
    checks.push({
      ...h1Check,
      status: "fail",
      value: "0 H1 tags",
      recommendation: "Add an H1 tag to your page. It should contain your primary keyword.",
    });
  } else if (h1Matches.length > 1) {
    checks.push({
      ...h1Check,
      status: "warning",
      value: `${h1Matches.length} H1 tags`,
      recommendation: `Found ${h1Matches.length} H1 tags. Best practice is to have exactly one H1.`,
    });
  } else {
    checks.push({
      ...h1Check,
      status: "pass",
      value: "1 H1 tag",
      recommendation: "H1 structure is correct.",
    });
  }

  // 4. Heading Hierarchy
  const headingCheck = SEO_CHECKS.find((c) => c.id === "heading_hierarchy")!;
  const h2s = (html.match(/<h2[^>]*>/gi) || []).length;
  const h3s = (html.match(/<h3[^>]*>/gi) || []).length;
  const h4s = (html.match(/<h4[^>]*>/gi) || []).length;

  if (h1Matches.length === 0 && h2s === 0) {
    checks.push({
      ...headingCheck,
      status: "fail",
      value: "No heading structure",
      recommendation: "Add proper heading hierarchy (H1, H2, H3) for better SEO and accessibility.",
    });
  } else if (h3s > 0 && h2s === 0) {
    checks.push({
      ...headingCheck,
      status: "warning",
      value: `H1: ${h1Matches.length}, H2: ${h2s}, H3: ${h3s}`,
      recommendation: "H3 tags found without H2 tags. Maintain proper heading hierarchy.",
    });
  } else {
    checks.push({
      ...headingCheck,
      status: "pass",
      value: `H1: ${h1Matches.length}, H2: ${h2s}, H3: ${h3s}, H4: ${h4s}`,
      recommendation: "Heading hierarchy looks good.",
    });
  }

  // 5. Internal Links
  const internalLinksCheck = SEO_CHECKS.find((c) => c.id === "internal_links")!;
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;
  let internalLinks = 0;
  let externalLinks = 0;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (href.startsWith("/") || href.startsWith("#") || href.includes(url.hostname)) {
      internalLinks++;
    } else if (href.startsWith("http")) {
      externalLinks++;
    }
  }

  if (internalLinks === 0) {
    checks.push({
      ...internalLinksCheck,
      status: "warning",
      value: "0 internal links",
      recommendation: "Add internal links to help users and search engines navigate your site.",
    });
  } else if (internalLinks < 3) {
    checks.push({
      ...internalLinksCheck,
      status: "warning",
      value: `${internalLinks} internal links`,
      recommendation: "Consider adding more internal links to improve navigation and SEO.",
    });
  } else {
    checks.push({
      ...internalLinksCheck,
      status: "pass",
      value: `${internalLinks} internal links`,
      recommendation: "Good internal linking structure.",
    });
  }

  // 6. External Links
  const externalLinksCheck = SEO_CHECKS.find((c) => c.id === "external_links")!;
  checks.push({
    ...externalLinksCheck,
    status: externalLinks > 0 ? "pass" : "warning",
    value: `${externalLinks} external links`,
    recommendation:
      externalLinks > 0
        ? "External links to authoritative sources found."
        : "Consider adding external links to authoritative sources.",
  });

  // 7. Image Optimization
  const imagesCheck = SEO_CHECKS.find((c) => c.id === "images")!;
  const images = html.match(/<img[^>]*>/gi) || [];
  const imagesWithoutAlt = images.filter(
    (img) => !img.includes("alt=") || img.match(/alt=["']\s*["']/)
  );

  if (images.length === 0) {
    checks.push({
      ...imagesCheck,
      status: "pass",
      value: "No images",
      recommendation: "No images found on the page.",
    });
  } else if (imagesWithoutAlt.length > 0) {
    checks.push({
      ...imagesCheck,
      status: "warning",
      value: `${imagesWithoutAlt.length}/${images.length} missing alt`,
      recommendation: `${imagesWithoutAlt.length} images are missing alt text. Add descriptive alt text for accessibility and SEO.`,
    });
  } else {
    checks.push({
      ...imagesCheck,
      status: "pass",
      value: `${images.length} images with alt text`,
      recommendation: "All images have alt text.",
    });
  }

  // 8. Schema Markup
  const schemaCheck = SEO_CHECKS.find((c) => c.id === "schema")!;
  const hasJsonLd = html.includes('type="application/ld+json"') ||
                   html.includes("type='application/ld+json'");
  checks.push({
    ...schemaCheck,
    status: hasJsonLd ? "pass" : "warning",
    value: hasJsonLd ? "JSON-LD found" : "No schema",
    recommendation: hasJsonLd
      ? "Schema markup detected."
      : "Add JSON-LD schema markup for rich snippets in search results.",
  });

  // 9. Page Speed Analysis
  const speedCheck = SEO_CHECKS.find((c) => c.id === "page_speed")!;
  const pageSizeKB = Math.round(contentLength / 1024);
  let speedStatus: SEOStatus = "pass";
  let speedRecommendation = "Page size and response time are good.";

  if (responseTime > 3000 || pageSizeKB > 3000) {
    speedStatus = "fail";
    speedRecommendation = `Page is slow (${responseTime}ms) or too large (${pageSizeKB}KB). Optimize for faster loading.`;
  } else if (responseTime > 1500 || pageSizeKB > 1500) {
    speedStatus = "warning";
    speedRecommendation = `Page could be faster. Response: ${responseTime}ms, Size: ${pageSizeKB}KB.`;
  }

  checks.push({
    ...speedCheck,
    status: speedStatus,
    value: `${responseTime}ms, ${pageSizeKB}KB`,
    recommendation: speedRecommendation,
  });

  // 10. Mobile Responsiveness
  const mobileCheck = SEO_CHECKS.find((c) => c.id === "mobile")!;
  const hasViewport = html.includes('name="viewport"') || html.includes("name='viewport'");
  checks.push({
    ...mobileCheck,
    status: hasViewport ? "pass" : "fail",
    value: hasViewport ? "Viewport configured" : "Missing viewport",
    recommendation: hasViewport
      ? "Viewport meta tag is configured for mobile devices."
      : "Add a viewport meta tag for mobile responsiveness.",
  });

  // 11. SSL/HTTPS
  const sslCheck = SEO_CHECKS.find((c) => c.id === "ssl")!;
  checks.push({
    ...sslCheck,
    status: isHttps ? "pass" : "fail",
    value: isHttps ? "HTTPS enabled" : "HTTP only",
    recommendation: isHttps
      ? "Site is secured with HTTPS."
      : "Enable HTTPS for security and SEO benefits.",
  });

  // 12. Open Graph Tags
  const ogCheck = SEO_CHECKS.find((c) => c.id === "og_tags")!;
  const ogTitle = getMetaContent("og:title");
  const ogDescription = getMetaContent("og:description");
  const ogImage = getMetaContent("og:image");
  const ogCount = [ogTitle, ogDescription, ogImage].filter(Boolean).length;

  if (ogCount === 0) {
    checks.push({
      ...ogCheck,
      status: "warning",
      value: "No OG tags",
      recommendation: "Add Open Graph tags for better social media sharing.",
    });
  } else if (ogCount < 3) {
    checks.push({
      ...ogCheck,
      status: "warning",
      value: `${ogCount}/3 OG tags`,
      recommendation: "Add missing Open Graph tags (og:title, og:description, og:image).",
    });
  } else {
    checks.push({
      ...ogCheck,
      status: "pass",
      value: "Complete OG tags",
      recommendation: "Open Graph tags are properly configured.",
    });
  }

  // 13. Twitter Cards
  const twitterCheck = SEO_CHECKS.find((c) => c.id === "twitter_cards")!;
  const twitterCard = getMetaContent("twitter:card");
  checks.push({
    ...twitterCheck,
    status: twitterCard ? "pass" : "warning",
    value: twitterCard || "No Twitter card",
    recommendation: twitterCard
      ? "Twitter Card meta tags configured."
      : "Add Twitter Card meta tags for better Twitter sharing.",
  });

  // 14. Canonical URL
  const canonicalCheck = SEO_CHECKS.find((c) => c.id === "canonical")!;
  const hasCanonical = html.includes('rel="canonical"') || html.includes("rel='canonical'");
  checks.push({
    ...canonicalCheck,
    status: hasCanonical ? "pass" : "warning",
    value: hasCanonical ? "Canonical set" : "No canonical",
    recommendation: hasCanonical
      ? "Canonical URL is configured."
      : "Add a canonical tag to prevent duplicate content issues.",
  });

  // 15. Robots.txt (we can't check this from HTML, so we'll mark as info)
  const robotsCheck = SEO_CHECKS.find((c) => c.id === "robots_txt")!;
  checks.push({
    ...robotsCheck,
    status: "pass",
    value: "Check manually",
    recommendation: `Verify robots.txt at ${url.origin}/robots.txt`,
  });

  // 16. Sitemap Detection (we can't check this from HTML, so we'll mark as info)
  const sitemapCheck = SEO_CHECKS.find((c) => c.id === "sitemap")!;
  checks.push({
    ...sitemapCheck,
    status: "pass",
    value: "Check manually",
    recommendation: `Verify sitemap at ${url.origin}/sitemap.xml`,
  });

  // 17. URL Structure
  const urlCheck = SEO_CHECKS.find((c) => c.id === "url_structure")!;
  const pathParts = url.pathname.split("/").filter(Boolean);
  const hasSpecialChars = /[^a-zA-Z0-9\-/]/.test(url.pathname);
  const isClean = !hasSpecialChars && pathParts.every((p) => p.length < 50);

  checks.push({
    ...urlCheck,
    status: isClean ? "pass" : "warning",
    value: url.pathname || "/",
    recommendation: isClean
      ? "URL structure is SEO-friendly."
      : "Consider using cleaner URLs without special characters or excessive length.",
  });

  // 18. Content Analysis
  const contentCheck = SEO_CHECKS.find((c) => c.id === "content")!;
  // Remove HTML tags and count words
  const textContent = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = textContent.split(" ").filter((w) => w.length > 2).length;

  if (wordCount < 300) {
    checks.push({
      ...contentCheck,
      status: "warning",
      value: `${wordCount} words`,
      recommendation: "Content is thin. Aim for at least 300+ words for better SEO.",
    });
  } else if (wordCount < 1000) {
    checks.push({
      ...contentCheck,
      status: "pass",
      value: `${wordCount} words`,
      recommendation: "Content length is acceptable. Consider expanding for competitive topics.",
    });
  } else {
    checks.push({
      ...contentCheck,
      status: "pass",
      value: `${wordCount} words`,
      recommendation: "Good content length for SEO.",
    });
  }

  // 19. Accessibility
  const a11yCheck = SEO_CHECKS.find((c) => c.id === "accessibility")!;
  const hasLang = html.includes('lang="') || html.includes("lang='");
  const hasAriaLabels = html.includes("aria-label");
  let a11yStatus: SEOStatus = "pass";
  const a11yValue = [];

  if (hasLang) a11yValue.push("lang");
  if (hasAriaLabels) a11yValue.push("aria-labels");
  if (imagesWithoutAlt.length === 0 && images.length > 0) a11yValue.push("alt text");

  if (!hasLang) a11yStatus = "warning";

  checks.push({
    ...a11yCheck,
    status: a11yStatus,
    value: a11yValue.length > 0 ? a11yValue.join(", ") : "Needs improvement",
    recommendation: hasLang
      ? "Basic accessibility features present."
      : "Add lang attribute to html tag for accessibility.",
  });

  // 20. Meta Robots
  const metaRobotsCheck = SEO_CHECKS.find((c) => c.id === "meta_robots")!;
  const robotsContent = getMetaContent("robots");
  const hasNoindex = robotsContent?.toLowerCase().includes("noindex");

  if (hasNoindex) {
    checks.push({
      ...metaRobotsCheck,
      status: "fail",
      value: "noindex found",
      recommendation: "Page has noindex directive. Remove it if you want the page indexed.",
    });
  } else {
    checks.push({
      ...metaRobotsCheck,
      status: "pass",
      value: robotsContent || "Not set (default: index)",
      recommendation: "Page is indexable by search engines.",
    });
  }

  // 21. Hreflang Tags
  const hreflangCheck = SEO_CHECKS.find((c) => c.id === "hreflang")!;
  const hasHreflang = html.includes("hreflang=");
  checks.push({
    ...hreflangCheck,
    status: "pass",
    value: hasHreflang ? "Hreflang configured" : "Not needed",
    recommendation: hasHreflang
      ? "Hreflang tags configured for international SEO."
      : "Add hreflang tags if you have multi-language content.",
  });

  // 22. Favicon Detection
  const faviconCheck = SEO_CHECKS.find((c) => c.id === "favicon")!;
  const hasFavicon = html.includes('rel="icon"') ||
                    html.includes("rel='icon'") ||
                    html.includes('rel="shortcut icon"');
  const hasAppleIcon = html.includes("apple-touch-icon");

  checks.push({
    ...faviconCheck,
    status: hasFavicon ? "pass" : "warning",
    value: hasFavicon
      ? hasAppleIcon
        ? "Favicon + Apple icon"
        : "Favicon found"
      : "No favicon",
    recommendation: hasFavicon
      ? "Favicon is configured."
      : "Add a favicon for better branding.",
  });

  // 23. Lazy Loading
  const lazyCheck = SEO_CHECKS.find((c) => c.id === "lazy_loading")!;
  const hasLazyLoading = html.includes('loading="lazy"') || html.includes("loading='lazy'");
  checks.push({
    ...lazyCheck,
    status: hasLazyLoading || images.length === 0 ? "pass" : "warning",
    value: hasLazyLoading ? "Lazy loading enabled" : "Not implemented",
    recommendation: hasLazyLoading
      ? "Images use lazy loading."
      : "Consider adding loading='lazy' to images for better performance.",
  });

  // 24. Doctype Validation
  const doctypeCheck = SEO_CHECKS.find((c) => c.id === "doctype")!;
  const hasDoctype = html.toLowerCase().trim().startsWith("<!doctype html");
  checks.push({
    ...doctypeCheck,
    status: hasDoctype ? "pass" : "warning",
    value: hasDoctype ? "HTML5 DOCTYPE" : "Missing DOCTYPE",
    recommendation: hasDoctype
      ? "HTML5 DOCTYPE is declared."
      : "Add <!DOCTYPE html> at the beginning of your HTML.",
  });

  // 25. Character Encoding
  const charsetCheck = SEO_CHECKS.find((c) => c.id === "charset")!;
  const hasCharset = html.includes('charset="utf-8"') ||
                    html.includes("charset='utf-8'") ||
                    html.toLowerCase().includes('charset="utf-8"');
  checks.push({
    ...charsetCheck,
    status: hasCharset ? "pass" : "warning",
    value: hasCharset ? "UTF-8" : "Not specified",
    recommendation: hasCharset
      ? "UTF-8 encoding is declared."
      : "Add <meta charset='utf-8'> for proper character encoding.",
  });

  // 26. Keywords in URL
  const keywordsUrlCheck = SEO_CHECKS.find((c) => c.id === "keywords_in_url")!;
  const titleWords = (title || "")
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const urlLower = url.pathname.toLowerCase();
  const keywordsInUrl = titleWords.filter((w) => urlLower.includes(w));

  checks.push({
    ...keywordsUrlCheck,
    status: keywordsInUrl.length > 0 ? "pass" : "warning",
    value:
      keywordsInUrl.length > 0
        ? `${keywordsInUrl.length} keywords found`
        : "No keywords",
    recommendation:
      keywordsInUrl.length > 0
        ? "URL contains relevant keywords from title."
        : "Consider including keywords from your title in the URL.",
  });

  // 27. Social Image Size
  const socialImageCheck = SEO_CHECKS.find((c) => c.id === "social_image_size")!;
  const ogImageUrl = getMetaContent("og:image");
  checks.push({
    ...socialImageCheck,
    status: ogImageUrl ? "pass" : "warning",
    value: ogImageUrl ? "Image set" : "No image",
    recommendation: ogImageUrl
      ? "Social sharing image is configured. Recommended size: 1200x630px."
      : "Add an og:image meta tag for social sharing.",
  });

  return checks;
}

function calculateScore(checks: SEOCheck[]): number {
  let totalWeight = 0;
  let earnedPoints = 0;

  for (const check of checks) {
    let weight = 1;
    if (check.impact === "critical") weight = 3;
    else if (check.impact === "warning") weight = 2;

    totalWeight += weight;

    if (check.status === "pass") {
      earnedPoints += weight;
    } else if (check.status === "warning") {
      earnedPoints += weight * 0.5;
    }
    // fail = 0 points
  }

  return Math.round((earnedPoints / totalWeight) * 100);
}
