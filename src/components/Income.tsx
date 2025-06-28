
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, DollarSign, Calendar, Edit, FileText, Trash2 } from "lucide-react";

const Income = () => {
  const [incomeEntries, setIncomeEntries] = useState([
    { id: 1, source: 'Web Design Project', client: 'Client A', amount: 2500, date: '2024-01-15', category: 'Freelance', recurring: false },
    { id: 2, source: 'Rental Income', client: 'Property 1', amount: 1800, date: '2024-01-10', category: 'Rental', recurring: true },
    { id: 3, source: 'Consulting Session', client: 'Client B', amount: 450, date: '2024-01-05', category: 'Consulting', recurring: false },
    { id: 4, source: 'Monthly Retainer', client: 'Client C', amount: 3000, date: '2024-01-01', category: 'Retainer', recurring: true }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newIncome, setNewIncome] = useState({
    source: '',
    client: '',
    amount: '',
    date: '',
    category: 'Freelance',
    recurring: false
  });

  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const recurringIncome = incomeEntries.filter(entry => entry.recurring).reduce((sum, entry) => sum + entry.amount, 0);

  const handleAddIncome = () => {
    if (newIncome.source && newIncome.amount && newIncome.date) {
      const income = {
        id: Date.now(),
        source: newIncome.source,
        client: newIncome.client,
        amount: parseFloat(newIncome.amount),
        date: newIncome.date,
        category: newIncome.category,
        recurring: newIncome.recurring
      };
      setIncomeEntries([income, ...incomeEntries]);
      setNewIncome({ source: '', client: '', amount: '', date: '', category: 'Freelance', recurring: false });
      setShowAddForm(false);
    }
  };

  const handleDelete = (id: number) => {
    setIncomeEntries(incomeEntries.filter(entry => entry.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Income Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recurring Income</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${recurringIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly recurring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income Sources</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {incomeEntries.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active sources
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Income Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Income Tracking</CardTitle>
            <CardDescription>Track all your income sources and payments</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Income
          </Button>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-slate-50">
              <h3 className="font-semibold mb-4">Add New Income</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Income Source</Label>
                  <Input
                    id="source"
                    value={newIncome.source}
                    onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
                    placeholder="e.g., Web Design Project"
                  />
                </div>
                <div>
                  <Label htmlFor="client">Client/Source</Label>
                  <Input
                    id="client"
                    value={newIncome.client}
                    onChange={(e) => setNewIncome({...newIncome, client: e.target.value})}
                    placeholder="e.g., Client Name"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newIncome.date}
                    onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddIncome}>
                  Add Income
                </Button>
              </div>
            </div>
          )}

          {/* Income Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomeEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {entry.recurring && <DollarSign className="h-4 w-4 text-blue-600" />}
                      {entry.source}
                    </div>
                  </TableCell>
                  <TableCell>{entry.client}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {entry.category}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    ${entry.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
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

export default Income;
