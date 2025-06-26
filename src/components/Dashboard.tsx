
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Home, 
  Users, 
  Calendar,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Total Income",
      value: "$12,847",
      change: "+12.5%",
      trend: "up",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: "Total Expenses",
      value: "$3,421",
      change: "-2.3%",
      trend: "down",
      icon: <TrendingDown className="w-5 h-5" />
    },
    {
      title: "Cash Flow",
      value: "$9,426",
      change: "+18.2%",
      trend: "up",
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      title: "Pending Invoices",
      value: "7",
      change: "+3",
      trend: "neutral",
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: "income",
      description: "Website Development - ABC Corp",
      amount: "$2,500",
      date: "Dec 24, 2024",
      status: "completed"
    },
    {
      id: 2,
      type: "expense",
      description: "Adobe Creative Suite",
      amount: "$52.99",
      date: "Dec 23, 2024",
      status: "completed"
    },
    {
      id: 3,
      type: "income",
      description: "Rental Income - 123 Main St",
      amount: "$1,200",
      date: "Dec 22, 2024",
      status: "completed"
    },
    {
      id: 4,
      type: "expense",
      description: "Office Supplies",
      amount: "$89.45",
      date: "Dec 21, 2024",
      status: "pending"
    }
  ];

  const upcomingItems = [
    {
      type: "invoice",
      description: "Invoice #INV-001 - XYZ Company",
      amount: "$1,500",
      dueDate: "Dec 30, 2024",
      priority: "high"
    },
    {
      type: "rent",
      description: "Rent Due - 456 Oak Avenue",
      amount: "$1,800",
      dueDate: "Jan 1, 2025",
      priority: "medium"
    },
    {
      type: "subscription",
      description: "QuickBooks Renewal",
      amount: "$30",
      dueDate: "Jan 5, 2025",
      priority: "low"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {stat.icon}
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4 mr-1" />}
                    {stat.trend === 'down' && <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'income' ? 
                            <ArrowUpRight className="w-4 h-4" /> : 
                            <ArrowDownRight className="w-4 h-4" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                        </p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Items */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingItems.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={
                          item.priority === 'high' ? 'destructive' : 
                          item.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {item.priority}
                        </Badge>
                        <p className="font-semibold text-gray-900">{item.amount}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">{item.description}</p>
                      <p className="text-xs text-gray-600">Due {item.dueDate}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Income</span>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Invoices</span>
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4" />
                <span className="hidden sm:inline">Expenses</span>
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Properties</span>
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Clients</span>
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Subscriptions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Overview</h3>
                    <p className="text-gray-600">Your complete financial dashboard is displayed above.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Placeholder content for other tabs */}
            {['income', 'invoices', 'expenses', 'properties', 'clients', 'subscriptions'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-gray-400 capitalize">{tab[0]}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">{tab} Management</h3>
                      <p className="text-gray-600 mb-4">Manage your {tab} efficiently with our comprehensive tools.</p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New {tab.slice(0, -1)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
