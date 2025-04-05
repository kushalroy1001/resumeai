import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Resume schema
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().default(1),
  
  // Personal information
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  summary: text("summary"),
  website: text("website"),
  linkedin: text("linkedin"),
  
  // Education, Experience, Skills, and Projects are stored as JSON
  education: jsonb("education").default([]),
  experience: jsonb("experience").default([]),
  skills: jsonb("skills").default([]),
  projects: jsonb("projects").default([]),
  
  // Resume options
  templateStyle: text("template_style").default("professional"),
  colorScheme: text("color_scheme").default("blue"),
  
  // Additional fields for ATS optimization
  targetRole: text("target_role"),
  isAtsOptimized: boolean("is_ats_optimized").default(false),
  atsScore: integer("ats_score"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  summary: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
});

export const educationItemSchema = z.object({
  id: z.string(),
  school: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
  current: z.boolean().optional(),
});

export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
  current: z.boolean().optional(),
});

export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  technologies: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  education: z.array(educationItemSchema),
  experience: z.array(experienceItemSchema),
  skills: z.array(z.string()),
  projects: z.array(projectItemSchema),
  templateStyle: z.string().optional(),
  colorScheme: z.string().optional(),
  isAtsOptimized: z.boolean().optional(),
  targetRole: z.string().optional(),
  atsScore: z.number().optional(),
});

export const insertResumeSchema = createInsertSchema(resumes);

// Types
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type ResumeData = typeof resumes.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
