import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
};

const tabs: Tab[] = [
  { id: "personal", label: "Personal Details" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Work Experience" },
  { id: "skills", label: "Skills & Projects" },
  { id: "preview", label: "Preview & Generate" },
  { id: "coverletter", label: "Cover Letter" }
];

interface FormTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function FormTabs({ activeTab, onTabChange }: FormTabsProps) {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
