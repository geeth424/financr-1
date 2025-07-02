import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertTriangle, CheckCircle, Building2, CreditCard, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface BankAccount {
  id: string;
  account_id: string;
  institution_name: string;
  account_name: string;
  account_type: string;
  account_subtype: string;
  current_balance: number;
  available_balance?: number;
  last_sync: string;
  is_active: boolean;
  mask: string;
  created_at: string;
}

interface Transaction {
  id: string;
  account_id: string;
  transaction_id: string;
  amount: number;
  description: string;
  merchant_name?: string;
  category: string[];
  transaction_date: string;
  account_owner?: string;
  created_at: string;
}

interface LinkedAccountsProps {
  user: User | null;
}

const LinkedAccounts = ({ user }: LinkedAccountsProps) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingAccounts, setSyncingAccounts] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchLinkedAccounts();
      fetchRecentTransactions();
    }
  }, [user]);

  const fetchLinkedAccounts = async () => {
    try {
      // This would connect to your Plaid integration
      // For now, showing mock data structure
      setAccounts([
        {
          id: '1',
          account_id: 'plaid_account_1',
          institution_name: 'Chase Bank',
          account_name: 'Chase Freedom Checking',
          account_type: 'depository',
          account_subtype: 'checking',
          current_balance: 5240.32,
          available_balance: 5240.32,
          last_sync: new Date().toISOString(),
          is_active: true,
          mask: '1234',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          account_id: 'plaid_account_2',
          institution_name: 'American Express',
          account_name: 'Blue Cash Preferred',
          account_type: 'credit',
          account_subtype: 'credit card',
          current_balance: -892.45,
          last_sync: new Date().toISOString(),
          is_active: true,
          mask: '5678',
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching linked accounts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch linked accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      // Mock transaction data
      setTransactions([
        {
          id: '1',
          account_id: 'plaid_account_1',
          transaction_id: 'txn_001',
          amount: -45.67,
          description: 'UBER TRIP SAN FRANCISCO',
          merchant_name: 'Uber',
          category: ['Transportation', 'Taxi'],
          transaction_date: '2025-07-01',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          account_id: 'plaid_account_1',
          transaction_id: 'txn_002',
          amount: -12.50,
          description: 'STARBUCKS STORE #1234',
          merchant_name: 'Starbucks',
          category: ['Food and Drink', 'Coffee Shop'],
          transaction_date: '2025-07-01',
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleConnectAccount = async () => {
    setIsConnecting(true);
    try {
      // In a real implementation, this would:
      // 1. Call your backend endpoint that initiates Plaid Link
      // 2. Open Plaid Link modal
      // 3. Handle the link_token and public_token exchange
      // 4. Store account data in your database
      
      toast({
        title: "Info",
        description: "Plaid Link integration would open here to connect your bank account",
      });
      
      // Mock successful connection
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Bank account connected successfully! Syncing account data...",
        });
        fetchLinkedAccounts();
        setIsConnecting(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error connecting account:', error);
      toast({
        title: "Error",
        description: "Failed to connect bank account",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    setSyncingAccounts([...syncingAccounts, accountId]);
    try {
      // In a real implementation, this would call your backend to:
      // 1. Fetch latest account data from Plaid
      // 2. Update account balances
      // 3. Pull new transactions
      // 4. Categorize transactions for expense tracking
      
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Account synced successfully",
        });
        setSyncingAccounts(syncingAccounts.filter(id => id !== accountId));
        fetchLinkedAccounts();
        fetchRecentTransactions();
      }, 2000);
      
    } catch (error) {
      console.error('Error syncing account:', error);
      toast({
        title: "Error",
        description: "Failed to sync account",
        variant: "destructive",
      });
      setSyncingAccounts(syncingAccounts.filter(id => id !== accountId));
    }
  };

  const handleDisconnectAccount = async (accountId: string) => {
    try {
      // In a real implementation, this would:
      // 1. Call your backend to remove the account
      // 2. Optionally call Plaid to remove the item
      
      setAccounts(accounts.filter(account => account.id !== accountId));
      toast({
        title: "Success",
        description: "Account disconnected successfully",
      });
    } catch (error) {
      console.error('Error disconnecting account:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect account",
        variant: "destructive",
      });
    }
  };

  const getAccountIcon = (accountType: string) => {
    return accountType === 'credit' ? CreditCard : Building2;
  };

  const getBalanceColor = (balance: number, accountType: string) => {
    if (accountType === 'credit') {
      return balance > 0 ? 'text-red-600' : 'text-green-600';
    }
    return balance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatBalance = (balance: number) => {
    return Math.abs(balance).toFixed(2);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading linked accounts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Linked Accounts</h1>
          <p className="text-muted-foreground">Connect your bank accounts to automatically track transactions</p>
        </div>
        <Button onClick={handleConnectAccount} disabled={isConnecting}>
          {isConnecting ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {isConnecting ? 'Connecting...' : 'Connect Account'}
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No accounts connected</h3>
            <p className="text-muted-foreground mb-4">
              Connect your bank accounts to automatically import transactions and track your finances
            </p>
            <Button onClick={handleConnectAccount} disabled={isConnecting}>
              {isConnecting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {isConnecting ? 'Connecting...' : 'Connect Your First Account'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your bank connections are secured by 256-bit encryption. Financr never stores your banking credentials.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => {
                const AccountIcon = getAccountIcon(account.account_type);
                const isSyncing = syncingAccounts.includes(account.id);
                
                return (
                  <Card key={account.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <AccountIcon className="h-5 w-5" />
                          <div>
                            <h3 className="font-semibold">{account.institution_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {account.account_name} ••••{account.mask}
                            </p>
                          </div>
                        </div>
                        <Badge variant={account.is_active ? "default" : "secondary"}>
                          {account.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Current Balance</p>
                          <p className={`text-2xl font-bold ${getBalanceColor(account.current_balance, account.account_type)}`}>
                            ${formatBalance(account.current_balance)}
                          </p>
                        </div>
                        
                        {account.available_balance !== undefined && (
                          <div>
                            <p className="text-sm font-medium">Available Balance</p>
                            <p className="text-lg font-semibold">
                              ${formatBalance(account.available_balance)}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium">Last Synced</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(account.last_sync).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSyncAccount(account.id)}
                            disabled={isSyncing}
                            className="flex-1"
                          >
                            {isSyncing ? (
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3 mr-1" />
                            )}
                            {isSyncing ? 'Syncing...' : 'Sync'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisconnectAccount(account.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          {transaction.merchant_name ? (
                            <span className="text-sm font-semibold">
                              {transaction.merchant_name.charAt(0)}
                            </span>
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.merchant_name || transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.category.join(' • ')} • {new Date(transaction.transaction_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> This is a demo of Plaid integration. To fully implement, you'll need to:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Sign up for a Plaid developer account</li>
            <li>Set up Plaid Link in your backend</li>
            <li>Create database tables for accounts and transactions</li>
            <li>Implement secure token exchange and data synchronization</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LinkedAccounts;