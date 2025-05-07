
export interface UserProfile {
  id: string;
  user_id: string;
  title: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  national_id: string;
  occupation: string;
  employer_name?: string;
  employer_address?: string;
  designation?: string;
  residential_address: string;
  terms_accepted: boolean;
  next_of_kin_name: string;
  next_of_kin_phone: string;
  next_of_kin_relationship: string;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  purpose: string;
  repayment_period: number;
  payment_method: string;
  payment_details: string;
  status: LoanStatus;
  approved_by?: string;
  approved_at?: string;
  allocated_at?: string;
  remaining_amount?: number;
  created_at: string;
  updated_at: string;
}

export type LoanStatus = "pending" | "approved" | "rejected" | "allocated" | "repaid";

export interface Payment {
  id: string;
  loan_id: string;
  user_id: string;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
}
