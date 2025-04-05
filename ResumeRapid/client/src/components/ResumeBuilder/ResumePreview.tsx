import { forwardRef } from "react";
import { type Resume } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface ResumePreviewProps {
  resumeData: Resume;
  templateStyle: string;
  colorScheme: string;
}

const getColorClasses = (colorScheme: string) => {
  switch (colorScheme) {
    case "green":
      return { heading: "border-green-600 text-green-800", badge: "bg-green-100 text-green-800" };
    case "purple":
      return { heading: "border-purple-600 text-purple-800", badge: "bg-purple-100 text-purple-800" };
    case "gray":
      return { heading: "border-gray-600 text-gray-800", badge: "bg-gray-100 text-gray-800" };
    case "blue":
    default:
      return { heading: "border-blue-600 text-blue-800", badge: "bg-blue-100 text-blue-800" };
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
  } catch (e) {
    return dateString;
  }
};

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, templateStyle, colorScheme }, ref) => {
    const { personalInfo, education, experience, skills, projects } = resumeData;
    const colorClasses = getColorClasses(colorScheme);
    
    const isMinimalist = templateStyle === "minimalist";
    const isCreative = templateStyle === "creative";
    const isModern = templateStyle === "modern";
    
    return (
      <div ref={ref} className="border border-gray-200 bg-white rounded-md p-6 shadow-sm" style={{ fontSize: "10px", maxHeight: "600px", overflowY: "auto" }}>
        {/* Header */}
        <div className={`mb-4 ${isCreative ? "text-left" : "text-center"}`}>
          <h1 className={`text-2xl font-bold ${isModern ? "tracking-wide" : ""}`}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          
          {personalInfo.email && personalInfo.phone && (
            <div className="flex justify-center items-center space-x-2 mt-1 text-xs text-gray-600">
              <span>{personalInfo.email}</span>
              <span>•</span>
              <span>{personalInfo.phone}</span>
              {personalInfo.linkedin && (
                <>
                  <span>•</span>
                  <span>{personalInfo.linkedin.replace("https://", "")}</span>
                </>
              )}
            </div>
          )}
          
          {personalInfo.website && (
            <div className="text-xs text-gray-600 mt-1">
              {personalInfo.website.replace("https://", "")}
            </div>
          )}
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-4">
            <h2 className={`text-base font-semibold border-b ${colorClasses.heading} pb-1 mb-2 ${isMinimalist ? "uppercase text-xs tracking-wider" : ""}`}>
              Summary
            </h2>
            <p className="text-xs">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-4">
            <h2 className={`text-base font-semibold border-b ${colorClasses.heading} pb-1 mb-2 ${isMinimalist ? "uppercase text-xs tracking-wider" : ""}`}>
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium">{exp.position}</h3>
                    <p className="text-xs text-gray-600">{exp.company}</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.description && (
                  <div className="mt-1 text-xs">
                    {exp.description.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-4">
            <h2 className={`text-base font-semibold border-b ${colorClasses.heading} pb-1 mb-2 ${isMinimalist ? "uppercase text-xs tracking-wider" : ""}`}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium">{edu.degree}</h3>
                    <p className="text-xs text-gray-600">{edu.school}</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                  </p>
                </div>
                {edu.description && <p className="text-xs mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-4">
            <h2 className={`text-base font-semibold border-b ${colorClasses.heading} pb-1 mb-2 ${isMinimalist ? "uppercase text-xs tracking-wider" : ""}`}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, index) => (
                <span key={index} className={`inline-block rounded px-2 py-1 text-xs ${colorClasses.badge}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className={`text-base font-semibold border-b ${colorClasses.heading} pb-1 mb-2 ${isMinimalist ? "uppercase text-xs tracking-wider" : ""}`}>
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-2">
                <h3 className="text-sm font-medium">{project.name}</h3>
                {project.technologies && (
                  <p className="text-xs text-gray-600">{project.technologies}</p>
                )}
                {project.url && (
                  <p className="text-xs text-blue-600">{project.url}</p>
                )}
                {project.description && <p className="text-xs mt-1">{project.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;
