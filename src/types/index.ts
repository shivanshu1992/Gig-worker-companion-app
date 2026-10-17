// Core TypeScript interfaces for Gig Worker Companion

export type SupportedLanguage = 'en' | 'hi' | 'pa';

export type WorkCategory = 
  | 'delivery' 
  | 'driver' 
  | 'construction' 
  | 'daily_wage' 
  | 'domestic' 
  | 'freelance' 
  | 'other';

export interface UserProfile {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  preferredLanguage: SupportedLanguage;
  workCategory: WorkCategory;
  state: string;
  district: string;
  primaryPlatform?: string;
  monthlyIncomeGoal: number;
  dailyIncomeGoal: number;
  onboardingCompleted: boolean;
  notificationPreferences: {
    dailySummary: boolean;
    safetyAlerts: boolean;
    schemeUpdates: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'fuel' 
  | 'ev_charge' 
  | 'vehicle_maintenance' 
  | 'food_water' 
  | 'mobile_data' 
  | 'equipment_uniform' 
  | 'tolls_parking' 
  | 'other';

export interface ExpenseItem {
  id: string;
  earningId?: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  paymentMode: 'cash' | 'digital';
  notes?: string;
}

export type DisputeStatus = 'none' | 'can_dispute' | 'drafted' | 'submitted' | 'resolved';

export interface EarningRecord {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  workCategory: WorkCategory;
  platformOrEmployer: string;
  tripOrOrderId?: string;
  grossEarnings: number;
  bonuses: number;
  tips: number;
  deductions: number;
  deductionReason?: string;
  expenses: number;
  netEarnings: number; // gross + bonuses + tips - deductions - expenses
  hoursWorked: number;
  distanceKm?: number;
  paymentMode: 'cash' | 'digital' | 'mixed';
  notes?: string;
  disputeStatus: DisputeStatus;
  createdAt: string;
}

export type SchemeCategory = 
  | 'central' 
  | 'state' 
  | 'social_security' 
  | 'healthcare' 
  | 'pension' 
  | 'accident_insurance' 
  | 'board' 
  | 'platform_act';

export interface WelfareScheme {
  id: string;
  officialName: string;
  nameHi?: string;
  namePa?: string;
  category: SchemeCategory;
  plainDescription: string;
  plainDescriptionHi?: string;
  plainDescriptionPa?: string;
  intendedBeneficiaries: string;
  stateApplicability: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  verifiedBenefits: string[];
  applicationProcedure: string;
  applicationUrl?: string;
  officialSourceUrl: string;
  verificationDate: string;
  verificationStatus: 'verified' | 'official_portal_linked' | 'pending_verification';
  isActive: boolean;
}

export type GrievanceCategory = 
  | 'delayed_payment' 
  | 'missing_earnings' 
  | 'unfair_deduction' 
  | 'account_suspension' 
  | 'rating_penalty' 
  | 'harassment' 
  | 'unsafe_conditions' 
  | 'unpaid_wages' 
  | 'other';

export type GrievanceTone = 'formal_assertive' | 'polite_cooperative' | 'urgent_legal';

export interface GrievanceDraft {
  id: string;
  userId?: string;
  category: GrievanceCategory;
  platformOrEmployer: string;
  disputedAmount?: number;
  incidentDate?: string;
  referenceIds?: string;
  language: SupportedLanguage;
  tone: GrievanceTone;
  subjectLine: string;
  recipientChannel?: string;
  draftContent: string;
  supportingEvidence?: string[];
  status: 'draft' | 'sent_to_platform' | 'escalated_to_labor_dept' | 'resolved';
  createdAt: string;
}

export type DocumentType = 
  | 'invoice_request' 
  | 'work_experience_letter' 
  | 'lost_wage_statement' 
  | 'welfare_cover_letter' 
  | 'worker_self_declaration' 
  | 'dispute_notice';

export interface DocumentDraft {
  id: string;
  userId?: string;
  docType: DocumentType;
  title: string;
  language: SupportedLanguage;
  metadata: Record<string, any>;
  generatedContent: string;
  createdAt: string;
}

export interface SafetyChecklistItem {
  id: string;
  label: string;
  labelHi: string;
  labelPa: string;
  checked: boolean;
  category: 'vehicle' | 'gear' | 'health' | 'route';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: {
    title: string;
    url: string;
    verifiedDate: string;
  }[];
  timestamp: string;
}
