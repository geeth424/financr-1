import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  Home,
  Repeat,
  BarChart3,
  LogOut,
  Menu,
  X,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import Clients from './Clients';
import Invoices from './Invoices';
import Income from './Income';
import Expenses from './Expenses';
import Properties from './Properties';
import Subscriptions from './Subscriptions';
import FinancialReports from './FinancialReports';
import TaxReports from './TaxReports';

interface DashboardProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

const Dashboard = ({ user, onSignOut }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalClients: 0,
    totalIncome: 0,
    totalExpenses: 0,
    unpaidInvoices: 0,
    activeProperties: 0,
    activeSubscriptions: 0
  });
  const { toast } = useToast();

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
    { id: 'tax-reports', label: 'Tax Reports', icon: Calculator },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch clients count
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      // Fetch income total
      const { data: incomeData } = await supabase
        .from('income_records')
        .select('amount');

      // Fetch expenses total
      const { data: expenseData } = await supabase
        .from('expenses')
        .select('amount');

      // Fetch unpaid invoices
      const { data: unpaidInvoicesData } = await supabase
        .from('invoices')
        .select('total_amount')
        .neq('status', 'paid');

      // Fetch properties count
      const { count: propertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      // Fetch active subscriptions count
      const { count: subscriptionsCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const totalIncome = incomeData?.reduce((sum, record) => sum + Number(record.amount), 0) || 0;
      const totalExpenses = expenseData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      const unpaidInvoices = unpaidInvoicesData?.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0) || 0;

      setDashboardData({
        totalClients: clientsCount || 0,
        totalIncome,
        totalExpenses,
        unpaidInvoices,
        activeProperties: propertiesCount || 0,
        activeSubscriptions: subscriptionsCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await onSignOut();
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'clients':
        return <Clients user={user} />;
      case 'invoices':
        return <Invoices user={user} />;
      case 'income':
        return <Income user={user} />;
      case 'expenses':
        return <Expenses user={user} />;
      case 'properties':
        return <Properties user={user} />;
      case 'subscriptions':
        return <Subscriptions user={user} />;
      case 'tax-reports':
        return <TaxReports user={user} />;
      case 'reports':
        return <FinancialReports user={user} />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Welcome to Financr</h1>
                <p className="text-muted-foreground">Your financial operations dashboard</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalClients}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${dashboardData.totalIncome.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <CreditCard className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">${dashboardData.totalExpenses.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
                  <FileText className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">${dashboardData.unpaidInvoices.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Properties</CardTitle>
                  <Home className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{dashboardData.activeProperties}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <Repeat className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{dashboardData.activeSubscriptions}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Net Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${(dashboardData.totalIncome - dashboardData.totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(dashboardData.totalIncome - dashboardData.totalExpenses).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {(dashboardData.totalIncome - dashboardData.totalExpenses) >= 0 ? 'Profit' : 'Loss'} for the current period
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">Financr</h2>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b p-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
