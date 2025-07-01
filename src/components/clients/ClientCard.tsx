
import React from 'react';
import { Building, Mail, Phone, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types/client';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onViewDetails: (client: Client) => void;
}

const ClientCard = ({ client, onEdit, onDelete, onViewDetails }: ClientCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'high value': return 'bg-purple-100 text-purple-800';
      case 'recurring': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold">{client.name}</h3>
            {client.company && (
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Building className="h-3 w-3 mr-1" />
                {client.company}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(client.status || 'Active')}>
                {client.status || 'Active'}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(client)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(client)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(client.id)}
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
          {client.tags && client.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-2">
              {client.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {client.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{client.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
