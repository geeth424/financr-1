
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Home, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Property {
  id: string;
  name: string;
  address: string;
  property_type: string;
  purchase_price?: number;
  monthly_rent?: number;
  tenant_name?: string;
  tenant_email?: string;
  lease_start_date?: string;
  lease_end_date?: string;
  created_at: string;
}

interface PropertiesProps {
  user: User | null;
}

const Properties = ({ user }: PropertiesProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    property_type: 'residential',
    purchase_price: '',
    monthly_rent: '',
    tenant_name: '',
    tenant_email: '',
    lease_start_date: '',
    lease_end_date: ''
  });
  const { toast } = useToast();

  const propertyTypes = [
    'residential',
    'commercial',
    'condo',
    'townhouse',
    'apartment',
    'single-family',
    'multi-family',
    'other'
  ];

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch properties",
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
      const propertyData = {
        name: formData.name,
        address: formData.address,
        property_type: formData.property_type,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        monthly_rent: formData.monthly_rent ? parseFloat(formData.monthly_rent) : null,
        tenant_name: formData.tenant_name || null,
        tenant_email: formData.tenant_email || null,
        lease_start_date: formData.lease_start_date || null,
        lease_end_date: formData.lease_end_date || null,
        user_id: user.id
      };

      if (editingProperty) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Property created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingProperty(null);
      setFormData({
        name: '',
        address: '',
        property_type: 'residential',
        purchase_price: '',
        monthly_rent: '',
        tenant_name: '',
        tenant_email: '',
        lease_start_date: '',
        lease_end_date: ''
      });
      fetchProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      address: property.address,
      property_type: property.property_type,
      purchase_price: property.purchase_price?.toString() || '',
      monthly_rent: property.monthly_rent?.toString() || '',
      tenant_name: property.tenant_name || '',
      tenant_email: property.tenant_email || '',
      lease_start_date: property.lease_start_date || '',
      lease_end_date: property.lease_end_date || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading properties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProperty(null);
              setFormData({
                name: '',
                address: '',
                property_type: 'residential',
                purchase_price: '',
                monthly_rent: '',
                tenant_name: '',
                tenant_email: '',
                lease_start_date: '',
                lease_end_date: ''
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Property Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="property_type">Property Type</Label>
                  <Select value={formData.property_type} onValueChange={(value) => setFormData({ ...formData, property_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="purchase_price">Purchase Price</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    step="0.01"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="monthly_rent">Monthly Rent</Label>
                <Input
                  id="monthly_rent"
                  type="number"
                  step="0.01"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tenant_name">Tenant Name</Label>
                  <Input
                    id="tenant_name"
                    value={formData.tenant_name}
                    onChange={(e) => setFormData({ ...formData, tenant_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="tenant_email">Tenant Email</Label>
                  <Input
                    id="tenant_email"
                    type="email"
                    value={formData.tenant_email}
                    onChange={(e) => setFormData({ ...formData, tenant_email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lease_start_date">Lease Start Date</Label>
                  <Input
                    id="lease_start_date"
                    type="date"
                    value={formData.lease_start_date}
                    onChange={(e) => setFormData({ ...formData, lease_start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lease_end_date">Lease End Date</Label>
                  <Input
                    id="lease_end_date"
                    type="date"
                    value={formData.lease_end_date}
                    onChange={(e) => setFormData({ ...formData, lease_end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProperty ? 'Update' : 'Create'} Property
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    {property.name}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {property.property_type.replace('-', ' ')}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(property)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{property.address}</p>
                </div>
                
                {property.purchase_price && (
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Purchase Price</p>
                      <p className="text-sm">${property.purchase_price.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                
                {property.monthly_rent && (
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Monthly Rent</p>
                      <p className="text-sm">${property.monthly_rent.toLocaleString()}/month</p>
                    </div>
                  </div>
                )}
                
                {property.tenant_name && (
                  <div>
                    <p className="text-sm font-medium">Current Tenant</p>
                    <p className="text-sm">{property.tenant_name}</p>
                    {property.tenant_email && (
                      <p className="text-xs text-muted-foreground">{property.tenant_email}</p>
                    )}
                  </div>
                )}
                
                {property.lease_start_date && property.lease_end_date && (
                  <div>
                    <p className="text-sm font-medium">Lease Period</p>
                    <p className="text-sm">
                      {new Date(property.lease_start_date).toLocaleDateString()} - {new Date(property.lease_end_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No properties found</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Property
          </Button>
        </div>
      )}
    </div>
  );
};

export default Properties;
