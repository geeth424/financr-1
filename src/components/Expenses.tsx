
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText, Calendar, Edit } from "lucide-react";

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    { 
      id: 1, 
      description: 'Adobe Creative Suite', 
      category: 'Software', 
      amount: 52.99, 
      date: '2024-01-14', 
      recurring: true,
      receipt: true
    },
    { 
      id: 2, 
      description: 'Office Supplies', 
      category: 'Office', 
      amount: 125.43, 
      date: '2024-01-08', 
      recurring: false,
      receipt: true
    },
    { 
      id: 3, 
      description: 'Internet & Phone', 
      category: 'Utilities', 
      amount: 89.99, 
      date: '2024-01-05', 
      recurring: true,
      receipt: false
    },
    { 
      id: 4, 
      description: 'Client Lunch Meeting', 
      category: 'Meals', 
      amount: 67.50, 
      date: '2024-01-03', 
      recurring: false,
      receipt: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'Office',
    amount: '',
    date: '',
    recurring: false
  });

  const categories = ['Office', 'Software', 'Utilities', 'Meals', 'Travel', 'Marketing', 'Professional Services', 'Other'];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const recurringExpenses = expenses.filter(expense => expense.recurring).reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses.filter(expense => 
    new Date(expense.date).getMonth() === new Date().getMonth()
  ).reduce((sum, expense) => sum + expense.amount, 0);

  const expensesByCategory = categories.map(category => ({
    category,
    amount: expenses.filter(expense => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0),
    count: expenses.filter(expense => expense.category === category).length
  })).filter(item => item.amount > 0);

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.date) {
      const expense = {
        id: Date.now(),
        description: newExpense.description,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date,
        recurring: newExpense.recurring,
        receipt: false
      };
      setExpenses([expense, ...expenses]);
      setNewExpense({ description: '', category: 'Office', amount: '', date: '', recurring: false });
      setShowAddForm(false);
    }
  };

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Expense Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${thisMonthExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recurring</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${recurringExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly recurring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {expensesByCategory.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Categories Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>Breakdown of expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expensesByCategory.map((item) => (
              <div key={item.category} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{item.category}</h3>
                  <span className="text-sm text-muted-foreground">{item.count} items</span>
                </div>
                <div className="text-xl font-bold text-red-600">
                  ${item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expense Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Expense Tracking</CardTitle>
            <CardDescription>Track and categorize your business expenses</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-slate-50">
              <h3 className="font-semibold mb-4">Add New Expense</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    placeholder="e.g., Adobe Creative Suite"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={newExpense.recurring}
                  onChange={(e) => setNewExpense({...newExpense, recurring: e.target.checked})}
                />
                <Label htmlFor="recurring">Recurring expense</Label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>
                  Add Expense
                </Button>
              </div>
            </div>
          )}

          {/* Expenses Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {expense.recurring && <FileText className="h-4 w-4 text-blue-600" />}
                      {expense.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-full text-xs">
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {expense.receipt ? (
                      <span className="text-green-600 text-xs">✓ Uploaded</span>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    ${expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(expense.id)}>
                        <FileText className="h-4 w-4 text-red-600" />
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

export default Expenses;
