
export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string; // ISO format "YYYY-MM-DD"
  age: number;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  full_address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  preferred_contact_method: string;
  notes?: string | null;
  medical_notes?: string | null;
  primary_business: number;
  primary_business_name: string;
  is_active: boolean;
  is_vip: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}