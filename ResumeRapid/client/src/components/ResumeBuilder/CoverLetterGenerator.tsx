import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Copy, Download, RefreshCw } from "lucide-react";
import { generateCoverLetter, resumeToText } from "@/lib/resumeService";
import { type Resume } from "@shared/schema";
import html2pdf from "html2pdf.js";

interface CoverLetterGeneratorProps {
  resumeData: Resume;
}

const coverLetterSchema = z.object({
  targetRole: z.string().min(1, "Target role is required"),
  companyName: z.string().optional(),
  recipientName: z.string().optional(),
});

export default function CoverLetterGenerator({ resumeData }: CoverLetterGeneratorProps) {
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [editableCoverLetter, setEditableCoverLetter] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof coverLetterSchema>>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      targetRole: resumeData.targetRole || "",
      companyName: "",
      recipientName: "Hiring Manager",
    }
  });
  
  const handleGenerateCoverLetter = async (values: z.infer<typeof coverLetterSchema>) => {
    setIsGenerating(true);
    
    try {
      const resumeText = resumeToText(resumeData);
      const generatedLetter = await generateCoverLetter(
        resumeText, 
        values.targetRole, 
        values.companyName || undefined
      );
      
      // Replace placeholders with actual values
      let personalizedLetter = generatedLetter
        .replace("[Your Name]", `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`);
      
      // Replace "Dear Hiring Manager" or "Dear Company Hiring Team" with custom recipient
      if (values.recipientName) {
        personalizedLetter = personalizedLetter
          .replace(/Dear Hiring Manager,/g, `Dear ${values.recipientName},`)
          .replace(new RegExp(`Dear ${values.companyName || ''} Hiring Team,`, 'g'), 
            `Dear ${values.recipientName},`);
      }
      
      setCoverLetter(personalizedLetter);
      setEditableCoverLetter(personalizedLetter);
      setHasEdited(false);
      
      toast({
        title: "Cover letter generated",
        description: "Your personalized cover letter is ready. Feel free to edit it.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error generating cover letter",
        description: "There was a problem generating your cover letter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableCoverLetter(e.target.value);
    setHasEdited(true);
  };
  
  const handleRevertChanges = () => {
    if (coverLetter) {
      setEditableCoverLetter(coverLetter);
      setHasEdited(false);
      toast({
        title: "Changes reverted",
        description: "Your cover letter has been reset to the original generated version.",
        variant: "default"
      });
    }
  };
  
  const handleCopy = () => {
    if (!editableCoverLetter) return;
    
    navigator.clipboard.writeText(editableCoverLetter).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Your cover letter has been copied to the clipboard.",
        variant: "default"
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive"
      });
    });
  };
  
  const handleDownload = async () => {
    if (!editableCoverLetter) return;
    
    setIsDownloading(true);
    
    try {
      // Create a temporary div with the cover letter content styled for PDF
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
          <div style="white-space: pre-line; line-height: 1.5; font-size: 12pt;">
            ${editableCoverLetter}
          </div>
        </div>
      `;
      
      document.body.appendChild(element);
      
      const options = {
        margin: 10,
        filename: `Cover_Letter_${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().from(element).set(options).save();
      
      // Clean up
      document.body.removeChild(element);
      
      toast({
        title: "Cover letter downloaded",
        description: "Your cover letter has been downloaded as a PDF.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error downloading cover letter",
        description: "There was a problem downloading your cover letter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Cover Letter Generator</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerateCoverLetter)} className="space-y-4 mb-6">
          <FormField
            control={form.control}
            name="targetRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Job Role</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Software Engineer, Product Manager, Marketing Specialist" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Enter the specific job role you're applying for to tailor the cover letter
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Google, Microsoft, Amazon" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Enter the company name to personalize your cover letter
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Hiring Manager, John Smith, Recruiting Team" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Who will receive this cover letter? (Default: "Hiring Manager")
                </FormDescription>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isGenerating}
            className="flex items-center"
          >
            <FileText className="h-5 w-5 mr-2" />
            {isGenerating ? "Generating..." : "Generate Cover Letter"}
          </Button>
        </form>
      </Form>
      
      {coverLetter && (
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-md font-medium">
              Your Cover Letter
              {hasEdited && <span className="text-xs text-gray-500 ml-2">(Edited)</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <Textarea 
                className="min-h-[300px] font-mono text-sm whitespace-pre-line" 
                value={editableCoverLetter} 
                onChange={handleCoverLetterChange}
              />
            </div>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCopy}
                className="flex items-center"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copy to Clipboard
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
              
              {hasEdited && (
                <Button 
                  variant="outline" 
                  onClick={handleRevertChanges}
                  className="flex items-center"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Revert Changes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}