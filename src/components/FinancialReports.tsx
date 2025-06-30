
import React, { useState, useEffect } from 'react';
import { Download, Calendar, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  unpaidInvoices: number;
  monthlyRecurring: number;
  taxDeductibleExpenses: number;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

interface FinancialReportsProps {
  user: User | null;
}

const FinancialReports = ({ user }: FinancialReportsProps) => {
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    unpaidInvoices: 0,
    monthlyRecurring: 0,
    taxDeductibleExpenses: 0
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState('quarterly');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFinancialData();
    }
  }, [user, dateRange]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);

      // Fetch income records
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_records')
        .select('amount, date_received')
        .gte('date_received', dateRange.startDate)
        .lte('date_received', dateRange.endDate);

      if (incomeError) throw incomeError;

      // Fetch expenses
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('amount, date_incurred, is_tax_deductible')
        .gte('date_incurred', dateRange.startDate)
        .lte('date_incurred', dateRange.endDate);

      if (expenseError) throw expenseError;

      // Fetch unpaid invoices
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('total_amount')
        .neq('status', 'paid');

      if (invoiceError) throw invoiceError;

      // Fetch active subscriptions
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('cost, billing_frequency')
        .eq('is_active', true);

      if (subscriptionError) throw subscriptionError;

      // Calculate totals
      const totalIncome = incomeData?.reduce((sum, record) => sum + Number(record.amount), 0) || 0;
      const totalExpenses = expenseData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      const unpaidInvoices = invoiceData?.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0) || 0;
      const taxDeductibleExpenses = expenseData?.filter(expense => expense.is_tax_deductible)
        .reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

      // Calculate monthly recurring costs
      const monthlyRecurring = subscriptionData?.reduce((sum, sub) => {
        const monthlyCost = sub.billing_frequency === 'yearly' ? Number(sub.cost) / 12 :
                           sub.billing_frequency === 'quarterly' ? Number(sub.cost) / 3 :
                           sub.billing_frequency === 'weekly' ? Number(sub.cost) * 4 : Number(sub.cost);
        return sum + monthlyCost;
      }, 0) || 0;

      setFinancialData({
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        unpaidInvoices,
        monthlyRecurring,
        taxDeductibleExpenses
      });

      // Generate monthly breakdown
      generateMonthlyBreakdown(incomeData || [], expenseData || []);

    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyBreakdown = (incomeData: any[], expenseData: any[]) => {
    const monthlyMap = new Map<string, MonthlyData>();
    
    // Process income data
    incomeData.forEach(record => {
      const date = new Date(record.date_received);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { month: monthName, income: 0, expenses: 0, net: 0 });
      }
      
      const existing = monthlyMap.get(monthKey)!;
      existing.income += Number(record.amount);
      monthlyMap.set(monthKey, existing);
    });

    // Process expense data
    expenseData.forEach(expense => {
      const date = new Date(expense.date_incurred);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { month: monthName, income: 0, expenses: 0, net: 0 });
      }
      
      const existing = monthlyMap.get(monthKey)!;
      existing.expenses += Number(expense.amount);
      monthlyMap.set(monthKey, existing);
    });

    // Calculate net income for each month
    const monthly = Array.from(monthlyMap.values()).map(data => ({
      ...data,
      net: data.income - data.expenses
    })).sort((a, b) => a.month.localeCompare(b.month));

    setMonthlyData(monthly);
  };

  const exportToCSV = async (reportType: string) => {
    try {
      let csvContent = '';
      let filename = '';

      if (reportType === 'summary') {
        csvContent = `Financial Summary Report (${dateRange.startDate} to ${dateRange.endDate})\n\n`;
        csvContent += `Metric,Amount\n`;
        csvContent += `Total Income,$${financialData.totalIncome.toFixed(2)}\n`;
        csvContent += `Total Expenses,$${financialData.totalExpenses.toFixed(2)}\n`;
        csvContent += `Net Income,$${financialData.netIncome.toFixed(2)}\n`;
        csvContent += `Unpaid Invoices,$${financialData.unpaidInvoices.toFixed(2)}\n`;
        csvContent += `Monthly Recurring Costs,$${financialData.monthlyRecurring.toFixed(2)}\n`;
        csvContent += `Tax Deductible Expenses,$${financialData.taxDeductibleExpenses.toFixed(2)}\n`;
        filename = `financial-summary-${new Date().toISOString().split('T')[0]}.csv`;
      } else if (reportType === 'monthly') {
        csvContent = `Monthly Breakdown Report (${dateRange.startDate} to ${dateRange.endDate})\n\n`;
        csvContent += `Month,Income,Expenses,Net Income\n`;
        monthlyData.forEach(month => {
          csvContent += `${month.month},$${month.income.toFixed(2)},$${month.expenses.toFixed(2)},$${month.net.toFixed(2)}\n`;
        });
        filename = `monthly-breakdown-${new Date().toISOString().split('T')[0]}.csv`;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: "Success",
        description: "Report exported successfully",
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading financial reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <div className="flex space-x-2">
          <Button onClick={() => exportToCSV('summary')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Summary
          </Button>
          <Button onClick={() => exportToCSV('monthly')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Monthly
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter by Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
          <TabsTrigger value="tax">Tax Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${financialData.totalIncome.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${financialData.totalExpenses.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                <TrendingUp className={`h-4 w-4 ${financialData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${financialData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${financialData.netIncome.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
                <Calendar className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">${financialData.unpaidInvoices.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Recurring</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${financialData.monthlyRecurring.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tax Deductible</CardTitle>
                <TrendingDown className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">${financialData.taxDeductibleExpenses.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="font-medium">{month.month}</div>
                    <div className="grid grid-cols-3 gap-8 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Income</p>
                        <p className="font-semibold text-green-600">${month.income.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Expenses</p>
                        <p className="font-semibold text-red-600">${month.expenses.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Net</p>
                        <p className={`font-semibold ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${month.net.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Summary for {new Date().getFullYear()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Total Business Income</p>
                    <p className="text-2xl font-bold text-green-600">${financialData.totalIncome.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Total Deductible Expenses</p>
                    <p className="text-2xl font-bold text-purple-600">${financialData.taxDeductibleExpenses.toFixed(2)}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Estimated Taxable Income</p>
                    <p className="text-2xl font-bold">
                      ${(financialData.totalIncome - financialData.taxDeductibleExpenses).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>This is an estimate for tax planning purposes. Consult with a tax professional for accurate filing.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReports;
