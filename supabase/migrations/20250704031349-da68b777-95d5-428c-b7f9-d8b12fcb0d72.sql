-- Create linked_accounts table for Plaid integration
CREATE TABLE public.linked_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plaid_item_id TEXT NOT NULL,
  plaid_access_token TEXT NOT NULL,
  account_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  account_subtype TEXT,
  current_balance NUMERIC NOT NULL DEFAULT 0,
  available_balance NUMERIC,
  mask TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plaid_transactions table
CREATE TABLE public.plaid_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  account_id TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  merchant_name TEXT,
  category TEXT[],
  transaction_date DATE NOT NULL,
  account_owner TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plaid_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for linked_accounts
CREATE POLICY "Users can view their own linked accounts" 
ON public.linked_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own linked accounts" 
ON public.linked_accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own linked accounts" 
ON public.linked_accounts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own linked accounts" 
ON public.linked_accounts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for plaid_transactions
CREATE POLICY "Users can view their own transactions" 
ON public.plaid_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.plaid_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.plaid_transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.plaid_transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_linked_accounts_user_id ON public.linked_accounts (user_id);
CREATE INDEX idx_linked_accounts_plaid_item_id ON public.linked_accounts (plaid_item_id);
CREATE INDEX idx_plaid_transactions_user_id ON public.plaid_transactions (user_id);
CREATE INDEX idx_plaid_transactions_account_id ON public.plaid_transactions (account_id);
CREATE INDEX idx_plaid_transactions_date ON public.plaid_transactions (transaction_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_linked_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_linked_accounts_updated_at
  BEFORE UPDATE ON public.linked_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_linked_accounts_updated_at();