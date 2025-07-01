
-- Update the tax calculation function to be more accurate and U.S. tax code compliant
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
  agi NUMERIC := 0;
  taxable_income_calc NUMERIC := 0;
  se_deduction NUMERIC := 0;
BEGIN
  -- Get the tax report
  SELECT * INTO report_record FROM public.tax_reports WHERE id = report_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Calculate standard deduction based on filing status and tax year
  -- Using 2024 amounts (adjust based on tax year in production)
  CASE report_record.filing_status
    WHEN 'single' THEN 
      IF report_record.tax_year = 2024 THEN
        standard_deduction_amount := 14600;
      ELSIF report_record.tax_year = 2023 THEN
        standard_deduction_amount := 13850;
      ELSE
        standard_deduction_amount := 14600; -- Default to current year
      END IF;
    WHEN 'married_filing_jointly' THEN 
      IF report_record.tax_year = 2024 THEN
        standard_deduction_amount := 29200;
      ELSIF report_record.tax_year = 2023 THEN
        standard_deduction_amount := 27700;
      ELSE
        standard_deduction_amount := 29200;
      END IF;
    WHEN 'married_filing_separately' THEN 
      IF report_record.tax_year = 2024 THEN
        standard_deduction_amount := 14600;
      ELSIF report_record.tax_year = 2023 THEN
        standard_deduction_amount := 13850;
      ELSE
        standard_deduction_amount := 14600;
      END IF;
    WHEN 'head_of_household' THEN 
      IF report_record.tax_year = 2024 THEN
        standard_deduction_amount := 21900;
      ELSIF report_record.tax_year = 2023 THEN
        standard_deduction_amount := 20800;
      ELSE
        standard_deduction_amount := 21900;
      END IF;
    ELSE 
      standard_deduction_amount := 14600;
  END CASE;
  
  -- Calculate self-employment tax first (15.3% on 92.35% of SE income)
  -- This follows IRS guidelines for SE tax calculation
  IF COALESCE(report_record.self_employment_income, 0) > 400 THEN
    se_tax := (COALESCE(report_record.self_employment_income, 0) * 0.9235) * 0.153;
    se_deduction := se_tax * 0.5; -- Employer-equivalent portion deduction
  ELSE
    se_tax := 0;
    se_deduction := 0;
  END IF;
  
  -- Calculate Adjusted Gross Income (AGI)
  agi := COALESCE(report_record.w2_wages, 0) + 
         COALESCE(report_record.self_employment_income, 0) + 
         COALESCE(report_record.rental_income, 0) + 
         COALESCE(report_record.dividend_income, 0) + 
         COALESCE(report_record.interest_income, 0) + 
         COALESCE(report_record.capital_gains, 0) + 
         COALESCE(report_record.unemployment_income, 0) + 
         COALESCE(report_record.social_security_income, 0) + 
         COALESCE(report_record.other_income, 0) - 
         se_deduction - -- SE tax deduction
         COALESCE(report_record.retirement_contributions, 0) - -- IRA/401k contributions
         COALESCE(report_record.student_loan_interest, 0); -- Student loan interest deduction
  
  -- Calculate total deductions (standard vs itemized)
  IF report_record.use_standard_deduction THEN
    total_deductions := standard_deduction_amount;
  ELSE
    -- Calculate itemized deductions
    total_deductions := COALESCE(report_record.charitable_contributions, 0) +
                       GREATEST(0, COALESCE(report_record.medical_expenses, 0) - (agi * 0.075)) + -- Medical expenses over 7.5% of AGI
                       COALESCE(report_record.business_expenses, 0) +
                       COALESCE(report_record.vehicle_expenses, 0) +
                       COALESCE(report_record.home_office_deduction, 0) +
                       COALESCE(report_record.health_insurance_premiums, 0) +
                       COALESCE(report_record.other_deductions, 0);
    
    -- Use standard deduction if itemized is lower (taxpayer benefit)
    IF total_deductions < standard_deduction_amount THEN
      total_deductions := standard_deduction_amount;
    END IF;
  END IF;
  
  -- Calculate taxable income
  taxable_income_calc := GREATEST(0, agi - total_deductions);
  
  -- Calculate federal income tax using 2024 tax brackets for single filers
  -- (In production, this should be dynamic based on filing status and tax year)
  IF report_record.filing_status = 'single' THEN
    IF taxable_income_calc <= 11000 THEN
      fed_tax := taxable_income_calc * 0.10;
    ELSIF taxable_income_calc <= 44725 THEN
      fed_tax := 1100 + (taxable_income_calc - 11000) * 0.12;
    ELSIF taxable_income_calc <= 95375 THEN
      fed_tax := 5147 + (taxable_income_calc - 44725) * 0.22;
    ELSIF taxable_income_calc <= 182050 THEN
      fed_tax := 16290 + (taxable_income_calc - 95375) * 0.24;
    ELSIF taxable_income_calc <= 231250 THEN
      fed_tax := 37104 + (taxable_income_calc - 182050) * 0.32;
    ELSIF taxable_income_calc <= 578125 THEN
      fed_tax := 52832 + (taxable_income_calc - 231250) * 0.35;
    ELSE
      fed_tax := 174238.25 + (taxable_income_calc - 578125) * 0.37;
    END IF;
  ELSIF report_record.filing_status = 'married_filing_jointly' THEN
    -- 2024 tax brackets for married filing jointly
    IF taxable_income_calc <= 22000 THEN
      fed_tax := taxable_income_calc * 0.10;
    ELSIF taxable_income_calc <= 89450 THEN
      fed_tax := 2200 + (taxable_income_calc - 22000) * 0.12;
    ELSIF taxable_income_calc <= 190750 THEN
      fed_tax := 10294 + (taxable_income_calc - 89450) * 0.22;
    ELSIF taxable_income_calc <= 364200 THEN
      fed_tax := 32580 + (taxable_income_calc - 190750) * 0.24;
    ELSIF taxable_income_calc <= 462500 THEN
      fed_tax := 74208 + (taxable_income_calc - 364200) * 0.32;
    ELSIF taxable_income_calc <= 693750 THEN
      fed_tax := 105664 + (taxable_income_calc - 462500) * 0.35;
    ELSE
      fed_tax := 186601.25 + (taxable_income_calc - 693750) * 0.37;
    END IF;
  ELSE
    -- Default to single filer brackets for other statuses
    IF taxable_income_calc <= 11000 THEN
      fed_tax := taxable_income_calc * 0.10;
    ELSIF taxable_income_calc <= 44725 THEN
      fed_tax := 1100 + (taxable_income_calc - 11000) * 0.12;
    ELSIF taxable_income_calc <= 95375 THEN
      fed_tax := 5147 + (taxable_income_calc - 44725) * 0.22;
    ELSIF taxable_income_calc <= 182050 THEN
      fed_tax := 16290 + (taxable_income_calc - 95375) * 0.24;
    ELSIF taxable_income_calc <= 231250 THEN
      fed_tax := 37104 + (taxable_income_calc - 182050) * 0.32;
    ELSIF taxable_income_calc <= 578125 THEN
      fed_tax := 52832 + (taxable_income_calc - 231250) * 0.35;
    ELSE
      fed_tax := 174238.25 + (taxable_income_calc - 578125) * 0.37;
    END IF;
  END IF;
  
  -- Update the tax report with all calculations
  UPDATE public.tax_reports SET
    gross_income = COALESCE(w2_wages, 0) + COALESCE(self_employment_income, 0) + 
                   COALESCE(rental_income, 0) + COALESCE(dividend_income, 0) + 
                   COALESCE(interest_income, 0) + COALESCE(capital_gains, 0) + 
                   COALESCE(unemployment_income, 0) + COALESCE(social_security_income, 0) + 
                   COALESCE(other_income, 0),
    adjusted_gross_income = agi,
    taxable_income = taxable_income_calc,
    federal_tax = fed_tax,
    self_employment_tax = se_tax,
    total_tax_liability = fed_tax + se_tax,
    updated_at = now()
  WHERE id = report_id;
END;
$$;
