import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FormTabs from "@/components/ResumeBuilder/FormTabs";
import PersonalInfoForm from "@/components/ResumeBuilder/PersonalInfoForm";
import EducationForm from "@/components/ResumeBuilder/EducationForm";
import ExperienceForm from "@/components/ResumeBuilder/ExperienceForm";
import SkillsForm from "@/components/ResumeBuilder/SkillsForm";
import PreviewSection from "@/components/ResumeBuilder/PreviewSection";
import ResumePreview from "@/components/ResumeBuilder/ResumePreview";
import CoverLetterGenerator from "@/components/ResumeBuilder/CoverLetterGenerator";
import { 
  saveResumeToLocalStorage, 
  getResumeFromLocalStorage, 
  type SavedResumeData 
} from "@/lib/localStorage";
import { 
  type Resume, 
  type PersonalInfo, 
  type EducationItem, 
  type ExperienceItem, 
  type ProjectItem 
} from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { saveResume } from "@/lib/resumeService";

export default function ResumeBuilder() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [resumeData, setResumeData] = useState<Resume>({
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
    targetRole: ""
  });
  
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = getResumeFromLocalStorage();
    
    setResumeData({
      personalInfo: savedData.personalInfo,
      education: savedData.education,
      experience: savedData.experience,
      skills: savedData.skills,
      projects: savedData.projects,
      templateStyle: savedData.templateStyle,
      colorScheme: savedData.colorScheme,
      isAtsOptimized: savedData.isAtsOptimized,
      targetRole: savedData.targetRole
    });
  }, []);

  const saveResumeMutation = useMutation({
    mutationFn: saveResume,
    onSuccess: (data) => {
      toast({
        title: "Resume saved",
        description: "Your resume has been saved to the database.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving resume",
        description: "There was a problem saving your resume. Your progress is still saved locally.",
        variant: "destructive"
      });
    }
  });

  const handleSaveProgress = () => {
    // Save to localStorage
    saveResumeToLocalStorage(resumeData);
    
    // Save to backend
    const resumeDataForServer = {
      firstName: resumeData.personalInfo.firstName,
      lastName: resumeData.personalInfo.lastName,
      email: resumeData.personalInfo.email,
      phone: resumeData.personalInfo.phone,
      summary: resumeData.personalInfo.summary,
      website: resumeData.personalInfo.website,
      linkedin: resumeData.personalInfo.linkedin,
      education: resumeData.education,
      experience: resumeData.experience,
      skills: resumeData.skills,
      projects: resumeData.projects,
      templateStyle: resumeData.templateStyle,
      colorScheme: resumeData.colorScheme,
      isAtsOptimized: resumeData.isAtsOptimized,
      targetRole: resumeData.targetRole
    };
    
    console.log("Saving resume data to server:", resumeDataForServer);
    saveResumeMutation.mutate(resumeDataForServer);
  };

  // Update handlers for each section
  const handlePersonalInfoSave = (data: PersonalInfo) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: data
    }));
    saveResumeToLocalStorage({ personalInfo: data });
  };

  const handleEducationSave = (data: EducationItem[]) => {
    setResumeData(prev => ({
      ...prev,
      education: data
    }));
    saveResumeToLocalStorage({ education: data });
  };

  const handleExperienceSave = (data: ExperienceItem[]) => {
    setResumeData(prev => ({
      ...prev,
      experience: data
    }));
    saveResumeToLocalStorage({ experience: data });
  };

  const handleSkillsSave = (data: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: data
    }));
    saveResumeToLocalStorage({ skills: data });
  };

  const handleProjectsSave = (data: ProjectItem[]) => {
    setResumeData(prev => ({
      ...prev,
      projects: data
    }));
    saveResumeToLocalStorage({ projects: data });
  };

  const handleOptionsChange = (options: { templateStyle: string; colorScheme: string; isAtsOptimized: boolean; targetRole?: string }) => {
    setResumeData(prev => ({
      ...prev,
      templateStyle: options.templateStyle,
      colorScheme: options.colorScheme,
      isAtsOptimized: options.isAtsOptimized,
      targetRole: options.targetRole
    }));
    saveResumeToLocalStorage(options);
  };

  // Tab navigation
  const tabs = ["personal", "education", "experience", "skills", "preview", "coverletter"];
  const activeTabIndex = tabs.indexOf(activeTab);

  const handlePrevious = () => {
    if (activeTabIndex > 0) {
      setActiveTab(tabs[activeTabIndex - 1]);
    }
  };

  const handleNext = () => {
    if (activeTabIndex < tabs.length - 1) {
      setActiveTab(tabs[activeTabIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSaveProgress={handleSaveProgress} />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FormTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Form fields */}
            <div className="lg:col-span-2">
              {activeTab === "personal" && (
                <PersonalInfoForm 
                  defaultValues={resumeData.personalInfo}
                  onSave={handlePersonalInfoSave}
                />
              )}
              
              {activeTab === "education" && (
                <EducationForm 
                  defaultValues={resumeData.education}
                  onSave={handleEducationSave}
                />
              )}
              
              {activeTab === "experience" && (
                <ExperienceForm 
                  defaultValues={resumeData.experience}
                  onSave={handleExperienceSave}
                />
              )}
              
              {activeTab === "skills" && (
                <SkillsForm 
                  defaultSkills={resumeData.skills}
                  defaultProjects={resumeData.projects}
                  onSaveSkills={handleSkillsSave}
                  onSaveProjects={handleProjectsSave}
                />
              )}
              
              {activeTab === "preview" && (
                <PreviewSection 
                  resumeData={resumeData}
                  previewRef={resumePreviewRef}
                  onOptionsChange={handleOptionsChange}
                />
              )}
              
              {activeTab === "coverletter" && (
                <CoverLetterGenerator 
                  resumeData={resumeData}
                />
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={activeTabIndex === 0}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Previous
                </Button>
                
                <Button
                  variant={activeTabIndex === tabs.length - 1 ? "default" : "default"}
                  onClick={handleNext}
                  disabled={activeTabIndex === tabs.length - 1}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
            
            {/* Right column - Resume Preview */}
            <div className="hidden lg:block">
              <div className="sticky top-8">
                <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Resume Preview</h2>
                  
                  <ResumePreview
                    ref={resumePreviewRef} 
                    resumeData={resumeData}
                    templateStyle={resumeData.templateStyle || "professional"}
                    colorScheme={resumeData.colorScheme || "blue"}
                  />
                  
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Resume updates as you complete the form sections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
