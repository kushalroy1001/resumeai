import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, type PersonalInfo } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface PersonalInfoFormProps {
  defaultValues: PersonalInfo;
  onSave: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({ defaultValues, onSave }: PersonalInfoFormProps) {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
    mode: "onChange"
  });

  const handleSubmit = (data: PersonalInfo) => {
    onSave(data);
  };

  // Auto-save when any field changes
  const handleFieldChange = () => {
    const isValid = form.formState.isValid;
    if (isValid) {
      const data = form.getValues();
      onSave(data);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
      <Form {...form}>
        <form onChange={handleFieldChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Professional Summary</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Brief overview of your professional background, strengths, and career goals" 
                    rows={4} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website/Portfolio</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://yourportfolio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://linkedin.com/in/yourprofile" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
