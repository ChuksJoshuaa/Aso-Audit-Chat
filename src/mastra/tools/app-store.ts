import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import Firecrawl from "@mendable/firecrawl-js";
import { AppMetadataSchema, AppDetailsSchema } from "../types";

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const APP_STORE_URL_PATTERN =
  /^https?:\/\/apps\.apple\.com\/([a-z]{2})\/app\/([^/]+)\/id(\d+)/i;

function parseAppStoreUrl(url: string): {
  country: string;
  slug: string;
  appId: string;
} | null {
  const match = url.match(APP_STORE_URL_PATTERN);
  if (!match) return null;
  return {
    country: match[1].toUpperCase(),
    slug: match[2],
    appId: match[3],
  };
}

function isSuccessResponse(
  result: { success: boolean; extract?: unknown }
): result is { success: true; extract: unknown } {
  return result.success === true && "extract" in result;
}

export const validateAppStoreUrl = createTool({
  id: "validate-app-store-url",
  description:
    "Validates an Apple App Store URL and extracts the app ID. Use this first when a user provides an App Store URL.",
  inputSchema: z.object({
    url: z.string().describe("The App Store URL to validate"),
  }),
  outputSchema: z.object({
    valid: z.boolean(),
    appId: z.string().optional(),
    country: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ url }) => {
    const parsed = parseAppStoreUrl(url);
    if (!parsed) {
      return {
        valid: false,
        error:
          "Invalid App Store URL. Expected format: https://apps.apple.com/{country}/app/{app-name}/id{app-id}",
      };
    }
    return {
      valid: true,
      appId: parsed.appId,
      country: parsed.country,
    };
  },
});

export const fetchAppMetadata = createTool({
  id: "fetch-app-metadata",
  description:
    "Fetches basic metadata for an App Store listing (name, developer, icon, category). Use this to confirm the app with the user before running the full audit.",
  inputSchema: z.object({
    url: z.string().url().describe("The App Store URL to fetch metadata from"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    metadata: AppMetadataSchema.optional(),
    error: z.string().optional(),
  }),
  execute: async ({ url }) => {
    const parsed = parseAppStoreUrl(url);
    if (!parsed) {
      return {
        success: false,
        error: "Invalid App Store URL",
      };
    }

    try {
      const result = await firecrawl.scrapeUrl(url, {
        formats: ["extract"],
        extract: {
          schema: z.object({
            appName: z.string(),
            developer: z.string(),
            iconUrl: z.string().optional(),
            category: z.string(),
            price: z.string().optional(),
            rating: z.number().optional(),
            ratingsCount: z.number().optional(),
          }),
          prompt:
            "Extract the app name, developer name, app icon URL, primary category, price (or 'Free'), average rating, and total ratings count from this App Store page.",
        },
      });

      if (!isSuccessResponse(result)) {
        return {
          success: false,
          error: "Firecrawl scraping failed",
        };
      }

      const extracted = result.extract as {
        appName?: string;
        developer?: string;
        iconUrl?: string;
        category?: string;
        price?: string;
        rating?: number;
        ratingsCount?: number;
      };

      if (!extracted?.appName || !extracted?.developer) {
        return {
          success: false,
          error: "Could not extract app metadata from the page",
        };
      }

      return {
        success: true,
        metadata: {
          name: extracted.appName,
          developer: extracted.developer,
          icon: extracted.iconUrl,
          category: extracted.category || "Unknown",
          country: parsed.country,
          appId: parsed.appId,
          url,
          price: extracted.price,
          rating: extracted.rating,
          ratingsCount: extracted.ratingsCount,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        error: `Failed to fetch app metadata: ${message}`,
      };
    }
  },
});

export const fetchAppDetails = createTool({
  id: "fetch-app-details",
  description:
    "Fetches comprehensive details for an App Store listing including description, screenshots, reviews, and all ASO-relevant data. Use this after the user confirms the app to run the full audit.",
  inputSchema: z.object({
    url: z.string().url().describe("The App Store URL to fetch details from"),
    metadata: AppMetadataSchema.describe("Previously fetched app metadata"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    details: AppDetailsSchema.optional(),
    error: z.string().optional(),
  }),
  execute: async ({ url, metadata }) => {
    try {
      const result = await firecrawl.scrapeUrl(url, {
        formats: ["extract", "markdown"],
        extract: {
          schema: z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            description: z.string(),
            whatsNew: z.string().optional(),
            version: z.string().optional(),
            screenshotUrls: z.array(z.string()),
            previewVideoUrls: z.array(z.string()),
            rating: z.number().optional(),
            ratingsCount: z.number().optional(),
            reviews: z.array(
              z.object({
                title: z.string(),
                content: z.string(),
                rating: z.number(),
                author: z.string(),
              })
            ),
            inAppPurchases: z.array(z.string()),
            ageRating: z.string().optional(),
            size: z.string().optional(),
            languages: z.array(z.string()),
            developerUrl: z.string().optional(),
            privacyPolicyUrl: z.string().optional(),
          }),
          prompt: `Extract ALL of the following from this App Store page:
- App title (the main name shown)
- Subtitle (the tagline under the name)
- Full description text
- What's New section content
- Current version number
- All screenshot URLs (look for image URLs in the screenshot gallery)
- All preview video URLs if any
- Average rating and total ratings count
- Up to 10 recent user reviews with title, content, rating, and author
- List of in-app purchases
- Age rating
- App size
- Supported languages
- Developer website URL
- Privacy policy URL`,
        },
      });

      if (!isSuccessResponse(result)) {
        return {
          success: false,
          error: "Firecrawl scraping failed",
        };
      }

      const extracted = result.extract as {
        title?: string;
        subtitle?: string;
        description?: string;
        whatsNew?: string;
        version?: string;
        screenshotUrls?: string[];
        previewVideoUrls?: string[];
        rating?: number;
        ratingsCount?: number;
        reviews?: Array<{
          title: string;
          content: string;
          rating: number;
          author: string;
        }>;
        inAppPurchases?: string[];
        ageRating?: string;
        size?: string;
        languages?: string[];
        developerUrl?: string;
        privacyPolicyUrl?: string;
      };

      if (!extracted?.title || !extracted?.description) {
        return {
          success: false,
          error: "Could not extract app details from the page",
        };
      }

      return {
        success: true,
        details: {
          metadata,
          title: extracted.title,
          subtitle: extracted.subtitle,
          description: extracted.description,
          whatsNew: extracted.whatsNew,
          version: extracted.version,
          screenshots: extracted.screenshotUrls || [],
          previewVideos: extracted.previewVideoUrls || [],
          rating: extracted.rating,
          ratingsCount: extracted.ratingsCount,
          recentReviews: extracted.reviews || [],
          inAppPurchases: extracted.inAppPurchases || [],
          ageRating: extracted.ageRating,
          size: extracted.size,
          languages: extracted.languages || [],
          developerUrl: extracted.developerUrl,
          privacyPolicyUrl: extracted.privacyPolicyUrl,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        error: `Failed to fetch app details: ${message}`,
      };
    }
  },
});

export const searchCompetitors = createTool({
  id: "search-competitors",
  description:
    "Searches for competitor apps in the same category on the App Store. Use this during the audit to gather competitive intelligence.",
  inputSchema: z.object({
    category: z.string().describe("The app category to search in"),
    appName: z.string().describe("The name of the app being audited"),
    country: z
      .string()
      .describe("The country code for the App Store (e.g., US)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    competitors: z
      .array(
        z.object({
          name: z.string(),
          developer: z.string(),
          rating: z.number().optional(),
          ratingsCount: z.number().optional(),
          url: z.string(),
        })
      )
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ category, appName, country }) => {
    try {
      const searchUrl = `https://apps.apple.com/${country.toLowerCase()}/charts/iphone/${encodeURIComponent(category.toLowerCase())}-apps`;

      const result = await firecrawl.scrapeUrl(searchUrl, {
        formats: ["extract"],
        extract: {
          schema: z.object({
            apps: z.array(
              z.object({
                name: z.string(),
                developer: z.string(),
                rating: z.number().optional(),
                ratingsCount: z.number().optional(),
                url: z.string(),
              })
            ),
          }),
          prompt: `Extract the top 5 apps from this App Store category chart, excluding "${appName}". For each app, get: name, developer, rating, ratings count, and App Store URL.`,
        },
      });

      if (!isSuccessResponse(result)) {
        return {
          success: false,
          error: "Firecrawl scraping failed",
          competitors: [],
        };
      }

      const extracted = result.extract as {
        apps?: Array<{
          name: string;
          developer: string;
          rating?: number;
          ratingsCount?: number;
          url: string;
        }>;
      };

      const competitors = (extracted?.apps || [])
        .filter((app) => app.name.toLowerCase() !== appName.toLowerCase())
        .slice(0, 3);

      return {
        success: true,
        competitors,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        error: `Failed to search competitors: ${message}`,
        competitors: [],
      };
    }
  },
});
