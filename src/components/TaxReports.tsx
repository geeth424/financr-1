
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calculator, FileText, Plus, Trash2, Download, Save, RefreshCw } from 'lucide-react';

interface TaxReport {
  id: string;
  report_name: string;
  tax_year: number;
  filing_status: string;
  w2_wages: number;
  self_employment_income: number;
  rental_income: number;
  dividend_income: number;
  interest_income: number;
  capital_gains: number;
  unemployment_income: number;
  social_security_income: number;
  other_income: number;
  use_standard_deduction: boolean;
  business_expenses: number;
  vehicle_expenses: number;
  home_office_deduction: number;
  retirement_contributions: number;
  student_loan_interest: number;
  health_insurance_premiums: number;
  charitable_contributions: number;
  medical_expenses: number;
  other_deductions: number;
  gross_income: number;
  adjusted_gross_income: number;
  taxable_income: number;
  federal_tax: number;
  self_employment_tax: number;
  total_tax_liability: number;
  estimated_refund: number;
  created_at: string;
  updated_at: string;
}

interface TaxReportsProps {
  user: User | null;
}

const TaxReports = ({ user }: TaxReportsProps) => {
  const [taxReports, setTaxReports] = useState<TaxReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<TaxReport | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [populatingData, setPopulatingData] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTaxReports();
    }
  }, [user]);

  const fetchTaxReports = async () => {
    try {
      const { data, error } = await supabase
        .from('tax_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTaxReports(data || []);
      if (data && data.length > 0 && !selectedReport) {
        setSelectedReport(data[0]);
      }
    } catch (error) {
      console.error('Error fetching tax reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tax reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const populateFromUserData = async () => {
    if (!user || !selectedReport) return;
    
    setPopulatingData(true);
    try {
      const currentYear = selectedReport.tax_year;
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;

      // Fetch income records for the tax year
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_records')
        .select('*')
        .gte('date_received', startDate)
        .lte('date_received', endDate);

      if (incomeError) throw incomeError;

      // Fetch expenses for the tax year
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('*')
        .gte('date_incurred', startDate)
        .lte('date_incurred', endDate);

      if (expenseError) throw expenseError;

      // Categorize income by source type
      let w2_wages = 0;
      let self_employment_income = 0;
      let rental_income = 0;
      let dividend_income = 0;
      let interest_income = 0;
      let other_income = 0;

      incomeData?.forEach(record => {
        const amount = Number(record.amount);
        switch (record.source_type?.toLowerCase()) {
          case 'salary':
          case 'w-2':
            w2_wages += amount;
            break;
          case 'consulting':
          case 'freelance':
          case '1099-nec':
          case 'schedule c':
            self_employment_income += amount;
            break;
          case 'rental income':
          case 'schedule e':
            rental_income += amount;
            break;
          case 'dividends':
            dividend_income += amount;
            break;
          case 'interest':
            interest_income += amount;
            break;
          default:
            other_income += amount;
        }
      });

      // Categorize deductible expenses
      let business_expenses = 0;
      let vehicle_expenses = 0;
      let home_office_deduction = 0;
      let health_insurance_premiums = 0;
      let charitable_contributions = 0;
      let medical_expenses = 0;
      let other_deductions = 0;

      expenseData?.forEach(expense => {
        if (expense.is_tax_deductible) {
          const amount = Number(expense.amount);
          const category = expense.category?.toLowerCase();
          const subcategory = expense.subcategory?.toLowerCase();
          
          switch (category) {
            case 'office supplies':
            case 'professional services':
            case 'software':
            case 'equipment':
            case 'business meals':
            case 'training':
              business_expenses += amount;
              break;
            case 'transportation':
            case 'travel':
              if (subcategory?.includes('vehicle') || subcategory?.includes('gas') || subcategory?.includes('mileage')) {
                vehicle_expenses += amount;
              } else {
                business_expenses += amount;
              }
              break;
            case 'utilities':
              if (subcategory?.includes('home') || subcategory?.includes('office')) {
                home_office_deduction += amount;
              } else {
                business_expenses += amount;
              }
              break;
            case 'insurance':
              if (subcategory?.includes('health')) {
                health_insurance_premiums += amount;
              } else {
                business_expenses += amount;
              }
              break;
            case 'charitable':
            case 'donations':
              charitable_contributions += amount;
              break;
            case 'medical':
            case 'healthcare':
              medical_expenses += amount;
              break;
            default:
              other_deductions += amount;
          }
        }
      });

      // Update the report with populated data
      const updatedReport = {
        w2_wages,
        self_employment_income,
        rental_income,
        dividend_income,
        interest_income,
        other_income,
        business_expenses,
        vehicle_expenses,
        home_office_deduction,
        health_insurance_premiums,
        charitable_contributions,
        medical_expenses,
        other_deductions
      };

      const { data, error } = await supabase
        .from('tax_reports')
        .update(updatedReport)
        .eq('id', selectedReport.id)
        .select()
        .single();

      if (error) throw error;

      setSelectedReport(data);
      setTaxReports(taxReports.map(r => r.id === data.id ? data : r));
      
      toast({
        title: "Success",
        description: "Tax report populated with your financial data",
      });

      // Auto-calculate after populating
      await calculateTaxes();

    } catch (error) {
      console.error('Error populating tax report:', error);
      toast({
        title: "Error",
        description: "Failed to populate tax report from your data",
        variant: "destructive",
      });
    } finally {
      setPopulatingData(false);
    }
  };

  const createNewReport = async () => {
    if (!user) return;

    try {
      const newReport = {
        user_id: user.id,
        report_name: `Tax Report ${new Date().getFullYear()}`,
        tax_year: new Date().getFullYear(),
        filing_status: 'single',
      };

      const { data, error } = await supabase
        .from('tax_reports')
        .insert([newReport])
        .select()
        .single();

      if (error) throw error;

      setTaxReports([data, ...taxReports]);
      setSelectedReport(data);
      setIsEditing(true);
      
      toast({
        title: "Success",
        description: "New tax report created",
      });
    } catch (error) {
      console.error('Error creating tax report:', error);
      toast({
        title: "Error",
        description: "Failed to create tax report",
        variant: "destructive",
      });
    }
  };

  const updateReport = async (updates: Partial<TaxReport>) => {
    if (!selectedReport) return;

    try {
      const { data, error } = await supabase
        .from('tax_reports')
        .update(updates)
        .eq('id', selectedReport.id)
        .select()
        .single();

      if (error) throw error;

      setSelectedReport(data);
      setTaxReports(taxReports.map(r => r.id === data.id ? data : r));
      
      toast({
        title: "Success",
        description: "Tax report updated",
      });
    } catch (error) {
      console.error('Error updating tax report:', error);
      toast({
        title: "Error",
        description: "Failed to update tax report",
        variant: "destructive",
      });
    }
  };

  const calculateTaxes = async () => {
    if (!selectedReport) return;

    try {
      const { error } = await supabase.rpc('calculate_tax_report', {
        report_id: selectedReport.id
      });

      if (error) throw error;

      // Refresh the report data
      const { data, error: fetchError } = await supabase
        .from('tax_reports')
        .select('*')
        .eq('id', selectedReport.id)
        .single();

      if (fetchError) throw fetchError;

      setSelectedReport(data);
      setTaxReports(taxReports.map(r => r.id === data.id ? data : r));
      
      toast({
        title: "Success",
        description: "Tax calculations updated according to current U.S. tax code",
      });
    } catch (error) {
      console.error('Error calculating taxes:', error);
      toast({
        title: "Error",
        description: "Failed to calculate taxes",
        variant: "destructive",
      });
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('tax_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      const updatedReports = taxReports.filter(r => r.id !== reportId);
      setTaxReports(updatedReports);
      
      if (selectedReport?.id === reportId) {
        setSelectedReport(updatedReports[0] || null);
      }
      
      toast({
        title: "Success",
        description: "Tax report deleted",
      });
    } catch (error) {
      console.error('Error deleting tax report:', error);
      toast({
        title: "Error",
        description: "Failed to delete tax report",
        variant: "destructive",
      });
    }
  };

  const exportReport = () => {
    if (!selectedReport) return;

    const reportData = `
U.S. TAX REPORT - ${selectedReport.tax_year}
Report Name: ${selectedReport.report_name}
Filing Status: ${selectedReport.filing_status.replace('_', ' ').toUpperCase()}

INCOME SUMMARY:
W-2 Wages: $${selectedReport.w2_wages?.toFixed(2) || '0.00'}
Self-Employment Income: $${selectedReport.self_employment_income?.toFixed(2) || '0.00'}
Rental Income: $${selectedReport.rental_income?.toFixed(2) || '0.00'}
Dividend Income: $${selectedReport.dividend_income?.toFixed(2) || '0.00'}
Interest Income: $${selectedReport.interest_income?.toFixed(2) || '0.00'}
Capital Gains: $${selectedReport.capital_gains?.toFixed(2) || '0.00'}
Other Income: $${selectedReport.other_income?.toFixed(2) || '0.00'}
GROSS INCOME: $${selectedReport.gross_income?.toFixed(2) || '0.00'}

DEDUCTIONS:
Standard/Itemized: ${selectedReport.use_standard_deduction ? 'Standard Deduction' : 'Itemized Deductions'}
Business Expenses: $${selectedReport.business_expenses?.toFixed(2) || '0.00'}
Vehicle Expenses: $${selectedReport.vehicle_expenses?.toFixed(2) || '0.00'}
Home Office Deduction: $${selectedReport.home_office_deduction?.toFixed(2) || '0.00'}
Health Insurance Premiums: $${selectedReport.health_insurance_premiums?.toFixed(2) || '0.00'}
Charitable Contributions: $${selectedReport.charitable_contributions?.toFixed(2) || '0.00'}
Medical Expenses: $${selectedReport.medical_expenses?.toFixed(2) || '0.00'}

TAX CALCULATIONS (Based on ${selectedReport.tax_year} U.S. Tax Code):
Adjusted Gross Income: $${selectedReport.adjusted_gross_income?.toFixed(2) || '0.00'}
Taxable Income: $${selectedReport.taxable_income?.toFixed(2) || '0.00'}
Federal Income Tax: $${selectedReport.federal_tax?.toFixed(2) || '0.00'}
Self-Employment Tax: $${selectedReport.self_employment_tax?.toFixed(2) || '0.00'}
TOTAL TAX LIABILITY: $${selectedReport.total_tax_liability?.toFixed(2) || '0.00'}

*This report is for informational purposes only. Please consult a qualified tax professional for official tax preparation and filing.
    `;

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax-report-${selectedReport.tax_year}-${selectedReport.report_name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Tax report exported successfully",
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading tax reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">U.S. Tax Reports</h1>
          <p className="text-muted-foreground">Generate compliant tax reports from your financial data</p>
        </div>
        <Button onClick={createNewReport} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Reports List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Your Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {taxReports.map((report) => (
              <div
                key={report.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedReport?.id === report.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="font-medium">{report.report_name}</div>
                <div className="text-sm opacity-75">Tax Year: {report.tax_year}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs">{report.filing_status.replace('_', ' ')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReport(report.id);
                    }}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {taxReports.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tax reports yet. Create your first one!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Report Details */}
        {selectedReport && (
          <div className="lg:col-span-3">
            <div className="flex gap-2 mb-4">
              <Button 
                onClick={populateFromUserData} 
                disabled={populatingData}
                className="flex items-center gap-2"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 ${populatingData ? 'animate-spin' : ''}`} />
                Populate from Your Data
              </Button>
              <Button onClick={calculateTaxes} className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Calculate Taxes
              </Button>
              <Button onClick={exportReport} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="deductions">Deductions</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="report_name">Report Name</Label>
                        <Input
                          id="report_name"
                          value={selectedReport.report_name}
                          onChange={(e) => updateReport({ report_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tax_year">Tax Year</Label>
                        <Input
                          id="tax_year"
                          type="number"
                          value={selectedReport.tax_year}
                          onChange={(e) => updateReport({ tax_year: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="filing_status">Filing Status</Label>
                      <Select
                        value={selectedReport.filing_status}
                        onValueChange={(value) => updateReport({ filing_status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married_filing_jointly">Married Filing Jointly</SelectItem>
                          <SelectItem value="married_filing_separately">Married Filing Separately</SelectItem>
                          <SelectItem value="head_of_household">Head of Household</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="income" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Income Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="w2_wages">W-2 Wages</Label>
                        <Input
                          id="w2_wages"
                          type="number"
                          step="0.01"
                          value={selectedReport.w2_wages || ''}
                          onChange={(e) => updateReport({ w2_wages: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="self_employment_income">Self-Employment Income</Label>
                        <Input
                          id="self_employment_income"
                          type="number"
                          step="0.01"
                          value={selectedReport.self_employment_income || ''}
                          onChange={(e) => updateReport({ self_employment_income: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rental_income">Rental Income</Label>
                        <Input
                          id="rental_income"
                          type="number"
                          step="0.01"
                          value={selectedReport.rental_income || ''}
                          onChange={(e) => updateReport({ rental_income: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dividend_income">Dividend Income</Label>
                        <Input
                          id="dividend_income"
                          type="number"
                          step="0.01"
                          value={selectedReport.dividend_income || ''}
                          onChange={(e) => updateReport({ dividend_income: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="interest_income">Interest Income</Label>
                        <Input
                          id="interest_income"
                          type="number"
                          step="0.01"
                          value={selectedReport.interest_income || ''}
                          onChange={(e) => updateReport({ interest_income: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="capital_gains">Capital Gains</Label>
                        <Input
                          id="capital_gains"
                          type="number"
                          step="0.01"
                          value={selectedReport.capital_gains || ''}
                          onChange={(e) => updateReport({ capital_gains: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unemployment_income">Unemployment Income</Label>
                        <Input
                          id="unemployment_income"
                          type="number"
                          step="0.01"
                          value={selectedReport.unemployment_income || ''}
                          onChange={(e) => updateReport({ unemployment_income: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="other_income">Other Income</Label>
                        <Input
                          id="other_income"
                          type="number"
                          step="0.01"
                          value={selectedReport.other_income || ''}
                          onChange={(e) => updateReport({ other_income: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deductions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Deductions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use_standard_deduction"
                        checked={selectedReport.use_standard_deduction}
                        onCheckedChange={(checked) => updateReport({ use_standard_deduction: checked })}
                      />
                      <Label htmlFor="use_standard_deduction">Use Standard Deduction</Label>
                    </div>

                    {!selectedReport.use_standard_deduction && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="business_expenses">Business Expenses</Label>
                          <Input
                            id="business_expenses"
                            type="number"
                            step="0.01"
                            value={selectedReport.business_expenses || ''}
                            onChange={(e) => updateReport({ business_expenses: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="vehicle_expenses">Vehicle Expenses</Label>
                          <Input
                            id="vehicle_expenses"
                            type="number"
                            step="0.01"
                            value={selectedReport.vehicle_expenses || ''}
                            onChange={(e) => updateReport({ vehicle_expenses: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="home_office_deduction">Home Office Deduction</Label>
                          <Input
                            id="home_office_deduction"
                            type="number"
                            step="0.01"
                            value={selectedReport.home_office_deduction || ''}
                            onChange={(e) => updateReport({ home_office_deduction: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="retirement_contributions">Retirement Contributions</Label>
                          <Input
                            id="retirement_contributions"
                            type="number"
                            step="0.01"
                            value={selectedReport.retirement_contributions || ''}
                            onChange={(e) => updateReport({ retirement_contributions: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="student_loan_interest">Student Loan Interest</Label>
                          <Input
                            id="student_loan_interest"
                            type="number"
                            step="0.01"
                            value={selectedReport.student_loan_interest || ''}
                            onChange={(e) => updateReport({ student_loan_interest: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="health_insurance_premiums">Health Insurance Premiums</Label>
                          <Input
                            id="health_insurance_premiums"
                            type="number"
                            step="0.01"
                            value={selectedReport.health_insurance_premiums || ''}
                            onChange={(e) => updateReport({ health_insurance_premiums: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="charitable_contributions">Charitable Contributions</Label>
                          <Input
                            id="charitable_contributions"
                            type="number"
                            step="0.01"
                            value={selectedReport.charitable_contributions || ''}
                            onChange={(e) => updateReport({ charitable_contributions: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="medical_expenses">Medical Expenses</Label>
                          <Input
                            id="medical_expenses"
                            type="number"
                            step="0.01"
                            value={selectedReport.medical_expenses || ''}
                            onChange={(e) => updateReport({ medical_expenses: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Income Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Gross Income:</span>
                        <span className="font-medium">${selectedReport.gross_income?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adjusted Gross Income:</span>
                        <span className="font-medium">${selectedReport.adjusted_gross_income?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxable Income:</span>
                        <span className="font-medium">${selectedReport.taxable_income?.toFixed(2) || '0.00'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tax Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Federal Income Tax:</span>
                        <span className="font-medium">${selectedReport.federal_tax?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Self-Employment Tax:</span>
                        <span className="font-medium">${selectedReport.self_employment_tax?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total Tax Liability:</span>
                        <span>${selectedReport.total_tax_liability?.toFixed(2) || '0.00'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">U.S. Tax Code Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <p><strong>Filing Status:</strong> {selectedReport.filing_status.replace('_', ' ')}</p>
                      <p><strong>Tax Year:</strong> {selectedReport.tax_year}</p>
                      <p><strong>Deduction Method:</strong> {selectedReport.use_standard_deduction ? 'Standard' : 'Itemized'}</p>
                      <p><strong>Tax Brackets Applied:</strong> {selectedReport.tax_year} Federal Income Tax Brackets</p>
                      <p><strong>Self-Employment Tax Rate:</strong> 15.3% (12.4% Social Security + 2.9% Medicare)</p>
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-xs text-yellow-800">
                          <strong>Important:</strong> This report follows current U.S. tax code for the specified tax year. 
                          Standard deduction amounts, tax brackets, and calculations are based on IRS guidelines. 
                          This is for informational purposes only - please consult a qualified tax professional for official tax preparation and filing.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!selectedReport && taxReports.length === 0 && (
          <div className="lg:col-span-3 flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Tax Reports</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first U.S. tax report</p>
              <Button onClick={createNewReport}>Create New Report</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxReports;
