import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onSaveProgress?: () => void;
}

export default function Header({ onSaveProgress }: HeaderProps) {
  const { toast } = useToast();

  const handleSaveClick = () => {
    if (onSaveProgress) {
      onSaveProgress();
      toast({
        title: "Progress saved",
        description: "Your resume has been saved successfully.",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-gray-900">ResumeBuilder</h1>
        </Link>
        {onSaveProgress && (
          <Button variant="default" onClick={handleSaveClick}>
            Save Progress
          </Button>
        )}
      </div>
    </header>
  );
}
