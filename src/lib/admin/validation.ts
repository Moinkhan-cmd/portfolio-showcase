// Zod validation schemas for admin forms
import { z } from "zod";

// Safe URL regex - only allow http:// and https:// protocols
const safeUrlRegex = /^https?:\/\//;

// URL validator that ensures only safe protocols
const safeUrl = z.string()
  .url({ message: "Invalid URL format" })
  .refine((url) => safeUrlRegex.test(url), {
    message: "URL must start with http:// or https://",
  });

// Optional safe URL
const optionalSafeUrl = z.string()
  .refine((url) => !url || safeUrlRegex.test(url), {
    message: "URL must start with http:// or https://",
  })
  .optional()
  .or(z.literal(""));

// Project validation schema
export const projectSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  shortDescription: z.string()
    .trim()
    .min(1, { message: "Short description is required" })
    .max(500, { message: "Short description must be less than 500 characters" }),
  fullDescription: z.string()
    .trim()
    .min(1, { message: "Full description is required" })
    .max(5000, { message: "Full description must be less than 5000 characters" }),
  category: z.string()
    .trim()
    .min(1, { message: "Category is required" })
    .max(100, { message: "Category must be less than 100 characters" }),
  techStack: z.array(
    z.string().trim().max(50, { message: "Tech stack item must be less than 50 characters" })
  ).max(20, { message: "Maximum 20 tech stack items allowed" }),
  thumbnail: optionalSafeUrl,
  images: z.array(
    z.string().refine((url) => !url || safeUrlRegex.test(url), {
      message: "Image URL must start with http:// or https://",
    })
  ).max(10, { message: "Maximum 10 images allowed" }),
  liveUrl: optionalSafeUrl,
  githubUrl: optionalSafeUrl,
  status: z.enum(["completed", "in-progress"]),
  featured: z.boolean(),
});

// Certification validation schema
export const certificationSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  issuer: z.string()
    .trim()
    .min(1, { message: "Issuer is required" })
    .max(200, { message: "Issuer must be less than 200 characters" }),
  issueDate: z.string()
    .min(1, { message: "Issue date is required" })
    .max(50, { message: "Issue date must be valid" }),
  credentialUrl: optionalSafeUrl,
  imageUrl: optionalSafeUrl,
  description: z.string()
    .trim()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .optional()
    .or(z.literal("")),
});

// Experience validation schema
export const experienceSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Job title is required" })
    .max(200, { message: "Job title must be less than 200 characters" }),
  company: z.string()
    .trim()
    .min(1, { message: "Company is required" })
    .max(200, { message: "Company must be less than 200 characters" }),
  startDate: z.string()
    .min(1, { message: "Start date is required" })
    .max(50, { message: "Start date must be valid" }),
  endDate: z.string()
    .max(50, { message: "End date must be valid" })
    .optional()
    .or(z.literal("")),
  current: z.boolean(),
  workType: z.enum(["remote", "onsite", "hybrid"]),
  location: z.string()
    .trim()
    .max(200, { message: "Location must be less than 200 characters" })
    .optional()
    .or(z.literal("")),
  responsibilities: z.array(
    z.string().trim().max(500, { message: "Responsibility must be less than 500 characters" })
  ).max(20, { message: "Maximum 20 responsibilities allowed" }),
  skills: z.array(
    z.string().trim().max(50, { message: "Skill must be less than 50 characters" })
  ).max(30, { message: "Maximum 30 skills allowed" }),
});

// Skill validation schema
export const skillSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Skill name is required" })
    .max(100, { message: "Skill name must be less than 100 characters" }),
  category: z.string()
    .trim()
    .min(1, { message: "Category is required" })
    .max(100, { message: "Category must be less than 100 characters" }),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
  icon: z.string()
    .trim()
    .max(50, { message: "Icon must be less than 50 characters" })
    .optional()
    .or(z.literal("")),
});

// Helper function to format Zod errors
export const formatZodError = (error: z.ZodError): string => {
  return error.errors.map((err) => err.message).join(", ");
};

// Type exports
export type ProjectFormData = z.infer<typeof projectSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
