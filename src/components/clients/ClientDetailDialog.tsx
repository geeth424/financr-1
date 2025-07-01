
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Client } from '@/types/client';
import ClientActivityTimeline from '../ClientActivityTimeline';
import ClientNotes from '../ClientNotes';

interface ClientDetailDialogProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

const ClientDetailDialog = ({ client, isOpen, onClose }: ClientDetailDialogProps) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'high value': return 'bg-purple-100 text-purple-800';
      case 'recurring': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{client.name} - Client Details</span>
            <Badge className={getStatusColor(client.status || 'Active')}>
              {client.status || 'Active'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">Name</p>
                  <p>{client.name}</p>
                </div>
                {client.email && (
                  <div>
                    <p className="font-medium">Email</p>
                    <p>{client.email}</p>
                  </div>
                )}
                {client.phone && (
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>{client.phone}</p>
                  </div>
                )}
                {client.company && (
                  <div>
                    <p className="font-medium">Company</p>
                    <p>{client.company}</p>
                  </div>
                )}
                {client.address && (
                  <div>
                    <p className="font-medium">Address</p>
                    <p>{client.address}</p>
                  </div>
                )}
                {client.tags && client.tags.length > 0 && (
                  <div>
                    <p className="font-medium">Tags</p>
                    <div className="flex gap-1 flex-wrap">
                      {client.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <ClientNotes clientId={client.id} />
          </div>
          <div>
            <ClientActivityTimeline clientId={client.name} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailDialog;
