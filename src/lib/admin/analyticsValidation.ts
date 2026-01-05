// Zod validation schemas for analytics data
import { z } from "zod";

// ============================================
// RATE LIMITING
// ============================================

const RATE_LIMIT_KEY = "analytics_rate_limit";
const RATE_LIMIT_WINDOW_MS = 1000; // 1 second
const MAX_REQUESTS_PER_WINDOW = 2;

interface RateLimitState {
  count: number;
  windowStart: number;
}

// Check if rate limit is exceeded
export const isRateLimited = (): boolean => {
  try {
    const now = Date.now();
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    
    if (!stored) {
      // First request - initialize
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
        count: 1,
        windowStart: now,
      }));
      return false;
    }
    
    const state: RateLimitState = JSON.parse(stored);
    
    // Check if we're in a new window
    if (now - state.windowStart > RATE_LIMIT_WINDOW_MS) {
      // Reset window
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
        count: 1,
        windowStart: now,
      }));
      return false;
    }
    
    // Check if we've exceeded the limit
    if (state.count >= MAX_REQUESTS_PER_WINDOW) {
      return true;
    }
    
    // Increment counter
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
      count: state.count + 1,
      windowStart: state.windowStart,
    }));
    return false;
  } catch {
    // On error, allow the request
    return false;
  }
};

// ============================================
// VALIDATION SCHEMAS
// ============================================

// Device type enum
const deviceTypeSchema = z.enum(["desktop", "tablet", "mobile"]);

// Safe string with length limit
const safeString = (maxLength: number) => 
  z.string()
    .max(maxLength)
    .transform((val) => val.replace(/<[^>]*>/g, "").trim());

// Safe path (alphanumeric, /, -, _, .)
const safePathSchema = z.string()
  .max(500)
  .transform((val) => val.replace(/[^a-zA-Z0-9\-_./]/g, "").trim() || "/");

// Page view data schema
export const pageViewSchema = z.object({
  visitorId: z.string().max(100),
  sessionId: z.string().max(100),
  page: safePathSchema,
  pagePath: safePathSchema,
  pageTitle: safeString(200),
  deviceType: deviceTypeSchema,
  country: z.string().max(100).transform((val) => val.replace(/[^a-zA-Z0-9_]/g, "_")),
  region: z.string().max(100).transform((val) => val.replace(/[^a-zA-Z0-9_]/g, "_")),
  trafficSource: z.string().max(100).transform((val) => val.replace(/[^a-zA-Z0-9.-]/g, "")),
  isNewVisitor: z.boolean(),
  date: z.string().max(20),
});

// User activity schema
export const userActivitySchema = z.object({
  userId: z.string().min(1).max(128),
  pagePath: safePathSchema,
  pageTitle: safeString(200),
});

// Activity item schema for activity arrays
export const activityItemSchema = z.object({
  pagePath: safePathSchema,
  pageTitle: safeString(200),
});

// Daily stats update schema
export const dailyStatsSchema = z.object({
  date: z.string().max(20),
  pageViews: z.number().int().min(0).max(1000000),
  deviceType: deviceTypeSchema,
  country: z.string().max(100),
  trafficSource: z.string().max(100),
  isNewVisitor: z.boolean(),
  isNewSession: z.boolean(),
});

// Visitor data schema
export const visitorSchema = z.object({
  visitorId: z.string().max(100),
  deviceType: deviceTypeSchema,
  country: z.string().max(100),
  region: z.string().max(100),
  totalVisits: z.number().int().min(1).max(1000000),
});

// ============================================
// VALIDATION HELPERS
// ============================================

export const validatePageView = (data: unknown) => {
  return pageViewSchema.safeParse(data);
};

export const validateUserActivity = (data: unknown) => {
  return userActivitySchema.safeParse(data);
};

export const formatValidationError = (error: z.ZodError): string => {
  return error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
};

// Type exports
export type PageViewData = z.infer<typeof pageViewSchema>;
export type UserActivityData = z.infer<typeof userActivitySchema>;
export type ActivityItemData = z.infer<typeof activityItemSchema>;
