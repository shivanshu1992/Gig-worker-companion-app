-- ====================================================================
-- GIG WORKER COMPANION: Supabase PostgreSQL Schema & Security Policies
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Worker Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'pa', 'ta', 'te', 'bn', 'mr')),
  work_category TEXT NOT NULL DEFAULT 'delivery' CHECK (work_category IN ('delivery', 'driver', 'construction', 'daily_wage', 'domestic', 'freelance', 'other')),
  state TEXT NOT NULL DEFAULT 'Delhi',
  district TEXT NOT NULL DEFAULT 'New Delhi',
  primary_platform TEXT,
  monthly_income_goal NUMERIC(10, 2) DEFAULT 25000.00,
  daily_income_goal NUMERIC(10, 2) DEFAULT 1000.00,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  notification_preferences JSONB DEFAULT '{"daily_summary": true, "safety_alerts": true, "scheme_updates": true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Earnings Records Table
CREATE TABLE IF NOT EXISTS public.earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  work_category TEXT NOT NULL DEFAULT 'delivery',
  platform_or_employer TEXT NOT NULL,
  trip_or_order_id TEXT,
  gross_earnings NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (gross_earnings >= 0),
  bonuses NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (bonuses >= 0),
  tips NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tips >= 0),
  deductions NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (deductions >= 0),
  deduction_reason TEXT,
  expenses NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (expenses >= 0),
  net_earnings NUMERIC(10, 2) GENERATED ALWAYS AS (gross_earnings + bonuses + tips - deductions - expenses) STORED,
  hours_worked NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (hours_worked >= 0),
  distance_km NUMERIC(6, 2) DEFAULT 0.00 CHECK (distance_km >= 0),
  payment_mode TEXT NOT NULL DEFAULT 'digital' CHECK (payment_mode IN ('cash', 'digital', 'mixed')),
  notes TEXT,
  dispute_status TEXT NOT NULL DEFAULT 'none' CHECK (dispute_status IN ('none', 'potential_dispute', 'drafted', 'submitted', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Expenses Records Table (Granular categorization)
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  earning_id UUID REFERENCES public.earnings(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL CHECK (category IN ('fuel', 'ev_charge', 'vehicle_maintenance', 'food_water', 'mobile_data', 'equipment_uniform', 'tolls_parking', 'other')),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  payment_mode TEXT NOT NULL DEFAULT 'digital' CHECK (payment_mode IN ('cash', 'digital')),
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Verified Welfare Schemes Directory (Public reference)
CREATE TABLE IF NOT EXISTS public.schemes (
  id TEXT PRIMARY KEY,
  official_name TEXT NOT NULL,
  name_hi TEXT,
  name_pa TEXT,
  category TEXT NOT NULL CHECK (category IN ('central', 'state', 'social_security', 'healthcare', 'pension', 'accident_insurance', 'board', 'platform_act')),
  plain_description TEXT NOT NULL,
  intended_beneficiaries TEXT NOT NULL,
  state_applicability TEXT NOT NULL DEFAULT 'All India',
  eligibility_criteria JSONB NOT NULL,
  required_documents JSONB NOT NULL,
  verified_benefits JSONB NOT NULL,
  application_procedure TEXT NOT NULL,
  application_url TEXT,
  official_source_url TEXT NOT NULL,
  verification_date DATE NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'official_portal_linked', 'pending_verification')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Knowledge Sources for Grounded RAG
CREATE TABLE IF NOT EXISTS public.knowledge_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  jurisdiction TEXT NOT NULL DEFAULT 'India',
  official_source_url TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  last_verified_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. AI Grievance Drafts Table
CREATE TABLE IF NOT EXISTS public.grievance_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('delayed_payment', 'missing_earnings', 'unfair_deduction', 'account_suspension', 'rating_penalty', 'harassment', 'unsafe_conditions', 'unpaid_wages', 'other')),
  platform_or_employer TEXT NOT NULL,
  disputed_amount NUMERIC(10, 2),
  incident_date DATE,
  reference_ids TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  tone TEXT NOT NULL DEFAULT 'formal_assertive' CHECK (tone IN ('formal_assertive', 'polite_cooperative', 'urgent_legal')),
  subject_line TEXT NOT NULL,
  recipient_channel TEXT,
  draft_content TEXT NOT NULL,
  supporting_evidence JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent_to_platform', 'escalated_to_labor_dept', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Document Drafts Table
CREATE TABLE IF NOT EXISTS public.document_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('invoice_request', 'work_experience_letter', 'lost_wage_statement', 'welfare_cover_letter', 'worker_self_declaration', 'dispute_notice')),
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Safety Checklists Table
CREATE TABLE IF NOT EXISTS public.safety_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checklist_date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL CHECK (type IN ('pre_shift', 'weather_extreme', 'vehicle_check', 'night_shift')),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. AI Chat Conversations & Messages
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Conversation',
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- Indexes for Performance
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_earnings_user_date ON public.earnings(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_grievances_user ON public.grievance_drafts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.document_drafts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_safety_user_date ON public.safety_checklists(user_id, checklist_date DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON public.chat_messages(conversation_id, created_at ASC);

-- ====================================================================
-- Row Level Security (RLS) Policies
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievance_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Earnings: Users can manage only their own earnings
CREATE POLICY "Users can select own earnings" ON public.earnings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own earnings" ON public.earnings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own earnings" ON public.earnings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own earnings" ON public.earnings FOR DELETE USING (auth.uid() = user_id);

-- Expenses: Users can manage only their own expenses
CREATE POLICY "Users can select own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Schemes & Knowledge: Publicly readable for all authenticated and anonymous users
CREATE POLICY "Public schemes viewable by anyone" ON public.schemes FOR SELECT USING (true);
CREATE POLICY "Public knowledge viewable by anyone" ON public.knowledge_sources FOR SELECT USING (true);

-- Grievances: Users can manage only their own grievances
CREATE POLICY "Users can select own grievances" ON public.grievance_drafts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own grievances" ON public.grievance_drafts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own grievances" ON public.grievance_drafts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own grievances" ON public.grievance_drafts FOR DELETE USING (auth.uid() = user_id);

-- Document Drafts: Users can manage only their own documents
CREATE POLICY "Users can select own documents" ON public.document_drafts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.document_drafts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.document_drafts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.document_drafts FOR DELETE USING (auth.uid() = user_id);

-- Safety Checklists: Users can manage only their own safety checklists
CREATE POLICY "Users can select own safety checklists" ON public.safety_checklists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own safety checklists" ON public.safety_checklists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own safety checklists" ON public.safety_checklists FOR UPDATE USING (auth.uid() = user_id);

-- Chat: Users can manage only their own conversations & messages
CREATE POLICY "Users can select own conversations" ON public.chat_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON public.chat_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.chat_conversations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can select own messages" ON public.chat_messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = chat_messages.conversation_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own messages" ON public.chat_messages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = chat_messages.conversation_id AND user_id = auth.uid()));
