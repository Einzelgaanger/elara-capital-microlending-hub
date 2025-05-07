
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationalId: z.string().min(1, "National ID is required"),
  occupation: z.string().min(1, "Occupation is required"),
  employerName: z.string().optional(),
  employerAddress: z.string().optional(),
  designation: z.string().optional(),
  residentialAddress: z.string().min(1, "Residential address is required"),
  nextOfKinName: z.string().min(1, "Next of kin name is required"),
  nextOfKinPhone: z.string().min(1, "Next of kin phone is required"),
  nextOfKinRelationship: z.string().min(1, "Relationship is required"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormData = z.infer<typeof schema>;

export default function CreateProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      nationalId: "",
      occupation: "",
      employerName: "",
      employerAddress: "",
      designation: "",
      residentialAddress: "",
      nextOfKinName: "",
      nextOfKinPhone: "",
      nextOfKinRelationship: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from("user_profiles").insert({
        user_id: user.id,
        title: data.title,
        first_name: data.firstName,
        middle_name: data.middleName || null,
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth,
        national_id: data.nationalId,
        occupation: data.occupation,
        employer_name: data.employerName || null,
        employer_address: data.employerAddress || null,
        designation: data.designation || null,
        residential_address: data.residentialAddress,
        terms_accepted: data.termsAccepted,
        next_of_kin_name: data.nextOfKinName,
        next_of_kin_phone: data.nextOfKinPhone,
        next_of_kin_relationship: data.nextOfKinRelationship,
      });

      if (error) throw error;

      toast({
        title: "Profile created",
        description: "Your profile has been created successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-elara-primary text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-xl font-bold">Elara Capital</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6">Create Your Profile</h1>
        <p className="text-gray-600 mb-6">
          Please fill out your profile information to proceed with loan applications.
        </p>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mr">Mr.</SelectItem>
                          <SelectItem value="Mrs">Mrs.</SelectItem>
                          <SelectItem value="Ms">Ms.</SelectItem>
                          <SelectItem value="Dr">Dr.</SelectItem>
                          <SelectItem value="Prof">Prof.</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>National ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer Name (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer Address (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="residentialAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h2 className="text-lg font-medium mt-6">Next of Kin Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="nextOfKinName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next of Kin Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nextOfKinPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next of Kin Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nextOfKinRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I accept the terms and conditions of Elara Capital
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating profile..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
