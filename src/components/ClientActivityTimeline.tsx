
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, FileText, DollarSign, Calendar, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'invoice' | 'payment' | 'note' | 'email' | 'call';
  description: string;
  amount?: number;
  created_at: string;
  status?: string;
}

interface ClientActivityTimelineProps {
  clientId: string;
}

const ClientActivityTimeline = ({ clientId }: ClientActivityTimelineProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientActivities();
  }, [clientId]);

  const fetchClientActivities = async () => {
    try {
      // Fetch invoices for this client
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_name', clientId);

      // Fetch income records for this client
      const { data: income } = await supabase
        .from('income_records')
        .select('*')
        .eq('client_name', clientId);

      // Combine and format activities
      const allActivities: ActivityItem[] = [];

      invoices?.forEach(invoice => {
        allActivities.push({
          id: invoice.id,
          type: 'invoice',
          description: `Invoice ${invoice.invoice_number} created`,
          amount: invoice.total_amount,
          created_at: invoice.created_at,
          status: invoice.status
        });
      });

      income?.forEach(record => {
        allActivities.push({
          id: record.id,
          type: 'payment',
          description: `Payment received: ${record.description}`,
          amount: record.amount,
          created_at: record.created_at
        });
      });

      // Sort by date (newest first)
      allActivities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching client activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'invoice': return <FileText className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'note': return <MessageCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'invoice': return 'bg-blue-500';
      case 'payment': return 'bg-green-500';
      case 'email': return 'bg-purple-500';
      case 'call': return 'bg-orange-500';
      case 'note': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading activity timeline...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)} text-white`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(activity.created_at), 'MMM dd, yyyy at h:mm a')}
                    </p>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className="font-semibold">${activity.amount.toFixed(2)}</p>
                    )}
                    {activity.status && (
                      <Badge variant="outline" className="text-xs">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No activity found for this client</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientActivityTimeline;
