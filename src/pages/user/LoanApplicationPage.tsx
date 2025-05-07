
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormDescription,
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
  amount: z.string().refine(
    (val) => {
      const amount = parseInt(val, 10);
      return !isNaN(amount) && amount >= 1000 && amount <= 100000;
    },
    {
      message: "Amount must be between KSh 1,000 and KSh 100,000",
    }
  ),
  repaymentPeriod: z.string().refine(
    (val) => {
      const days = parseInt(val, 10);
      return !isNaN(days) && days >= 30 && days <= 365;
    },
    {
      message: "Repayment period must be between 30 and 365 days",
    }
  ),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentDetails: z.string().min(1, "Payment details are required"),
});

type FormData = z.infer<typeof schema>;

export default function LoanApplicationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: "",
      repaymentPeriod: "30",
      purpose: "",
      paymentMethod: "",
      paymentDetails: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from("loans").insert({
        user_id: user.id,
        amount: parseInt(data.amount, 10),
        repayment_period: parseInt(data.repaymentPeriod, 10),
        purpose: data.purpose,
        payment_method: data.paymentMethod,
        payment_details: data.paymentDetails,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Loan Application Submitted",
        description: "Your loan application has been successfully submitted.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error submitting loan application:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateInterest = () => {
    const amount = parseInt(form.watch("amount") || "0", 10);
    return isNaN(amount) ? 0 : amount * 0.3;
  };

  const calculatedInterest = calculateInterest();
  const totalRepayment = parseInt(form.watch("amount") || "0", 10) + calculatedInterest;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-elara-primary text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Elara Capital</h1>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-elara-primary"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6">Apply for a Loan</h1>
        <p className="text-gray-600 mb-6">
          Fill out the form below to apply for a loan. Our team will review your application and get back to you shortly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Amount (KSh)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="1000" max="100000" />
                        </FormControl>
                        <FormDescription>
                          Enter an amount between KSh 1,000 and KSh 100,000
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="repaymentPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repayment Period (Days)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select repayment period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="60">60 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">365 days</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose a repayment period between 30 and 365 days
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Purpose</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Explain why you need this loan"
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed explanation of how you intend to use the loan
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mobile_money">Mobile Money</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cash_pickup">Cash Pickup</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Details</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="E.g., Mobile money number or bank account details"
                          />
                        </FormControl>
                        <FormDescription>
                          Provide the details for your selected payment method
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full md:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Loan Summary</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="text-lg font-medium">
                    KSh {(parseInt(form.watch("amount") || "0", 10)).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interest (30%)</p>
                  <p className="text-lg font-medium">KSh {calculatedInterest.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Repayment</p>
                  <p className="text-xl font-bold text-elara-primary">
                    KSh {totalRepayment.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Repayment Period</p>
                  <p className="text-lg font-medium">
                    {form.watch("repaymentPeriod") || "30"} days
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Important Notice</h3>
                <p className="text-sm text-gray-600">
                  By submitting this application, you agree to our terms and conditions. 
                  Your application will be reviewed by our team and you will be notified 
                  of the decision within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
