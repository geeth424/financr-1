
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar, DollarSign, Edit } from "lucide-react";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: 'Adobe Creative Suite',
      category: 'Software',
      cost: 52.99,
      frequency: 'Monthly',
      nextBilling: '2024-02-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'QuickBooks Online',
      category: 'Accounting',
      cost: 30.00,
      frequency: 'Monthly',
      nextBilling: '2024-02-05',
      status: 'active'
    },
    {
      id: 3,
      name: 'Spotify Premium',
      category: 'Entertainment',
      cost: 9.99,
      frequency: 'Monthly',
      nextBilling: '2024-02-10',
      status: 'active'
    },
    {
      id: 4,
      name: 'Microsoft Office 365',
      category: 'Software',
      cost: 99.99,
      frequency: 'Annual',
      nextBilling: '2024-08-15',
      status: 'active'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    category: 'Software',
    cost: '',
    frequency: 'Monthly',
    nextBilling: ''
  });

  const totalMonthly = subscriptions
    .filter(sub => sub.frequency === 'Monthly' && sub.status === 'active')
    .reduce((sum, sub) => sum + sub.cost, 0);
  
  const totalAnnual = subscriptions
    .filter(sub => sub.frequency === 'Annual' && sub.status === 'active')
    .reduce((sum, sub) => sum + sub.cost, 0);

  const categories = ['Software', 'Accounting', 'Entertainment', 'Utilities', 'Marketing', 'Other'];

  const handleAddSubscription = () => {
    if (newSubscription.name && newSubscription.cost && newSubscription.nextBilling) {
      const subscription = {
        id: Date.now(),
        name: newSubscription.name,
        category: newSubscription.category,
        cost: parseFloat(newSubscription.cost),
        frequency: newSubscription.frequency,
        nextBilling: newSubscription.nextBilling,
        status: 'active'
      };
      setSubscriptions([subscription, ...subscriptions]);
      setNewSubscription({ name: '', category: 'Software', cost: '', frequency: 'Monthly', nextBilling: '' });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Subscription Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {subscriptions.filter(sub => sub.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalMonthly.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${((totalMonthly * 12) + totalAnnual).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Subscription Management</CardTitle>
            <CardDescription>Track and manage your recurring subscriptions</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </Button>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-slate-50">
              <h3 className="font-semibold mb-4">Add New Subscription</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={newSubscription.name}
                    onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                    placeholder="e.g., Adobe Creative Suite"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newSubscription.category}
                    onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newSubscription.cost}
                    onChange={(e) => setNewSubscription({...newSubscription, cost: e.target.value})}
                    placeholder="9.99"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Billing Frequency</Label>
                  <select
                    id="frequency"
                    value={newSubscription.frequency}
                    onChange={(e) => setNewSubscription({...newSubscription, frequency: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="nextBilling">Next Billing Date</Label>
                  <Input
                    id="nextBilling"
                    type="date"
                    value={newSubscription.nextBilling}
                    onChange={(e) => setNewSubscription({...newSubscription, nextBilling: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubscription}>
                  Add Subscription
                </Button>
              </div>
            </div>
          )}

          {/* Subscriptions Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-full text-xs">
                      {subscription.category}
                    </span>
                  </TableCell>
                  <TableCell>{subscription.frequency}</TableCell>
                  <TableCell>{new Date(subscription.nextBilling).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(subscription.status)}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${subscription.cost.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriptions;
