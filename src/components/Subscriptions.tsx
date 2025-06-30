
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Subscription {
  id: string;
  service_name: string;
  cost: number;
  billing_frequency: string;
  next_billing_date: string;
  category?: string;
  notes?: string;
  is_active: boolean;
  auto_renewal: boolean;
  created_at: string;
}

interface SubscriptionsProps {
  user: User | null;
}

const Subscriptions = ({ user }: SubscriptionsProps) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState({
    service_name: '',
    cost: '',
    billing_frequency: 'monthly',
    next_billing_date: '',
    category: '',
    notes: '',
    is_active: true,
    auto_renewal: true
  });
  const { toast } = useToast();

  const billingFrequencies = ['weekly', 'monthly', 'quarterly', 'yearly'];
  const categories = ['Software', 'Entertainment', 'Utilities', 'Insurance', 'Marketing', 'Education', 'Other'];

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('next_billing_date', { ascending: true });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
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
      const subscriptionData = {
        service_name: formData.service_name,
        cost: parseFloat(formData.cost),
        billing_frequency: formData.billing_frequency,
        next_billing_date: formData.next_billing_date,
        category: formData.category || null,
        notes: formData.notes || null,
        is_active: formData.is_active,
        auto_renewal: formData.auto_renewal,
        user_id: user.id
      };

      if (editingSubscription) {
        const { error } = await supabase
          .from('subscriptions')
          .update(subscriptionData)
          .eq('id', editingSubscription.id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Subscription updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('subscriptions')
          .insert([subscriptionData]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Subscription created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingSubscription(null);
      setFormData({
        service_name: '',
        cost: '',
        billing_frequency: 'monthly',
        next_billing_date: '',
        category: '',
        notes: '',
        is_active: true,
        auto_renewal: true
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error saving subscription:', error);
      toast({
        title: "Error",
        description: "Failed to save subscription",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      service_name: subscription.service_name,
      cost: subscription.cost.toString(),
      billing_frequency: subscription.billing_frequency,
      next_billing_date: subscription.next_billing_date,
      category: subscription.category || '',
      notes: subscription.notes || '',
      is_active: subscription.is_active,
      auto_renewal: subscription.auto_renewal
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription",
        variant: "destructive",
      });
    }
  };

  const toggleSubscriptionStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: `Subscription ${!isActive ? 'activated' : 'deactivated'}`,
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error updating subscription status:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription status",
        variant: "destructive",
      });
    }
  };

  const getTotalMonthlyCost = () => {
    return subscriptions
      .filter(sub => sub.is_active)
      .reduce((total, sub) => {
        const monthlyCost = sub.billing_frequency === 'yearly' ? sub.cost / 12 :
                           sub.billing_frequency === 'quarterly' ? sub.cost / 3 :
                           sub.billing_frequency === 'weekly' ? sub.cost * 4 : sub.cost;
        return total + monthlyCost;
      }, 0);
  };

  const isUpcomingBilling = (date: string) => {
    const billingDate = new Date(date);
    const today = new Date();
    const diffTime = billingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading subscriptions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Monthly total: ${getTotalMonthlyCost().toFixed(2)}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingSubscription(null);
              setFormData({
                service_name: '',
                cost: '',
                billing_frequency: 'monthly',
                next_billing_date: '',
                category: '',
                notes: '',
                is_active: true,
                auto_renewal: true
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="service_name">Service Name *</Label>
                <Input
                  id="service_name"
                  value={formData.service_name}
                  onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost">Cost *</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing_frequency">Billing Frequency *</Label>
                  <Select value={formData.billing_frequency} onValueChange={(value) => setFormData({ ...formData, billing_frequency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {billingFrequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="next_billing_date">Next Billing Date *</Label>
                  <Input
                    id="next_billing_date"
                    type="date"
                    value={formData.next_billing_date}
                    onChange={(e) => setFormData({ ...formData, next_billing_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto_renewal"
                    checked={formData.auto_renewal}
                    onCheckedChange={(checked) => setFormData({ ...formData, auto_renewal: checked as boolean })}
                  />
                  <Label htmlFor="auto_renewal">Auto Renewal</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSubscription ? 'Update' : 'Create'} Subscription
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{subscription.service_name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {subscription.billing_frequency} • {subscription.category}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={subscription.is_active ? "default" : "secondary"}>
                    {subscription.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  {isUpcomingBilling(subscription.next_billing_date) && (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(subscription)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleSubscriptionStatus(subscription.id, subscription.is_active)}
                    >
                      {subscription.is_active ? 'Pause' : 'Resume'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(subscription.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Cost</p>
                  <p className="text-2xl font-bold">${subscription.cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Next Billing</p>
                  <p className="text-sm flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(subscription.next_billing_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Auto Renewal</p>
                  <p className="text-sm">{subscription.auto_renewal ? 'Yes' : 'No'}</p>
                </div>
                {subscription.notes && (
                  <div>
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground">{subscription.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subscriptions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No subscriptions found</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Subscription
          </Button>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
