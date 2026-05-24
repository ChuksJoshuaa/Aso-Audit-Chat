import { z } from "zod";

export const AppMetadataSchema = z.object({
  name: z.string(),
  developer: z.string(),
  icon: z.string().url().optional(),
  category: z.string(),
  country: z.string(),
  appId: z.string(),
  url: z.string().url(),
  price: z.string().optional(),
  rating: z.number().optional(),
  ratingsCount: z.number().optional(),
});

export type AppMetadata = z.infer<typeof AppMetadataSchema>;

export const AppDetailsSchema = z.object({
  metadata: AppMetadataSchema,
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  whatsNew: z.string().optional(),
  version: z.string().optional(),
  screenshots: z.array(z.string().url()),
  previewVideos: z.array(z.string().url()),
  rating: z.number().optional(),
  ratingsCount: z.number().optional(),
  recentReviews: z.array(
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
  developerUrl: z.string().url().optional(),
  privacyPolicyUrl: z.string().url().optional(),
});

export type AppDetails = z.infer<typeof AppDetailsSchema>;

export const AuditScoreSchema = z.object({
  dimension: z.string(),
  score: z.number().min(0).max(10),
  weight: z.number(),
  weightedScore: z.number(),
  findings: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export type AuditScore = z.infer<typeof AuditScoreSchema>;

export const AuditResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  scores: z.array(AuditScoreSchema),
  quickWins: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      before: z.string().optional(),
      after: z.string().optional(),
      impact: z.enum(["high", "medium", "low"]),
    })
  ),
  highImpactChanges: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      before: z.string().optional(),
      after: z.string().optional(),
      effort: z.enum(["high", "medium", "low"]),
    })
  ),
  strategicRecommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      rationale: z.string(),
    })
  ),
  competitorComparison: z.array(
    z.object({
      name: z.string(),
      rating: z.number().optional(),
      ratingsCount: z.number().optional(),
      keyStrengths: z.array(z.string()),
      keyWeaknesses: z.array(z.string()),
    })
  ),
});

export type AuditResult = z.infer<typeof AuditResultSchema>;

export const ConversationStateSchema = z.object({
  stage: z.enum(["initial", "confirming", "auditing", "complete"]),
  appMetadata: AppMetadataSchema.optional(),
  appDetails: AppDetailsSchema.optional(),
  auditResult: AuditResultSchema.optional(),
});

export type ConversationState = z.infer<typeof ConversationStateSchema>;
