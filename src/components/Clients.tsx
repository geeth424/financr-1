
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User } from '@supabase/supabase-js';
import { Client, ClientFormData } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import ClientCard from './clients/ClientCard';
import ClientForm from './clients/ClientForm';
import ClientSearchFilter from './clients/ClientSearchFilter';
import ClientDetailDialog from './clients/ClientDetailDialog';

interface ClientsProps {
  user: User | null;
}

const Clients = ({ user }: ClientsProps) => {
  const { clients, loading, createClient, updateClient, deleteClient } = useClients(user);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    tax_id: '',
    notes: '',
    tags: [],
    status: 'Active'
  });

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, statusFilter]);

  const filterClients = () => {
    let filtered = clients;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      await updateClient(editingClient.id, formData);
    } else {
      await createClient(formData);
    }

    setIsDialogOpen(false);
    setEditingClient(null);
    setFormData({
      name: '', email: '', phone: '', address: '', company: '',
      tax_id: '', notes: '', tags: [], status: 'Active'
    });
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      company: client.company || '',
      tax_id: client.tax_id || '',
      notes: client.notes || '',
      tags: client.tags || [],
      status: client.status || 'Active'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    await deleteClient(id);
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailDialogOpen(true);
  };

  const resetForm = () => {
    setEditingClient(null);
    setFormData({
      name: '', email: '', phone: '', address: '', company: '',
      tax_id: '', notes: '', tags: [], status: 'Active'
    });
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
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            </DialogHeader>
            <ClientForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
              editingClient={editingClient}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ClientSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      <ClientDetailDialog
        client={selectedClient}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
      />

      {filteredClients.length === 0 && clients.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No clients match your search criteria</p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

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
