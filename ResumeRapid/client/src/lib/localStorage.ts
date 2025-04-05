import { type Resume, type PersonalInfo, type EducationItem, type ExperienceItem, type ProjectItem } from "@shared/schema";

const STORAGE_KEY = "resumeBuilder";

export interface SavedResumeData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  projects: ProjectItem[];
  templateStyle: string;
  colorScheme: string;
  isAtsOptimized: boolean;
  targetRole?: string;
  lastUpdated: number;
}

export function saveResumeToLocalStorage(data: Partial<Resume>): void {
  const currentData = getResumeFromLocalStorage();
  const updatedData: SavedResumeData = {
    personalInfo: {
      ...currentData.personalInfo,
      ...(data.personalInfo || {})
    },
    education: data.education || currentData.education,
    experience: data.experience || currentData.experience,
    skills: data.skills || currentData.skills,
    projects: data.projects || currentData.projects,
    templateStyle: data.templateStyle || currentData.templateStyle,
    colorScheme: data.colorScheme || currentData.colorScheme,
    isAtsOptimized: data.isAtsOptimized ?? currentData.isAtsOptimized,
    targetRole: data.targetRole || currentData.targetRole,
    lastUpdated: Date.now()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
}

export function getResumeFromLocalStorage(): SavedResumeData {
  const defaultData: SavedResumeData = {
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      summary: "",
      website: "",
      linkedin: ""
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    templateStyle: "professional",
    colorScheme: "blue",
    isAtsOptimized: true,
    targetRole: "",
    lastUpdated: 0
  };
  
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return defaultData;
    
    const parsedData = JSON.parse(savedData) as SavedResumeData;
    return {
      ...defaultData,
      ...parsedData
    };
  } catch (error) {
    console.error("Error loading resume data from localStorage:", error);
    return defaultData;
  }
}

export function clearResumeFromLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
