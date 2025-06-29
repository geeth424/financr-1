
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Users, 
  Home,
  CreditCard,
  Receipt,
  PlusCircle,
  Calendar,
  BarChart3
} from 'lucide-react';
import Clients from './Clients';
import Invoices from './Invoices';
import Expenses from './Expenses';
import Income from './Income';
import Properties from './Properties';
import Subscriptions from './Subscriptions';

interface DashboardProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

type DashboardView = 'overview' | 'clients' | 'invoices' | 'expenses' | 'income' | 'properties' | 'subscriptions';

const Dashboard = ({ user, onSignOut }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'invoices', name: 'Invoices', icon: FileText },
    { id: 'income', name: 'Income', icon: TrendingUp },
    { id: 'expenses', name: 'Expenses', icon: Receipt },
    { id: 'properties', name: 'Properties', icon: Home },
    { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'clients':
        return <Clients user={user} />;
      case 'invoices':
        return <Invoices user={user} />;
      case 'expenses':
        return <Expenses user={user} />;
      case 'income':
        return <Income user={user} />;
      case 'properties':
        return <Properties user={user} />;
      case 'subscriptions':
        return <Subscriptions user={user} />;
      default:
        return <DashboardOverview user={user} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
            </div>
            <Button onClick={onSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as DashboardView)}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardOverview = ({ user, setCurrentView }: { 
  user: User | null, 
  setCurrentView: (view: DashboardView) => void 
}) => {
  const quickActions = [
    { name: 'Add Client', icon: Users, action: () => setCurrentView('clients') },
    { name: 'Create Invoice', icon: FileText, action: () => setCurrentView('invoices') },
    { name: 'Log Expense', icon: Receipt, action: () => setCurrentView('expenses') },
    { name: 'Record Income', icon: TrendingUp, action: () => setCurrentView('income') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$0.00</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">$0.00</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Total clients</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.name}
                variant="outline"
                className="h-auto p-6 flex flex-col items-center space-y-2"
                onClick={action.action}
              >
                <Icon className="h-8 w-8" />
                <span className="text-sm font-medium">{action.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start by adding your first client or creating an invoice</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
