-- Add missing columns to clients table
ALTER TABLE public.clients 
ADD COLUMN tags TEXT[] DEFAULT '{}',
ADD COLUMN status TEXT DEFAULT 'Active',
ADD COLUMN tax_id TEXT;

-- Create index for better performance on tags and status filtering
CREATE INDEX idx_clients_tags ON public.clients USING GIN(tags);
CREATE INDEX idx_clients_status ON public.clients (status);