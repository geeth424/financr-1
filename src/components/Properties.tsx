
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, DollarSign, MapPin, Users, Edit } from "lucide-react";

const Properties = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: '123 Main Street',
      address: '123 Main Street, City, State 12345',
      type: 'Single Family',
      rent: 1800,
      tenant: 'John Doe',
      leaseStart: '2023-08-01',
      leaseEnd: '2024-07-31',
      status: 'occupied'
    },
    {
      id: 2,
      name: '456 Oak Avenue',
      address: '456 Oak Avenue, City, State 12345',
      type: 'Apartment',
      rent: 1200,
      tenant: 'Jane Smith',
      leaseStart: '2023-09-15',
      leaseEnd: '2024-09-14',
      status: 'occupied'
    },
    {
      id: 3,
      name: '789 Pine Road',
      address: '789 Pine Road, City, State 12345',
      type: 'Condo',
      rent: 1500,
      tenant: '',
      leaseStart: '',
      leaseEnd: '',
      status: 'vacant'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    type: 'Single Family',
    rent: '',
    tenant: '',
    leaseStart: '',
    leaseEnd: ''
  });

  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
  const monthlyIncome = properties.filter(p => p.status === 'occupied').reduce((sum, p) => sum + p.rent, 0);

  const handleAddProperty = () => {
    if (newProperty.name && newProperty.address && newProperty.rent) {
      const property = {
        id: Date.now(),
        name: newProperty.name,
        address: newProperty.address,
        type: newProperty.type,
        rent: parseFloat(newProperty.rent),
        tenant: newProperty.tenant,
        leaseStart: newProperty.leaseStart,
        leaseEnd: newProperty.leaseEnd,
        status: newProperty.tenant ? 'occupied' : 'vacant'
      };
      setProperties([property, ...properties]);
      setNewProperty({ name: '', address: '', type: 'Single Family', rent: '', tenant: '', leaseStart: '', leaseEnd: '' });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Property Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalProperties}
            </div>
            <p className="text-xs text-muted-foreground">
              Properties managed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Units</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {occupiedProperties}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {totalProperties} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${monthlyIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From rentals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Property Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Property Management</CardTitle>
            <CardDescription>Manage your rental properties and tenants</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-slate-50">
              <h3 className="font-semibold mb-4">Add New Property</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Property Name</Label>
                  <Input
                    id="name"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Property Type</Label>
                  <select
                    id="type"
                    value={newProperty.type}
                    onChange={(e) => setNewProperty({...newProperty, type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Single Family">Single Family</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newProperty.address}
                    onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                    placeholder="Full address"
                  />
                </div>
                <div>
                  <Label htmlFor="rent">Monthly Rent ($)</Label>
                  <Input
                    id="rent"
                    type="number"
                    value={newProperty.rent}
                    onChange={(e) => setNewProperty({...newProperty, rent: e.target.value})}
                    placeholder="1800"
                  />
                </div>
                <div>
                  <Label htmlFor="tenant">Tenant Name (Optional)</Label>
                  <Input
                    id="tenant"
                    value={newProperty.tenant}
                    onChange={(e) => setNewProperty({...newProperty, tenant: e.target.value})}
                    placeholder="Current tenant"
                  />
                </div>
                <div>
                  <Label htmlFor="leaseStart">Lease Start Date</Label>
                  <Input
                    id="leaseStart"
                    type="date"
                    value={newProperty.leaseStart}
                    onChange={(e) => setNewProperty({...newProperty, leaseStart: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="leaseEnd">Lease End Date</Label>
                  <Input
                    id="leaseEnd"
                    type="date"
                    value={newProperty.leaseEnd}
                    onChange={(e) => setNewProperty({...newProperty, leaseEnd: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProperty}>
                  Add Property
                </Button>
              </div>
            </div>
          )}

          {/* Properties Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Lease Term</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Monthly Rent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{property.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-full text-xs">
                      {property.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    {property.tenant || <span className="text-muted-foreground">Vacant</span>}
                  </TableCell>
                  <TableCell>
                    {property.leaseStart && property.leaseEnd ? (
                      <div className="text-sm">
                        <div>{new Date(property.leaseStart).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">to {new Date(property.leaseEnd).toLocaleDateString()}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No lease</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(property.status)}`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    ${property.rent.toLocaleString()}
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

export default Properties;
