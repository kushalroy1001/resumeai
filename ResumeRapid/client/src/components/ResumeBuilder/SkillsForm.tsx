import { useState, KeyboardEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { projectItemSchema, type ProjectItem } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SkillsFormProps {
  defaultSkills: string[];
  defaultProjects: ProjectItem[];
  onSaveSkills: (skills: string[]) => void;
  onSaveProjects: (projects: ProjectItem[]) => void;
}

const projectArraySchema = z.array(projectItemSchema);

export default function SkillsForm({ 
  defaultSkills, 
  defaultProjects, 
  onSaveSkills, 
  onSaveProjects 
}: SkillsFormProps) {
  const [skills, setSkills] = useState<string[]>(defaultSkills);
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<{ projects: ProjectItem[] }>({
    resolver: zodResolver(z.object({ projects: projectArraySchema })),
    defaultValues: {
      projects: defaultProjects.length ? defaultProjects : []
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const handleAddSkill = (skill: string) => {
    if (skill.trim() === "") return;
    
    const newSkills = [...skills, skill.trim()];
    setSkills(newSkills);
    onSaveSkills(newSkills);
    setSkillInput("");
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    onSaveSkills(newSkills);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleAddProject = () => {
    const newId = crypto.randomUUID();
    append({
      id: newId,
      name: "",
      technologies: "",
      url: "",
      description: ""
    });
  };

  const handleFormChange = () => {
    const values = form.getValues().projects;
    onSaveProjects(values);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Skills & Projects</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
        <div className="mb-2">
          <Input
            type="text"
            id="skill-input"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a skill (e.g. JavaScript, Project Management)"
          />
          <p className="mt-1 text-xs text-gray-500">Press Enter to add multiple skills</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center bg-gray-100 text-gray-800">
              <span>{skill}</span>
              <Button 
                onClick={() => handleRemoveSkill(index)}
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {skills.length === 0 && (
            <p className="text-sm text-gray-500">No skills added yet.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium text-gray-900">Projects</h3>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleAddProject}
            className="text-xs"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Project
          </Button>
        </div>

        <Form {...form}>
          <form onChange={handleFormChange}>
            {fields.map((field, index) => (
              <div key={field.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`projects.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Project name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`projects.${index}.technologies`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technologies Used</FormLabel>
                        <FormControl>
                          <Input placeholder="React, Node.js, MongoDB, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`projects.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Project URL</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://github.com/yourusername/project" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your project, its purpose, and your role" 
                            rows={3} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-xs"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p>No projects added yet. Click "Add Project" to begin.</p>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
