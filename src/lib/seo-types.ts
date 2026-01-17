// SEO Analysis Types

export type SEOStatus = "pass" | "warning" | "fail";

export interface SEOCheck {
  id: string;
  name: string;
  description: string;
  status: SEOStatus;
  value: string | number | null;
  recommendation: string;
  impact: "critical" | "warning" | "info";
  category: SEOCategory;
}

export type SEOCategory =
  | "meta"
  | "content"
  | "technical"
  | "social"
  | "performance"
  | "accessibility";

export interface SEOReport {
  url: string;
  domain: string;
  overallScore: number;
  timestamp: string;
  checks: SEOCheck[];
  summary: {
    critical: number;
    warnings: number;
    passed: number;
  };
}

export interface BulkScanResult {
  url: string;
  score: number;
  status: "completed" | "failed" | "pending";
  error?: string;
  report?: SEOReport;
}

export interface URLCompareResult {
  url1: SEOReport;
  url2: SEOReport;
  differences: {
    checkId: string;
    url1Status: SEOStatus;
    url2Status: SEOStatus;
  }[];
}

export interface SchemaType {
  type: string;
  label: string;
  description: string;
  fields: SchemaField[];
}

export interface SchemaField {
  name: string;
  type: "text" | "url" | "date" | "number" | "select" | "textarea";
  label: string;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface SERPPreview {
  title: string;
  description: string;
  url: string;
  favicon?: string;
}

// SEO Check definitions
export const SEO_CHECKS = [
  {
    id: "title",
    name: "Title Tag Analysis",
    description:
      "Check length, keyword placement, and truncation issues. Your title is the #1 on-page factor.",
    category: "meta" as SEOCategory,
    impact: "critical" as const,
  },
  {
    id: "meta_description",
    name: "Meta Description",
    description:
      "Analyze description length and quality. A compelling meta description increases click-through rates.",
    category: "meta" as SEOCategory,
    impact: "critical" as const,
  },
  {
    id: "h1",
    name: "H1 Structure",
    description:
      "Verify you have exactly one H1 tag with your primary keyword. Essential for content hierarchy.",
    category: "content" as SEOCategory,
    impact: "critical" as const,
  },
  {
    id: "heading_hierarchy",
    name: "Heading Hierarchy",
    description:
      "Verify proper H1-H6 structure. Logical heading order improves SEO and accessibility.",
    category: "content" as SEOCategory,
    impact: "warning" as const,
  },
  {
    id: "internal_links",
    name: "Internal Links",
    description:
      "Count and analyze internal linking. Good internal links help Google discover and rank your pages.",
    category: "content" as SEOCategory,
    impact: "warning" as const,
  },
  {
    id: "external_links",
    name: "External Links",
    description:
      "Analyze outbound links and nofollow usage. External links to authority sites boost credibility.",
    category: "content" as SEOCategory,
    impact: "info" as const,
  },
  {
    id: "images",
    name: "Image Optimization",
    description:
      "Check for missing alt text and outdated formats. Images impact both SEO and page speed.",
    category: "content" as SEOCategory,
    impact: "warning" as const,
  },
  {
    id: "schema",
    name: "Schema Markup",
    description:
      "Detect JSON-LD structured data. Schema can enable rich snippets in search results.",
    category: "technical" as SEOCategory,
    impact: "warning" as const,
  },
  {
    id: "page_speed",
    name: "Page Speed Analysis",
    description:
      "Analyze page size and load performance. Fast pages rank higher and provide better user experience.",
    category: "performance" as SEOCategory,
    impact: "critical" as const,
  },
  {
    id: "mobile",
    name: "Mobile Responsiveness",
    description:
      "Check viewport configuration and mobile-friendliness. Google prioritizes mobile-optimized sites.",
    category: "technical" as SEOCategory,
    impact: "critical" as const,
  },
  {
    id: "ssl",
    name: "SSL/HTTPS Check",
    description:
      "Verify secure connection. HTTPS is required for modern SEO and user trust.",
    category: "technical" as SEOCategory,
    impact: "critical" as const,
  },
  {
    id: "og_tags",
    name: "Open Graph Tags",
    description:
      "Analyze social media optimization. Complete OG tags improve appearance when shared.",
    category: "social" as SEOCategory,
    impact: "warning" as const,
  },
  {
    id: "twitter_cards",
    name: "Twitter Cards",
    description:
      "Check Twitter/X card meta tags for optimal social sharing appearance on the platform.",
    category: "social" as SEOCategory,
    impact: "warning" as const,
  },
  {
    id: "canonical",
    name: "Canonical URL",
    description:
      "Check canonical tag configuration. Prevents duplicate content issues and clarifies preferred URLs.",
    category: "technical" as SEOCategory,
    impact: "critical" as const,
  },
  {
    id: "robots_txt",
    name: "Robots.txt",
    description:
      "Verify robots.txt configuration. Controls which pages search engines can crawl.",
    category: "technical" as SEOCategory,
    impact: "warning" as const,
  },
  {
    id: "sitemap",
    name: "Sitemap Detection",
    description:
      "Check for XML sitemap presence. Sitemaps help search engines discover all your pages.",
    category: "technical" as SEOCategory,
    impact: "warning" as const,
  },
  {
    id: "url_structure",
    name: "URL Structure",
    description:
      "Check URL format and SEO-friendliness. Clean URLs are easier for users and search engines.",
    category: "technical" as SEOCategory,
    impact: "info" as const,
  },
  {
    id: "content",
    name: "Content Analysis",
    description:
      "Analyze word count, readability, and content quality. Comprehensive content ranks better.",
    category: "content" as SEOCategory,
    impact: "warning" as const,
  },
  {
    id: "accessibility",
    name: "Accessibility Checks",
    description:
      "Basic accessibility analysis including alt text, lang attributes, and ARIA labels.",
    category: "accessibility" as SEOCategory,
    impact: "warning" as const,
  },
  {
    id: "meta_robots",
    name: "Meta Robots",
    description:
      "Check for noindex/nofollow directives that might block search engines from your content.",
    category: "technical" as SEOCategory,
    impact: "critical" as const,
  },
  {
    id: "hreflang",
    name: "Hreflang Tags",
    description:
      "Verify international SEO setup. Hreflang helps serve the right language to users.",
    category: "technical" as SEOCategory,
    impact: "info" as const,
  },
  {
    id: "favicon",
    name: "Favicon Detection",
    description:
      "Check for favicon and Apple touch icons. Proper branding across browsers and bookmarks.",
    category: "technical" as SEOCategory,
    impact: "info" as const,
  },
  {
    id: "lazy_loading",
    name: "Lazy Loading",
    description:
      "Analyze image lazy loading implementation. Improves page speed and Core Web Vitals.",
    category: "performance" as SEOCategory,
    impact: "info" as const,
  },
  {
    id: "doctype",
    name: "Doctype Validation",
    description:
      "Verify HTML5 DOCTYPE declaration. Ensures proper browser rendering mode.",
    category: "technical" as SEOCategory,
    impact: "info" as const,
  },
  {
    id: "charset",
    name: "Character Encoding",
    description:
      "Check UTF-8 encoding declaration. Prevents character display issues across languages.",
    category: "technical" as SEOCategory,
    impact: "info" as const,
  },
  {
    id: "keywords_in_url",
    name: "Keywords in URL",
    description:
      "Check if URL contains relevant keywords from title. Keyword-rich URLs aid SEO.",
    category: "technical" as SEOCategory,
    impact: "info" as const,
  },
  {
    id: "social_image_size",
    name: "Social Image Size",
    description:
      "Verify OG/Twitter image dimensions. Properly sized images look better when shared.",
    category: "social" as SEOCategory,
    impact: "info" as const,
  },
] as const;

// Schema types for the generator
export const SCHEMA_TYPES: SchemaType[] = [
  {
    type: "Organization",
    label: "Organization",
    description: "Describe your organization for search engines",
    fields: [
      {
        name: "name",
        type: "text",
        label: "Organization Name",
        required: true,
        placeholder: "Acme Inc.",
      },
      {
        name: "url",
        type: "url",
        label: "Website URL",
        required: true,
        placeholder: "https://example.com",
      },
      {
        name: "logo",
        type: "url",
        label: "Logo URL",
        required: false,
        placeholder: "https://example.com/logo.png",
      },
      {
        name: "description",
        type: "textarea",
        label: "Description",
        required: false,
        placeholder: "A brief description of your organization",
      },
    ],
  },
  {
    type: "Article",
    label: "Article",
    description: "Mark up blog posts and news articles",
    fields: [
      {
        name: "headline",
        type: "text",
        label: "Headline",
        required: true,
        placeholder: "Article Title",
      },
      {
        name: "author",
        type: "text",
        label: "Author Name",
        required: true,
        placeholder: "John Doe",
      },
      {
        name: "datePublished",
        type: "date",
        label: "Date Published",
        required: true,
      },
      {
        name: "image",
        type: "url",
        label: "Image URL",
        required: false,
        placeholder: "https://example.com/image.jpg",
      },
      {
        name: "description",
        type: "textarea",
        label: "Description",
        required: false,
        placeholder: "A brief summary of the article",
      },
    ],
  },
  {
    type: "Product",
    label: "Product",
    description: "Describe products for rich snippets",
    fields: [
      {
        name: "name",
        type: "text",
        label: "Product Name",
        required: true,
        placeholder: "Amazing Widget",
      },
      {
        name: "description",
        type: "textarea",
        label: "Description",
        required: true,
        placeholder: "A great product description",
      },
      {
        name: "image",
        type: "url",
        label: "Image URL",
        required: false,
        placeholder: "https://example.com/product.jpg",
      },
      {
        name: "price",
        type: "number",
        label: "Price",
        required: false,
        placeholder: "29.99",
      },
      {
        name: "currency",
        type: "text",
        label: "Currency",
        required: false,
        placeholder: "USD",
      },
    ],
  },
  {
    type: "LocalBusiness",
    label: "Local Business",
    description: "Mark up local business information",
    fields: [
      {
        name: "name",
        type: "text",
        label: "Business Name",
        required: true,
        placeholder: "Joe's Coffee Shop",
      },
      {
        name: "address",
        type: "text",
        label: "Address",
        required: true,
        placeholder: "123 Main St, City, State",
      },
      {
        name: "telephone",
        type: "text",
        label: "Phone Number",
        required: false,
        placeholder: "+1-234-567-8900",
      },
      {
        name: "url",
        type: "url",
        label: "Website URL",
        required: false,
        placeholder: "https://example.com",
      },
    ],
  },
  {
    type: "FAQPage",
    label: "FAQ Page",
    description: "Mark up FAQ content for rich results",
    fields: [
      {
        name: "questions",
        type: "textarea",
        label: "Questions & Answers (JSON format)",
        required: true,
        placeholder:
          '[{"question": "What is...?", "answer": "It is..."}]',
      },
    ],
  },
  {
    type: "BreadcrumbList",
    label: "Breadcrumb",
    description: "Add breadcrumb navigation markup",
    fields: [
      {
        name: "items",
        type: "textarea",
        label: "Breadcrumb Items (JSON format)",
        required: true,
        placeholder:
          '[{"name": "Home", "url": "/"}, {"name": "Products", "url": "/products"}]',
      },
    ],
  },
];
