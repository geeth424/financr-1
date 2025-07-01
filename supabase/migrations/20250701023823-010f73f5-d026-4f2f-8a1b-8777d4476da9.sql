
-- Create tax_reports table for storing user tax reports
CREATE TABLE public.tax_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  report_name TEXT NOT NULL DEFAULT 'Tax Report',
  tax_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  filing_status TEXT NOT NULL DEFAULT 'single',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Income fields
  w2_wages NUMERIC DEFAULT 0,
  self_employment_income NUMERIC DEFAULT 0,
  rental_income NUMERIC DEFAULT 0,
  dividend_income NUMERIC DEFAULT 0,
  interest_income NUMERIC DEFAULT 0,
  capital_gains NUMERIC DEFAULT 0,
  unemployment_income NUMERIC DEFAULT 0,
  social_security_income NUMERIC DEFAULT 0,
  other_income NUMERIC DEFAULT 0,
  
  -- Deduction fields
  use_standard_deduction BOOLEAN DEFAULT true,
  business_expenses NUMERIC DEFAULT 0,
  vehicle_expenses NUMERIC DEFAULT 0,
  home_office_deduction NUMERIC DEFAULT 0,
  retirement_contributions NUMERIC DEFAULT 0,
  student_loan_interest NUMERIC DEFAULT 0,
  health_insurance_premiums NUMERIC DEFAULT 0,
  charitable_contributions NUMERIC DEFAULT 0,
  medical_expenses NUMERIC DEFAULT 0,
  other_deductions NUMERIC DEFAULT 0,
  
  -- Calculated fields
  gross_income NUMERIC DEFAULT 0,
  adjusted_gross_income NUMERIC DEFAULT 0,
  taxable_income NUMERIC DEFAULT 0,
  federal_tax NUMERIC DEFAULT 0,
  self_employment_tax NUMERIC DEFAULT 0,
  total_tax_liability NUMERIC DEFAULT 0,
  estimated_refund NUMERIC DEFAULT 0
);

-- Add Row Level Security
ALTER TABLE public.tax_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for tax_reports
CREATE POLICY "Users can view their own tax reports" 
  ON public.tax_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tax reports" 
  ON public.tax_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax reports" 
  ON public.tax_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tax reports" 
  ON public.tax_reports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create tax_income_items table for detailed income tracking
CREATE TABLE public.tax_income_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tax_report_id UUID NOT NULL REFERENCES public.tax_reports(id) ON DELETE CASCADE,
  income_type TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for tax_income_items
ALTER TABLE public.tax_income_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage income items for their reports" 
  ON public.tax_income_items 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.tax_reports 
      WHERE id = tax_income_items.tax_report_id 
      AND user_id = auth.uid()
    )
  );

-- Create tax_deduction_items table for detailed deduction tracking
CREATE TABLE public.tax_deduction_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tax_report_id UUID NOT NULL REFERENCES public.tax_reports(id) ON DELETE CASCADE,
  deduction_type TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for tax_deduction_items
ALTER TABLE public.tax_deduction_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage deduction items for their reports" 
  ON public.tax_deduction_items 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.tax_reports 
      WHERE id = tax_deduction_items.tax_report_id 
      AND user_id = auth.uid()
    )
  );

-- Create function to update tax report calculations
CREATE OR REPLACE FUNCTION public.calculate_tax_report(report_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  report_record RECORD;
  standard_deduction_amount NUMERIC := 0;
  total_deductions NUMERIC := 0;
  se_tax NUMERIC := 0;
  fed_tax NUMERIC := 0;
BEGIN
  -- Get the tax report
  SELECT * INTO report_record FROM public.tax_reports WHERE id = report_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Calculate standard deduction based on filing status (2024 amounts)
  CASE report_record.filing_status
    WHEN 'single' THEN standard_deduction_amount := 14600;
    WHEN 'married_filing_jointly' THEN standard_deduction_amount := 29200;
    WHEN 'married_filing_separately' THEN standard_deduction_amount := 14600;
    WHEN 'head_of_household' THEN standard_deduction_amount := 21900;
    ELSE standard_deduction_amount := 14600;
  END CASE;
  
  -- Calculate total deductions
  IF report_record.use_standard_deduction THEN
    total_deductions := standard_deduction_amount;
  ELSE
    total_deductions := COALESCE(report_record.business_expenses, 0) +
                      COALESCE(report_record.vehicle_expenses, 0) +
                      COALESCE(report_record.home_office_deduction, 0) +
                      COALESCE(report_record.retirement_contributions, 0) +
                      COALESCE(report_record.student_loan_interest, 0) +
                      COALESCE(report_record.health_insurance_premiums, 0) +
                      COALESCE(report_record.charitable_contributions, 0) +
                      COALESCE(report_record.medical_expenses, 0) +
                      COALESCE(report_record.other_deductions, 0);
    
    -- Use standard deduction if itemized is lower
    IF total_deductions < standard_deduction_amount THEN
      total_deductions := standard_deduction_amount;
    END IF;
  END IF;
  
  -- Calculate self-employment tax (15.3% on 92.35% of SE income)
  IF report_record.self_employment_income > 0 THEN
    se_tax := (report_record.self_employment_income * 0.9235) * 0.153;
  END IF;
  
  -- Calculate gross income
  UPDATE public.tax_reports SET
    gross_income = COALESCE(w2_wages, 0) + COALESCE(self_employment_income, 0) + 
                   COALESCE(rental_income, 0) + COALESCE(dividend_income, 0) + 
                   COALESCE(interest_income, 0) + COALESCE(capital_gains, 0) + 
                   COALESCE(unemployment_income, 0) + COALESCE(social_security_income, 0) + 
                   COALESCE(other_income, 0),
    adjusted_gross_income = GREATEST(0, 
      COALESCE(w2_wages, 0) + COALESCE(self_employment_income, 0) + 
      COALESCE(rental_income, 0) + COALESCE(dividend_income, 0) + 
      COALESCE(interest_income, 0) + COALESCE(capital_gains, 0) + 
      COALESCE(unemployment_income, 0) + COALESCE(social_security_income, 0) + 
      COALESCE(other_income, 0) - (se_tax / 2)
    ),
    taxable_income = GREATEST(0,
      COALESCE(w2_wages, 0) + COALESCE(self_employment_income, 0) + 
      COALESCE(rental_income, 0) + COALESCE(dividend_income, 0) + 
      COALESCE(interest_income, 0) + COALESCE(capital_gains, 0) + 
      COALESCE(unemployment_income, 0) + COALESCE(social_security_income, 0) + 
      COALESCE(other_income, 0) - (se_tax / 2) - total_deductions
    ),
    self_employment_tax = se_tax,
    updated_at = now()
  WHERE id = report_id;
  
  -- Calculate federal tax using simplified brackets (2024 single filer rates)
  SELECT taxable_income INTO fed_tax FROM public.tax_reports WHERE id = report_id;
  
  IF fed_tax <= 11000 THEN
    fed_tax := fed_tax * 0.10;
  ELSIF fed_tax <= 44725 THEN
    fed_tax := 1100 + (fed_tax - 11000) * 0.12;
  ELSIF fed_tax <= 95375 THEN
    fed_tax := 5147 + (fed_tax - 44725) * 0.22;
  ELSIF fed_tax <= 182050 THEN
    fed_tax := 16290 + (fed_tax - 95375) * 0.24;
  ELSIF fed_tax <= 231250 THEN
    fed_tax := 37104 + (fed_tax - 182050) * 0.32;
  ELSIF fed_tax <= 578125 THEN
    fed_tax := 52832 + (fed_tax - 231250) * 0.35;
  ELSE
    fed_tax := 174238.25 + (fed_tax - 578125) * 0.37;
  END IF;
  
  -- Update final calculations
  UPDATE public.tax_reports SET
    federal_tax = fed_tax,
    total_tax_liability = fed_tax + se_tax,
    updated_at = now()
  WHERE id = report_id;
END;
$$;
