
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface IncomeRecord {
  id: string;
  description: string;
  amount: number;
  source_type: string;
  date_received: string;
  client_name?: string;
  payment_method?: string;
  is_recurring: boolean;
  recurring_frequency?: string;
  tax_category?: string;
  created_at: string;
}

interface IncomeProps {
  user: User | null;
}

const Income = ({ user }: IncomeProps) => {
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IncomeRecord | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    source_type: '',
    date_received: '',
    client_name: '',
    payment_method: '',
    is_recurring: false,
    recurring_frequency: '',
    tax_category: ''
  });
  const { toast } = useToast();

  const sourceTypes = [
    'Consulting',
    'Freelance',
    'Salary',
    'Rental Income',
    'Dividends',
    'Interest',
    'Commission',
    'Royalties',
    'Other'
  ];

  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Bank Transfer',
    'Check',
    'PayPal',
    'Stripe',
    'Other'
  ];

  const recurringFrequencies = [
    'Weekly',
    'Bi-weekly',
    'Monthly',
    'Quarterly',
    'Semi-annual',
    'Annual'
  ];

  const taxCategories = [
    '1099-NEC',
    '1099-MISC',
    'W-2',
    'Schedule C',
    'Schedule E',
    'Other'
  ];

  useEffect(() => {
    if (user) {
      fetchIncomeRecords();
    }
  }, [user]);

  const fetchIncomeRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('income_records')
        .select('*')
        .order('date_received', { ascending: false });

      if (error) throw error;
      setIncomeRecords(data || []);
    } catch (error) {
      console.error('Error fetching income records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch income records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const incomeData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        source_type: formData.source_type,
        date_received: formData.date_received,
        client_name: formData.client_name || null,
        payment_method: formData.payment_method || null,
        is_recurring: formData.is_recurring,
        recurring_frequency: formData.is_recurring ? formData.recurring_frequency : null,
        tax_category: formData.tax_category || null,
        user_id: user.id
      };

      if (editingRecord) {
        const { error } = await supabase
          .from('income_records')
          .update(incomeData)
          .eq('id', editingRecord.id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Income record updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('income_records')
          .insert([incomeData]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Income record created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingRecord(null);
      setFormData({
        description: '',
        amount: '',
        source_type: '',
        date_received: '',
        client_name: '',
        payment_method: '',
        is_recurring: false,
        recurring_frequency: '',
        tax_category: ''
      });
      fetchIncomeRecords();
    } catch (error) {
      console.error('Error saving income record:', error);
      toast({
        title: "Error",
        description: "Failed to save income record",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (record: IncomeRecord) => {
    setEditingRecord(record);
    setFormData({
      description: record.description,
      amount: record.amount.toString(),
      source_type: record.source_type,
      date_received: record.date_received,
      client_name: record.client_name || '',
      payment_method: record.payment_method || '',
      is_recurring: record.is_recurring,
      recurring_frequency: record.recurring_frequency || '',
      tax_category: record.tax_category || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this income record?')) return;

    try {
      const { error } = await supabase
        .from('income_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Income record deleted successfully",
      });
      fetchIncomeRecords();
    } catch (error) {
      console.error('Error deleting income record:', error);
      toast({
        title: "Error",
        description: "Failed to delete income record",
        variant: "destructive",
      });
    }
  };

  const totalIncome = incomeRecords.reduce((sum, record) => sum + record.amount, 0);

  if (loading) {
    return <div className="flex justify-center py-8">Loading income records...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Income</h1>
          <p className="text-muted-foreground">Total: ${totalIncome.toFixed(2)}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingRecord(null);
              setFormData({
                description: '',
                amount: '',
                source_type: '',
                date_received: '',
                client_name: '',
                payment_method: '',
                is_recurring: false,
                recurring_frequency: '',
                tax_category: ''
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingRecord ? 'Edit Income Record' : 'Add New Income Record'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date_received">Date Received *</Label>
                  <Input
                    id="date_received"
                    type="date"
                    value={formData.date_received}
                    onChange={(e) => setFormData({ ...formData, date_received: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source_type">Source Type *</Label>
                  <Select value={formData.source_type} onValueChange={(value) => setFormData({ ...formData, source_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select value={formData.payment_method} onValueChange={(value) => setFormData({ ...formData, payment_method: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tax_category">Tax Category</Label>
                  <Select value={formData.tax_category} onValueChange={(value) => setFormData({ ...formData, tax_category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax category" />
                    </SelectTrigger>
                    <SelectContent>
                      {taxCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_recurring"
                  checked={formData.is_recurring}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked as boolean })}
                />
                <Label htmlFor="is_recurring">Recurring Income</Label>
              </div>
              {formData.is_recurring && (
                <div>
                  <Label htmlFor="recurring_frequency">Recurring Frequency</Label>
                  <Select value={formData.recurring_frequency} onValueChange={(value) => setFormData({ ...formData, recurring_frequency: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {recurringFrequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRecord ? 'Update' : 'Create'} Income Record
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {incomeRecords.map((record) => (
          <Card key={record.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{record.description}</h3>
                  <p className="text-sm text-muted-foreground">{record.source_type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">${record.amount.toFixed(2)}</span>
                  {record.is_recurring && (
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  )}
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Date Received</p>
                  <p className="text-sm">{new Date(record.date_received).toLocaleDateString()}</p>
                </div>
                {record.client_name && (
                  <div>
                    <p className="text-sm font-medium">Client</p>
                    <p className="text-sm">{record.client_name}</p>
                  </div>
                )}
                {record.payment_method && (
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm">{record.payment_method}</p>
                  </div>
                )}
                {record.is_recurring && (
                  <div>
                    <p className="text-sm font-medium">Frequency</p>
                    <p className="text-sm">{record.recurring_frequency}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {incomeRecords.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No income records found</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Income Record
          </Button>
        </div>
      )}
    </div>
  );
};

export default Income;
