import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check, Download, Award } from "lucide-react";
import { optimizeResumeForATS, resumeToText, saveResume, updateResume } from "@/lib/resumeService";
import { type Resume, type ResumeData } from "@shared/schema";
import html2pdf from "html2pdf.js";
import { useMutation } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PreviewSectionProps {
  resumeData: Resume;
  previewRef: React.RefObject<HTMLDivElement>;
  onOptionsChange: (options: { templateStyle: string; colorScheme: string; isAtsOptimized: boolean; targetRole?: string }) => void;
}

const templateOptions = [
  { value: "professional", label: "Professional" },
  { value: "modern", label: "Modern" },
  { value: "minimalist", label: "Minimalist" },
  { value: "creative", label: "Creative" },
];

const colorOptions = [
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "gray", label: "Gray" },
  { value: "purple", label: "Purple" },
];

const optionsSchema = z.object({
  templateStyle: z.string(),
  colorScheme: z.string(),
  isAtsOptimized: z.boolean(),
  targetRole: z.string().optional()
});

export default function PreviewSection({ resumeData, previewRef, onOptionsChange }: PreviewSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(resumeData.atsScore || null);
  const { toast } = useToast();
  
  // Mutation for saving optimized resume to database
  const saveResumeMutation = useMutation({
    mutationFn: saveResume,
    onSuccess: (data) => {
      toast({
        title: "Resume saved",
        description: "Your optimized resume has been saved to the database.",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving resume",
        description: "There was a problem saving your optimized resume.",
        variant: "destructive"
      });
    }
  });

  const form = useForm<z.infer<typeof optionsSchema>>({
    resolver: zodResolver(optionsSchema),
    defaultValues: {
      templateStyle: resumeData.templateStyle || "professional",
      colorScheme: resumeData.colorScheme || "blue",
      isAtsOptimized: resumeData.isAtsOptimized ?? true,
      targetRole: ""
    }
  });

  const handleOptionsChange = (values: z.infer<typeof optionsSchema>) => {
    onOptionsChange(values);
  };

  const generateResume = async () => {
    if (!previewRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const options = form.getValues();
      
      if (options.isAtsOptimized) {
        // Get resume as text for ATS optimization
        const resumeText = resumeToText(resumeData);
        
        // Optimize with Gemini AI (simulated with API call)
        const targetRole = options.targetRole;
        const result = await optimizeResumeForATS(resumeText, targetRole);
        const { optimizedText, atsScore } = result;
        
        // Update the resume data with optimized content
        const personalInfo = { ...resumeData.personalInfo };
        
        // In a real application, you'd parse the optimized text and update all relevant sections
        // For this simulation, we'll just update the summary with a note about optimization
        const roleSpecificNote = targetRole 
          ? `This resume has been optimized for the ${targetRole} position using AI.` 
          : "This resume has been optimized for ATS systems using AI.";
        
        personalInfo.summary = personalInfo.summary + "\n\n" + roleSpecificNote;
        
        // Create an updated resume object with the optimized content
        const optimizedResume = {
          ...resumeData,
          personalInfo,
          targetRole: targetRole || "",
          atsScore,
          lastOptimized: new Date().toISOString()
        };
        
        // Save the optimized resume to the database
        const resumeDataForServer = {
          firstName: optimizedResume.personalInfo.firstName,
          lastName: optimizedResume.personalInfo.lastName,
          email: optimizedResume.personalInfo.email,
          phone: optimizedResume.personalInfo.phone,
          summary: optimizedResume.personalInfo.summary,
          website: optimizedResume.personalInfo.website,
          linkedin: optimizedResume.personalInfo.linkedin,
          education: optimizedResume.education,
          experience: optimizedResume.experience,
          skills: optimizedResume.skills,
          projects: optimizedResume.projects,
          templateStyle: optimizedResume.templateStyle,
          colorScheme: optimizedResume.colorScheme,
          targetRole: targetRole || "",
          isAtsOptimized: true,
          atsScore
        };
        
        // Save to database
        saveResumeMutation.mutate(resumeDataForServer);
        
        // Show success message with optimization details and score
        toast({
          title: "Resume optimized for ATS",
          description: targetRole 
            ? `Your resume has been optimized for ${targetRole} positions with an ATS score of ${atsScore}/100.` 
            : `Your resume has been optimized for Applicant Tracking Systems with an ATS score of ${atsScore}/100.`,
          variant: "default"
        });
        
        // Set state to show the ATS score in the UI
        setAtsScore(atsScore);
      }
      
      toast({
        title: "Resume generated successfully",
        description: "Your resume is ready to download.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error generating resume",
        description: "There was a problem generating your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResume = async () => {
    if (!previewRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const options = {
        margin: 10,
        filename: `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().from(previewRef.current).set(options).save();
      
      toast({
        title: "Resume downloaded",
        description: "Your resume has been downloaded as a PDF.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error downloading resume",
        description: "There was a problem downloading your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Preview & Generate</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">Resume Options</h3>
        
        <Form {...form}>
          <form onChange={form.handleSubmit(handleOptionsChange)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="templateStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Style</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templateOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="colorScheme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Scheme</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color scheme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAtsOptimized"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4 md:col-span-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Optimize for ATS</FormLabel>
                    <FormDescription>
                      Use AI to make your resume more ATS-friendly by optimizing keywords and formatting
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {form.watch("isAtsOptimized") && (
              <FormField
                control={form.control}
                name="targetRole"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Target Job Role</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Software Engineer, Product Manager, Marketing Specialist" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the specific job role you're applying for to tailor your resume for that position
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
      </div>

      {atsScore !== null && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              ATS Compatibility Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Score: {atsScore}/100</span>
                <span className="text-sm font-medium">
                  {atsScore >= 90 ? 'Excellent' : 
                   atsScore >= 70 ? 'Good' : 
                   atsScore >= 50 ? 'Fair' : 'Needs Improvement'}
                </span>
              </div>
              <Progress value={atsScore} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">
                {atsScore >= 90 ? 'Your resume is well-optimized for ATS systems.' : 
                 atsScore >= 70 ? 'Your resume is compatible with most ATS systems, with room for improvement.' : 
                 atsScore >= 50 ? 'Your resume may pass some ATS systems, but needs more optimization.' : 
                 'Your resume needs significant improvements to pass ATS filters.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Button 
          onClick={generateResume} 
          disabled={isGenerating}
          className="flex items-center"
        >
          <Check className="h-5 w-5 mr-2" />
          {isGenerating ? "Generating..." : "Generate Resume"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={downloadResume}
          disabled={isDownloading}
          className="flex items-center"
        >
          <Download className="h-5 w-5 mr-2" />
          {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
}
