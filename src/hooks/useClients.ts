
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Client, ClientFormData } from '@/types/client';

export const useClients = (user: User | null) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching clients for user:', user.id);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      
      console.log('Fetched clients:', data);
      // Add default tags and status if not present
      const clientsWithDefaults = (data || []).map(client => ({
        ...client,
        tags: client.tags || [],
        status: client.status || 'Active'
      }));
      setClients(clientsWithDefaults);
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

  const createClient = async (formData: ClientFormData) => {
    if (!user) return;

    try {
      const clientData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        company: formData.company || null,
        notes: formData.notes || null,
        user_id: user.id
      };

      console.log('Creating new client:', clientData);
      const { error } = await supabase
        .from('clients')
        .insert([clientData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Client created successfully",
      });
      
      fetchClients();
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive",
      });
    }
  };

  const updateClient = async (clientId: string, formData: ClientFormData) => {
    if (!user) return;

    try {
      const clientData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        company: formData.company || null,
        notes: formData.notes || null,
        user_id: user.id
      };

      console.log('Updating client:', clientId, clientData);
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', clientId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
      
      fetchClients();
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
    }
  };

  const deleteClient = async (id: string) => {
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

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
};
