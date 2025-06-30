
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
  created_at: string;
}

interface ClientsProps {
  user: User | null;
}

const Clients = ({ user }: ClientsProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      console.log('Fetching clients for user:', user?.id);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      
      console.log('Fetched clients:', data);
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch clients",
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
      if (editingClient) {
        console.log('Updating client:', editingClient.id, formData);
        const { error } = await supabase
          .from('clients')
          .update(formData)
          .eq('id', editingClient.id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Client updated successfully",
        });
      } else {
        console.log('Creating new client:', formData);
        const { error } = await supabase
          .from('clients')
          .insert([{ ...formData, user_id: user.id }]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Client created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', address: '', company: '', notes: '' });
      fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Error",
        description: "Failed to save client",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      company: client.company || '',
      notes: client.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      console.log('Deleting client:', id);
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading clients...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingClient(null);
              setFormData({ name: '', email: '', phone: '', address: '', company: '', notes: '' });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClient ? 'Update' : 'Create'} Client
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  {client.company && (
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Building className="h-3 w-3 mr-1" />
                      {client.company}
                    </p>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(client)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(client.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {client.email && (
                  <p className="text-sm flex items-center">
                    <Mail className="h-3 w-3 mr-2" />
                    {client.email}
                  </p>
                )}
                {client.phone && (
                  <p className="text-sm flex items-center">
                    <Phone className="h-3 w-3 mr-2" />
                    {client.phone}
                  </p>
                )}
                {client.address && (
                  <p className="text-sm text-muted-foreground">{client.address}</p>
                )}
                {client.notes && (
                  <p className="text-sm text-muted-foreground italic">{client.notes}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No clients found</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Client
          </Button>
        </div>
      )}
    </div>
  );
};

export default Clients;
