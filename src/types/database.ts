// Database Types based on Supabase Schema

export type UAEEmirate =
  | 'Abu Dhabi'
  | 'Dubai'
  | 'Sharjah'
  | 'Ajman'
  | 'Umm Al Quwain'
  | 'Ras Al Khaimah'
  | 'Fujairah';

export type LeadSource =
  | 'Existing Connection'
  | 'Social Media'
  | 'LinkedIn'
  | 'Cold Calling'
  | 'Referral'
  | 'Website'
  | 'Other';

export type LeadProductType =
  | 'Credit Card'
  | 'Personal Loan'
  | 'Auto Loan'
  | 'Account Opening'
  | 'Other';

export type LeadStatus =
  | 'New Lead'
  | 'Qualified Lead'
  | 'Appointment Booked';

export type DealStage =
  | 'Application Processing'
  | 'Verification Needed'
  | 'Activation Needed'
  | 'Completed'
  | 'Unsuccessful';

export type EmploymentStatus =
  | 'Salaried'
  | 'Self-Employed';

export type GenderType =
  | 'Male'
  | 'Female'
  | 'Other';

export type TaskPriority =
  | 'Urgent'
  | 'Important'
  | 'Significant'
  | 'Focus';

export type TaskStatus =
  | 'Todo'
  | 'In Progress'
  | 'Done';

export type TransactionType =
  | 'Income'
  | 'Expense';

// Database Tables

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalesCycle {
  id: number;
  user_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  company_name: string | null;
  designation: string | null;
  mobile_number: string | null;
  whatsapp_number: string | null;
  email: string | null;
  location: UAEEmirate | null;
  source: LeadSource | null;
  bank_name: string | null;
  product_type: LeadProductType | null;
  conditional_product: any | null; // JSONB
  salary_amount: number | null;
  has_salary_variation: boolean;
  has_current_credit_card: boolean;
  credit_card_age_years: number | null;
  credit_card_age_months: number | null;
  total_credit_limit: number | null;
  status: LeadStatus;
}

export interface Deal {
  id: number;
  lead_id: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  stage: DealStage;
  application_number: string | null;
  bpm_id_number: string | null;
  dob: string | null;
  nationality: string | null;
  emirates_id: string | null;
  passport_number: string | null;
  salary_bank: string | null;
  aecb_score: string | null;
  professional_email: string | null;
  iban_number: string | null;
  company_landline: string | null;
  company_website: string | null;
  submitted_date: string | null;
  completed_date: string | null;
}

export interface Connection {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  dob: string | null;
  gender: GenderType | null;
  nationality: string | null;
  passport_number: string | null;
  emirates_id: string | null;
  mobile_number: string | null;
  whatsapp_number: string | null;
  email: string | null;
  location: UAEEmirate | null;
  employment_status: EmploymentStatus | null;
  company_name: string | null;
  company_website: string | null;
  company_landline: string | null;
  work_email: string | null;
  designation: string | null;
  monthly_salary: number | null;
  salary_bank: string | null;
  aecb_score: string | null;
  iban_number: string | null;
}

export interface Task {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  is_focus_task: boolean;
}

export interface FinancialTransaction {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  transaction_date: string;
  type: TransactionType;
  category: string | null;
  source_or_description: string;
  amount: number;
}
