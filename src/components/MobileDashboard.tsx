import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ArrowUpDown, 
  FileText, 
  Users, 
  MoreHorizontal, 
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ChevronRight,
  Bell,
  User,
  Building2,
  Calculator,
  FolderOpen,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import SplineViewer from './SplineViewer';

interface MobileDashboardProps {
  user: SupabaseUser | null;
  onSignOut: () => Promise<void>;
}

const MobileDashboard = ({ user, onSignOut }: MobileDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFAB, setShowFAB] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    unpaidInvoices: 0,
    upcomingDeadlines: 3,
    totalClients: 0,
    activeProperties: 0
  });
  const { toast } = useToast();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: ArrowUpDown },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'more', label: 'More', icon: MoreHorizontal }
  ];

  const moreItems = [
    { id: 'properties', label: 'Properties', icon: Building2, description: 'Manage your rental properties' },
    { id: 'tax-reports', label: 'Tax Reports', icon: Calculator, description: 'View and generate tax reports' },
    { id: 'files', label: 'Files', icon: FolderOpen, description: 'Document storage and receipts' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'App preferences and account' }
  ];

  const quickActions = [
    { id: 'add-income', label: 'Add Income', icon: TrendingUp, color: 'bg-green-500' },
    { id: 'add-expense', label: 'Add Expense', icon: TrendingDown, color: 'bg-red-500' },
    { id: 'create-invoice', label: 'Create Invoice', icon: FileText, color: 'bg-blue-500' },
    { id: 'add-client', label: 'Add Client', icon: Users, color: 'bg-purple-500' }
  ];

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard summary data
      const { data: incomeData } = await supabase
        .from('income_records')
        .select('amount');

      const { data: expenseData } = await supabase
        .from('expenses')
        .select('amount');

      const { data: unpaidInvoicesData } = await supabase
        .from('invoices')
        .select('total_amount')
        .neq('status', 'paid');

      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      const { count: propertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      const totalIncome = incomeData?.reduce((sum, record) => sum + Number(record.amount), 0) || 0;
      const totalExpenses = expenseData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      const unpaidInvoices = unpaidInvoicesData?.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0) || 0;

      setDashboardData({
        totalIncome,
        totalExpenses,
        unpaidInvoices,
        upcomingDeadlines: 3,
        totalClients: clientsCount || 0,
        activeProperties: propertiesCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleQuickAction = (actionId: string) => {
    setShowFAB(false);
    toast({
      title: "Quick Action",
      description: `${actionId.replace('-', ' ')} feature would open here`,
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.email?.split('@')[0]}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 3D Hero Section */}
      <div className="mx-6 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-64">
        <SplineViewer 
          url="https://prod.spline.design/2N7aSkM8QZB6Y60l/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* KPI Cards */}
      <div className="px-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">Net Income</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                    ${(dashboardData.totalIncome - dashboardData.totalExpenses).toFixed(0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium">Expenses</p>
                  <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                    ${dashboardData.totalExpenses.toFixed(0)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Unpaid</p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    ${dashboardData.unpaidInvoices.toFixed(0)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Deadlines</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {dashboardData.upcomingDeadlines}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6">
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Clients</span>
              <span className="font-semibold">{dashboardData.totalClients}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Properties</span>
              <span className="font-semibold">{dashboardData.activeProperties}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">This Month</span>
              <Badge variant="secondary">+12% vs last month</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="px-6 pt-6 space-y-4">
      <h1 className="text-3xl font-bold">Transactions</h1>
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Consulting Payment</p>
                  <p className="text-sm text-gray-600">Client ABC Corp</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">+$2,500</p>
                <p className="text-sm text-gray-500">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold">Office Supplies</p>
                  <p className="text-sm text-gray-600">Staples</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600">-$125</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMore = () => (
    <div className="px-6 pt-6 space-y-6">
      <h1 className="text-3xl font-bold">More</h1>
      
      <div className="space-y-3">
        {moreItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <Button 
            variant="ghost" 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={onSignOut}
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'transactions':
        return renderTransactions();
      case 'invoices':
        return (
          <div className="px-6 pt-6">
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-gray-600 mt-2">Manage your invoices and payments</p>
          </div>
        );
      case 'clients':
        return (
          <div className="px-6 pt-6">
            <h1 className="text-3xl font-bold">Clients</h1>
            <p className="text-gray-600 mt-2">Manage your client relationships</p>
          </div>
        );
      case 'more':
        return renderMore();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sf-pro">
      {/* Main Content */}
      <div className="pb-20">
        {renderContent()}
      </div>

      {/* Floating Action Button */}
      {activeTab === 'dashboard' && (
        <>
          <Button
            className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-40"
            onClick={() => setShowFAB(!showFAB)}
          >
            <Plus className={`h-6 w-6 transition-transform ${showFAB ? 'rotate-45' : ''}`} />
          </Button>

          {/* Quick Actions Menu */}
          {showFAB && (
            <div className="fixed bottom-40 right-6 space-y-3 z-30">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div key={action.id} 
                       className="animate-fade-in"
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    <Button
                      size="sm"
                      className={`${action.color} hover:opacity-90 text-white shadow-lg rounded-full px-4`}
                      onClick={() => handleQuickAction(action.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Overlay */}
          {showFAB && (
            <div 
              className="fixed inset-0 bg-black/20 z-20"
              onClick={() => setShowFAB(false)}
            />
          )}
        </>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-around py-2 px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 px-2 py-3 ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;