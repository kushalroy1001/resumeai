import { 
  users, 
  resumes, 
  type User, 
  type InsertUser, 
  type Resume, 
  type ResumeData,
  type PersonalInfo,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Storage interface
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resume methods
  getResume(id: number): Promise<ResumeData | undefined>;
  getResumesByUserId(userId: number): Promise<ResumeData[]>;
  createResume(data: Partial<ResumeData>): Promise<ResumeData>;
  updateResume(id: number, data: Partial<ResumeData>): Promise<ResumeData | undefined>;
  deleteResume(id: number): Promise<boolean>;
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Resume methods
  async getResume(id: number): Promise<ResumeData | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }

  async getResumesByUserId(userId: number): Promise<ResumeData[]> {
    return await db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  async createResume(data: Partial<ResumeData>): Promise<ResumeData> {
    // Remove atsScore from data if it exists since the column doesn't exist in database
    const { atsScore, ...validData } = data;
    
    console.log("Saving resume data:", validData);
    
    const [resume] = await db
      .insert(resumes)
      .values({
        userId: validData.userId || 1, // Default to user 1 if not provided
        firstName: validData.firstName || null,
        lastName: validData.lastName || null,
        email: validData.email || null,
        phone: validData.phone || null,
        summary: validData.summary || null,
        website: validData.website || null,
        linkedin: validData.linkedin || null,
        education: validData.education || [],
        experience: validData.experience || [],
        skills: validData.skills || [],
        projects: validData.projects || [],
        templateStyle: validData.templateStyle || "professional",
        colorScheme: validData.colorScheme || "blue",
        targetRole: validData.targetRole || null,
        isAtsOptimized: validData.isAtsOptimized || false
      })
      .returning();
    return resume;
  }

  async updateResume(id: number, data: Partial<ResumeData>): Promise<ResumeData | undefined> {
    // Remove id and atsScore from the data
    const { id: _, atsScore, ...validUpdateData } = data;
    
    console.log("Updating resume data:", validUpdateData);
    
    const [updatedResume] = await db
      .update(resumes)
      .set({
        ...validUpdateData,
        updatedAt: new Date()
      })
      .where(eq(resumes.id, id))
      .returning();
    
    return updatedResume;
  }

  async deleteResume(id: number): Promise<boolean> {
    const [deletedResume] = await db
      .delete(resumes)
      .where(eq(resumes.id, id))
      .returning({ id: resumes.id });
    
    return !!deletedResume;
  }
}

// In-Memory Storage Implementation (keeping for reference)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, ResumeData>;
  private userIdCounter: number;
  private resumeIdCounter: number;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.userIdCounter = 1;
    this.resumeIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Resume methods
  async getResume(id: number): Promise<ResumeData | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUserId(userId: number): Promise<ResumeData[]> {
    return Array.from(this.resumes.values()).filter(
      resume => resume.userId === userId
    );
  }

  async createResume(data: Partial<ResumeData>): Promise<ResumeData> {
    const id = this.resumeIdCounter++;
    const now = new Date();
    
    // Create a dummy atsScore value since it's required by the type but not in the DB
    const resume: ResumeData = {
      id,
      userId: data.userId || 1, // Default to user 1 if not provided
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      email: data.email || null,
      phone: data.phone || null,
      summary: data.summary || null,
      website: data.website || null,
      linkedin: data.linkedin || null,
      education: data.education || [],
      experience: data.experience || [],
      skills: data.skills || [],
      projects: data.projects || [],
      templateStyle: data.templateStyle || "professional",
      colorScheme: data.colorScheme || "blue",
      targetRole: data.targetRole || null,
      isAtsOptimized: data.isAtsOptimized || false,
      atsScore: null as any, // This field doesn't exist in the DB but is needed for the type
      createdAt: now,
      updatedAt: now
    };
    
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, data: Partial<ResumeData>): Promise<ResumeData | undefined> {
    const existingResume = this.resumes.get(id);
    
    if (!existingResume) {
      return undefined;
    }
    
    const updatedResume: ResumeData = {
      ...existingResume,
      ...data,
      updatedAt: new Date()
    };
    
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  async deleteResume(id: number): Promise<boolean> {
    return this.resumes.delete(id);
  }
}

// Switch to the database storage implementation
export const storage = new DatabaseStorage();
