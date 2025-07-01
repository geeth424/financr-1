
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
  tax_id?: string;
  tags?: string[];
  status?: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  tax_id: string;
  notes: string;
  tags: string[];
  status: string;
}
