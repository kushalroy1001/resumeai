import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { educationItemSchema, type EducationItem } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";

interface EducationFormProps {
  defaultValues: EducationItem[];
  onSave: (data: EducationItem[]) => void;
}

const educationArraySchema = z.array(educationItemSchema);

export default function EducationForm({ defaultValues, onSave }: EducationFormProps) {
  const form = useForm<{ education: EducationItem[] }>({
    resolver: zodResolver(z.object({ education: educationArraySchema })),
    defaultValues: {
      education: defaultValues.length ? defaultValues : []
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const handleAddEducation = () => {
    const newId = crypto.randomUUID();
    append({
      id: newId,
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false
    });
  };

  // Auto-save when field changes
  const handleFormChange = () => {
    const values = form.getValues().education;
    onSave(values);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Education</h2>
        <Button 
          variant="default" 
          size="sm"
          onClick={handleAddEducation}
          className="text-xs"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </Button>
      </div>

      <Form {...form}>
        <form onChange={handleFormChange}>
          {fields.map((field, index) => (
            <div key={field.id} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`education.${index}.school`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/University</FormLabel>
                      <FormControl>
                        <Input placeholder="University name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input placeholder="Bachelor of Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`education.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormField
                    control={form.control}
                    name={`education.${index}.current`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 space-y-0 mt-7">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Current</FormLabel>
                      </FormItem>
                    )}
                  />

                  {!form.watch(`education.${index}.current`) && (
                    <FormField
                      control={form.control}
                      name={`education.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="month" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`education.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Notable achievements, GPA, relevant coursework" 
                          rows={2} 
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
              <p>No education entries yet. Click "Add Education" to begin.</p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
