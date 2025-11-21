// BookingCategory represents a category (e.g. "Dental Services")
export interface Category {
  id: number;
  business: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  is_online_booking: boolean;
  created_at: string;
  color_code?: string | null;
  icon?: string | null;
  image?: string | null;
  services: Service[];
}

// BookingService represents a service within a category (e.g. "Men's Cut")
export interface Service {
  id: number;
  category: number;
  category_name: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: string;
  is_active: boolean;
  requires_staff: boolean;
  max_capacity: number;
  is_online_booking: boolean;
  created_at: string;
  updated_at?: string;
  sort_order: number;
  color_code?: string;
  icon?: string | null;
  image?: string | null;
}
