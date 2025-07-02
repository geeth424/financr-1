export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          tags: string[] | null
          tax_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          tax_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date_incurred: string
          description: string
          id: string
          is_tax_deductible: boolean | null
          notes: string | null
          payment_method: string | null
          property_id: string | null
          receipt_url: string | null
          subcategory: string | null
          updated_at: string | null
          user_id: string
          vendor: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date_incurred: string
          description: string
          id?: string
          is_tax_deductible?: boolean | null
          notes?: string | null
          payment_method?: string | null
          property_id?: string | null
          receipt_url?: string | null
          subcategory?: string | null
          updated_at?: string | null
          user_id: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date_incurred?: string
          description?: string
          id?: string
          is_tax_deductible?: boolean | null
          notes?: string | null
          payment_method?: string | null
          property_id?: string | null
          receipt_url?: string | null
          subcategory?: string | null
          updated_at?: string | null
          user_id?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      income_records: {
        Row: {
          amount: number
          client_name: string | null
          created_at: string | null
          date_received: string
          description: string
          id: string
          invoice_id: string | null
          is_recurring: boolean | null
          payment_method: string | null
          property_id: string | null
          recurring_frequency: string | null
          source_type: string
          tax_category: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          client_name?: string | null
          created_at?: string | null
          date_received: string
          description: string
          id?: string
          invoice_id?: string | null
          is_recurring?: boolean | null
          payment_method?: string | null
          property_id?: string | null
          recurring_frequency?: string | null
          source_type: string
          tax_category?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          client_name?: string | null
          created_at?: string | null
          date_received?: string
          description?: string
          id?: string
          invoice_id?: string | null
          is_recurring?: boolean | null
          payment_method?: string | null
          property_id?: string | null
          recurring_frequency?: string | null
          source_type?: string
          tax_category?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "income_records_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_address: string | null
          client_email: string
          client_name: string
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          invoice_number: string
          paid_at: string | null
          payment_link: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          client_address?: string | null
          client_email: string
          client_name: string
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          invoice_number: string
          paid_at?: string | null
          payment_link?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          client_address?: string | null
          client_email?: string
          client_name?: string
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          paid_at?: string | null
          payment_link?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          category: string | null
          cost: number
          created_at: string | null
          description: string | null
          id: string
          maintenance_date: string
          priority: string | null
          property_id: string
          receipt_url: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          vendor: string | null
        }
        Insert: {
          category?: string | null
          cost: number
          created_at?: string | null
          description?: string | null
          id?: string
          maintenance_date: string
          priority?: string | null
          property_id: string
          receipt_url?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          vendor?: string | null
        }
        Update: {
          category?: string | null
          cost?: number
          created_at?: string | null
          description?: string | null
          id?: string
          maintenance_date?: string
          priority?: string | null
          property_id?: string
          receipt_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          subscription_expires_at: string | null
          subscription_tier: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          created_at: string | null
          id: string
          lease_end_date: string | null
          lease_start_date: string | null
          monthly_rent: number | null
          name: string
          property_type: string | null
          purchase_price: number | null
          tenant_email: string | null
          tenant_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          lease_end_date?: string | null
          lease_start_date?: string | null
          monthly_rent?: number | null
          name: string
          property_type?: string | null
          purchase_price?: number | null
          tenant_email?: string | null
          tenant_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          lease_end_date?: string | null
          lease_start_date?: string | null
          monthly_rent?: number | null
          name?: string
          property_type?: string | null
          purchase_price?: number | null
          tenant_email?: string | null
          tenant_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renewal: boolean | null
          billing_frequency: string
          category: string | null
          cost: number
          created_at: string | null
          id: string
          is_active: boolean | null
          next_billing_date: string
          notes: string | null
          service_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renewal?: boolean | null
          billing_frequency: string
          category?: string | null
          cost: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          next_billing_date: string
          notes?: string | null
          service_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renewal?: boolean | null
          billing_frequency?: string
          category?: string | null
          cost?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          next_billing_date?: string
          notes?: string | null
          service_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tax_deduction_items: {
        Row: {
          amount: number
          created_at: string
          deduction_type: string
          description: string
          id: string
          tax_report_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          deduction_type: string
          description: string
          id?: string
          tax_report_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          deduction_type?: string
          description?: string
          id?: string
          tax_report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_deduction_items_tax_report_id_fkey"
            columns: ["tax_report_id"]
            isOneToOne: false
            referencedRelation: "tax_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_income_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          income_type: string
          tax_report_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          income_type: string
          tax_report_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          income_type?: string
          tax_report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_income_items_tax_report_id_fkey"
            columns: ["tax_report_id"]
            isOneToOne: false
            referencedRelation: "tax_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_reports: {
        Row: {
          adjusted_gross_income: number | null
          business_expenses: number | null
          capital_gains: number | null
          charitable_contributions: number | null
          created_at: string
          dividend_income: number | null
          estimated_refund: number | null
          federal_tax: number | null
          filing_status: string
          gross_income: number | null
          health_insurance_premiums: number | null
          home_office_deduction: number | null
          id: string
          interest_income: number | null
          medical_expenses: number | null
          other_deductions: number | null
          other_income: number | null
          rental_income: number | null
          report_name: string
          retirement_contributions: number | null
          self_employment_income: number | null
          self_employment_tax: number | null
          social_security_income: number | null
          student_loan_interest: number | null
          tax_year: number
          taxable_income: number | null
          total_tax_liability: number | null
          unemployment_income: number | null
          updated_at: string
          use_standard_deduction: boolean | null
          user_id: string
          vehicle_expenses: number | null
          w2_wages: number | null
        }
        Insert: {
          adjusted_gross_income?: number | null
          business_expenses?: number | null
          capital_gains?: number | null
          charitable_contributions?: number | null
          created_at?: string
          dividend_income?: number | null
          estimated_refund?: number | null
          federal_tax?: number | null
          filing_status?: string
          gross_income?: number | null
          health_insurance_premiums?: number | null
          home_office_deduction?: number | null
          id?: string
          interest_income?: number | null
          medical_expenses?: number | null
          other_deductions?: number | null
          other_income?: number | null
          rental_income?: number | null
          report_name?: string
          retirement_contributions?: number | null
          self_employment_income?: number | null
          self_employment_tax?: number | null
          social_security_income?: number | null
          student_loan_interest?: number | null
          tax_year?: number
          taxable_income?: number | null
          total_tax_liability?: number | null
          unemployment_income?: number | null
          updated_at?: string
          use_standard_deduction?: boolean | null
          user_id: string
          vehicle_expenses?: number | null
          w2_wages?: number | null
        }
        Update: {
          adjusted_gross_income?: number | null
          business_expenses?: number | null
          capital_gains?: number | null
          charitable_contributions?: number | null
          created_at?: string
          dividend_income?: number | null
          estimated_refund?: number | null
          federal_tax?: number | null
          filing_status?: string
          gross_income?: number | null
          health_insurance_premiums?: number | null
          home_office_deduction?: number | null
          id?: string
          interest_income?: number | null
          medical_expenses?: number | null
          other_deductions?: number | null
          other_income?: number | null
          rental_income?: number | null
          report_name?: string
          retirement_contributions?: number | null
          self_employment_income?: number | null
          self_employment_tax?: number | null
          social_security_income?: number | null
          student_loan_interest?: number | null
          tax_year?: number
          taxable_income?: number | null
          total_tax_liability?: number | null
          unemployment_income?: number | null
          updated_at?: string
          use_standard_deduction?: boolean | null
          user_id?: string
          vehicle_expenses?: number | null
          w2_wages?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_tax_report: {
        Args: Record<PropertyKey, never> | { report_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
