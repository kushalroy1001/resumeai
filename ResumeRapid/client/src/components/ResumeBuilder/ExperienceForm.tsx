import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { experienceItemSchema, type ExperienceItem } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";

interface ExperienceFormProps {
  defaultValues: ExperienceItem[];
  onSave: (data: ExperienceItem[]) => void;
}

const experienceArraySchema = z.array(experienceItemSchema);

export default function ExperienceForm({ defaultValues, onSave }: ExperienceFormProps) {
  const form = useForm<{ experience: ExperienceItem[] }>({
    resolver: zodResolver(z.object({ experience: experienceArraySchema })),
    defaultValues: {
      experience: defaultValues.length ? defaultValues : []
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const handleAddExperience = () => {
    const newId = crypto.randomUUID();
    append({
      id: newId,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false
    });
  };

  // Auto-save when field changes
  const handleFormChange = () => {
    const values = form.getValues().experience;
    onSave(values);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Work Experience</h2>
        <Button 
          variant="default" 
          size="sm"
          onClick={handleAddExperience}
          className="text-xs"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </Button>
      </div>

      <Form {...form}>
        <form onChange={handleFormChange}>
          {fields.map((field, index) => (
            <div key={field.id} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`experience.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experience.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Your job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experience.${index}.startDate`}
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
                    name={`experience.${index}.current`}
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

                  {!form.watch(`experience.${index}.current`) && (
                    <FormField
                      control={form.control}
                      name={`experience.${index}.endDate`}
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
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your responsibilities and achievements" 
                          rows={4} 
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
              <p>No experience entries yet. Click "Add Experience" to begin.</p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
