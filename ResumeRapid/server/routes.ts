import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { resumeSchema, personalInfoSchema, educationItemSchema, experienceItemSchema, projectItemSchema } from "@shared/schema";

// Simulated Gemini API for ATS optimization
// In a real app, you'd integrate with Google AI SDK
async function optimizeForATS(resumeText: string, targetRole?: string): Promise<{optimizedText: string, atsScore: number}> {
  // This would be replaced with actual Gemini API call using Google AI SDK
  // The Gemini model would analyze the resume and optimize it for the specific role
  
  const roleSpecificText = targetRole 
    ? `\n\n[ATS Optimized for ${targetRole}]\n- Added ${targetRole}-specific keywords\n- Highlighted relevant skills for ${targetRole}\n- Reordered experience to emphasize ${targetRole} qualifications\n- Improved formatting for ATS systems`
    : `\n\n[ATS Optimized]\n- Added relevant keywords\n- Improved formatting\n- Enhanced readability for ATS systems`;
  
  // Generate an ATS score (in a real application, this would be calculated by Gemini API)
  // Score between 65-95 for demonstration
  const atsScore = Math.floor(Math.random() * 31) + 65;
  
  return {
    optimizedText: `${resumeText}${roleSpecificText}`,
    atsScore
  };
}

// Simulated Gemini API for cover letter generation
async function generateCoverLetter(resumeText: string, targetRole: string, companyName?: string): Promise<string> {
  // This would be replaced with actual Gemini API call
  // The Gemini model would analyze the resume and generate a tailored cover letter for the specific role and company
  
  const greeting = companyName 
    ? `Dear ${companyName} Hiring Team,`
    : "Dear Hiring Manager,";
    
  const introduction = targetRole 
    ? `I am writing to express my interest in the ${targetRole} position.`
    : "I am writing to express my interest in the open position at your company.";
    
  const body = `After reviewing the job description, I believe my skills and experience make me a strong candidate. My background has prepared me for the challenges of this role, and I am excited about the opportunity to contribute to your team.

Based on my resume, I have relevant experience that aligns with your requirements. My approach combines technical expertise with a strong work ethic, which enables me to deliver high-quality results consistently.`;

  const closing = companyName 
    ? `I am particularly drawn to ${companyName} because of your reputation for innovation and excellence in the industry. I would welcome the opportunity to discuss how my qualifications align with your needs.`
    : `I would welcome the opportunity to discuss how my qualifications align with your needs for this position.`;
    
  return `${greeting}

${introduction}

${body}

${closing}

Thank you for considering my application. I look forward to the possibility of working with your team.

Sincerely,
[Your Name]`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Get all resumes (would typically require auth)
  app.get("/api/resumes", async (req, res) => {
    try {
      // In a real application with auth, you'd get userId from the session
      const userId = 1; // Simulated userId
      const resumes = await storage.getResumesByUserId(userId);
      res.json(resumes);
    } catch (error: any) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
    }
  });

  // Get a specific resume
  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }

      const resume = await storage.getResume(id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      res.json(resume);
    } catch (error: any) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume", error: error.message });
    }
  });

  // Create a new resume
  app.post("/api/resumes", async (req, res) => {
    try {
      // In a real app with auth, get userId from session
      const userId = 1; // Simulated userId
      
      console.log("Resume data received:", req.body);
      
      const newResume = await storage.createResume({
        userId,
        ...req.body
      });
      
      res.status(201).json(newResume);
    } catch (error: any) {
      console.error("Error creating resume:", error);
      res.status(500).json({ message: "Failed to create resume", error: error.message });
    }
  });

  // Update a resume
  app.put("/api/resumes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }

      const updatedResume = await storage.updateResume(id, req.body);
      if (!updatedResume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      res.json(updatedResume);
    } catch (error: any) {
      console.error("Error updating resume:", error);
      res.status(500).json({ message: "Failed to update resume", error: error.message });
    }
  });

  // Delete a resume
  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }

      const success = await storage.deleteResume(id);
      if (!success) {
        return res.status(404).json({ message: "Resume not found" });
      }

      res.status(204).end();
    } catch (error: any) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume", error: error.message });
    }
  });

  // ATS Optimization endpoint
  app.post("/api/optimize-resume", async (req, res) => {
    try {
      const { resumeText, targetRole } = req.body;
      
      if (!resumeText || typeof resumeText !== 'string') {
        return res.status(400).json({ message: "Resume text is required" });
      }
      
      const result = await optimizeForATS(resumeText, targetRole);
      res.json({ 
        optimizedText: result.optimizedText,
        atsScore: result.atsScore
      });
    } catch (error: any) {
      console.error("Error optimizing resume:", error);
      res.status(500).json({ message: "Failed to optimize resume", error: error.message });
    }
  });

  // Cover Letter Generation endpoint
  app.post("/api/generate-cover-letter", async (req, res) => {
    try {
      const { resumeText, targetRole, companyName } = req.body;
      
      if (!resumeText || typeof resumeText !== 'string') {
        return res.status(400).json({ message: "Resume text is required" });
      }
      
      if (!targetRole || typeof targetRole !== 'string') {
        return res.status(400).json({ message: "Target role is required" });
      }
      
      const coverLetter = await generateCoverLetter(resumeText, targetRole, companyName);
      res.json({ coverLetter });
    } catch (error: any) {
      console.error("Error generating cover letter:", error);
      res.status(500).json({ message: "Failed to generate cover letter", error: error.message });
    }
  });

  return httpServer;
}
