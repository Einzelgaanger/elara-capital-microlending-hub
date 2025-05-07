
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/toast";

// Fetch user profile by user ID
export const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    toast({
      variant: "destructive",
      title: "Failed to load profile",
      description: error.message,
    });
    throw error;
  }

  return data;
};

// Fetch loan by ID
export const fetchLoanById = async (loanId: string) => {
  const { data, error } = await supabase
    .from("loans")
    .select("*")
    .eq("id", loanId)
    .single();

  if (error) {
    console.error("Error fetching loan:", error);
    toast({
      variant: "destructive",
      title: "Failed to load loan details",
      description: error.message,
    });
    throw error;
  }

  return data;
};

// Update loan status
export const updateLoanStatus = async (
  loanId: string, 
  status: string, 
  approvedBy?: string,
  additionalData: Record<string, any> = {}
) => {
  const updateData = {
    status,
    ...additionalData
  };

  if (status === 'approved') {
    updateData.approved_by = approvedBy;
    updateData.approved_at = new Date().toISOString();
  } else if (status === 'allocated') {
    updateData.allocated_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("loans")
    .update(updateData)
    .eq("id", loanId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating loan status to ${status}:`, error);
    toast({
      variant: "destructive",
      title: "Failed to update loan",
      description: error.message,
    });
    throw error;
  }

  return data;
};

// Record a payment for a loan
export const recordPayment = async (payment: {
  loan_id: string;
  user_id: string;
  amount: number;
  date: string;
}) => {
  // First, insert the payment record
  const { data: paymentData, error: paymentError } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single();

  if (paymentError) {
    console.error("Error recording payment:", paymentError);
    toast({
      variant: "destructive",
      title: "Failed to record payment",
      description: paymentError.message,
    });
    throw paymentError;
  }

  // Then fetch the current loan to get the remaining amount
  const { data: loanData, error: loanError } = await supabase
    .from("loans")
    .select("remaining_amount")
    .eq("id", payment.loan_id)
    .single();

  if (loanError) {
    console.error("Error fetching loan data for payment:", loanError);
    throw loanError;
  }

  // Calculate new remaining amount
  let newRemainingAmount = loanData.remaining_amount - payment.amount;
  if (newRemainingAmount < 0) newRemainingAmount = 0;

  // Update the loan with the new remaining amount
  const { error: updateError } = await supabase
    .from("loans")
    .update({ remaining_amount: newRemainingAmount })
    .eq("id", payment.loan_id);

  if (updateError) {
    console.error("Error updating loan remaining amount:", updateError);
    throw updateError;
  }

  // If remaining amount is now 0, update the status to repaid
  if (newRemainingAmount === 0) {
    const { error: statusError } = await supabase
      .from("loans")
      .update({ status: "repaid" })
      .eq("id", payment.loan_id);

    if (statusError) {
      console.error("Error updating loan status to repaid:", statusError);
      throw statusError;
    }
  }

  return paymentData;
};

// Fetch payments for a loan
export const fetchPaymentsForLoan = async (loanId: string) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("loan_id", loanId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    toast({
      variant: "destructive",
      title: "Failed to load payments",
      description: error.message,
    });
    throw error;
  }

  return data || [];
};
