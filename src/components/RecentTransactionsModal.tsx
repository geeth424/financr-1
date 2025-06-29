
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category?: string;
}

interface RecentTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const RecentTransactionsModal = ({ isOpen, onClose, user }: RecentTransactionsModalProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchRecentTransactions();
    }
  }, [isOpen, user]);

  const fetchRecentTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch recent income records
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_records')
        .select('id, description, amount, date_received, source_type')
        .order('date_received', { ascending: false })
        .limit(10);

      if (incomeError) throw incomeError;

      // Fetch recent expenses
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('id, description, amount, date_incurred, category')
        .order('date_incurred', { ascending: false })
        .limit(10);

      if (expenseError) throw expenseError;

      // Combine and sort transactions
      const combinedTransactions: Transaction[] = [
        ...(incomeData || []).map(item => ({
          id: item.id,
          type: 'income' as const,
          description: item.description,
          amount: item.amount,
          date: item.date_received,
          category: item.source_type
        })),
        ...(expenseData || []).map(item => ({
          id: item.id,
          type: 'expense' as const,
          description: item.description,
          amount: item.amount,
          date: item.date_incurred,
          category: item.category
        }))
      ];

      // Sort by date (most recent first)
      combinedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setTransactions(combinedTransactions.slice(0, 20));
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Recent Transactions
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading transactions...</div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No recent transactions found</p>
              <p className="text-sm text-muted-foreground">Start by adding income or expense records</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <Card key={`${transaction.type}-${transaction.id}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                          {transaction.category && (
                            <Badge variant="outline" className="text-xs">
                              {transaction.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`text-right ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      <p className="font-semibold">
                        {transaction.type === 'income' ? '+' : '-'}
                        ${transaction.amount.toFixed(2)}
                      </p>
                      <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecentTransactionsModal;
