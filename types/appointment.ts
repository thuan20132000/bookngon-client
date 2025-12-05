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


export interface Staff {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: number;
  role_name: string;
  is_active: boolean;
  created_at: string;
  photo?: string | null;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  staff_id: number;
}


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

export interface ClientCreate {
  id?: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  is_vip: boolean;
  notes: string;
  primary_business_id: number;
  date_of_birth: string | null;
}

export enum AppointmentStatus {
  Scheduled = 'scheduled',
  Cancelled = 'cancelled',
  NoShow = 'no_show',
  InService = 'in_service',
  CheckedIn = 'checked_in',
  CheckedOut = 'checked_out',
  PendingPayment = 'pending_payment',
}


export enum BookingSource {
  Online = 'online',
  Phone = 'phone',
  AI_Receptionist = 'ai_receptionist',
  WalkIn = 'walk_in',
}

export enum PaymentStatusType {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
  CHARGEBACK = "chargeback",
  NOT_PAID = "not_paid",
}


export interface Appointment {
  id: number;
  business: number;
  client: number | null;
  client_name: string;
  client_email?: string | null;
  client_phone?: string | null;
  business_name: string;
  appointment_date: string; // ISO date "YYYY-MM-DD"
  status: AppointmentStatus;
  notes?: string | null;
  internal_notes?: string | null;
  booked_by: number | null;
  booking_source: BookingSource;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  confirmed_at?: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
  start_at: string; // ISO datetime, with timezone
  end_at: string; // ISO datetime, with timezone
  metadata: Record<string, unknown>;
  payment_status: PaymentStatusType;
}

export interface AppointmentService {
  id: number;
  appointment?: number;
  service: number;
  service_name: string;
  service_duration: number;
  service_price: string;
  service_color_code: string;
  staff: number | null;
  staff_name: string;
  is_staff_request: boolean;
  custom_price?: string | null;
  custom_duration?: number | null;
  start_at: string; // ISO datetime, with timezone
  end_at: string; // ISO datetime, with timezone
  created_at?: string; // ISO datetime, with timezone
  updated_at?: string; // ISO datetime, with timezone
  is_active: boolean;
  tip_amount?: number | null;
  is_draft?: boolean | null;
}

export interface CreateAppointmentWithServicesPayload extends Partial<Appointment> {
  business_id: number;
  appointment_services: AppointmentService[];
  client_id: number | null;
}

export interface AppointmentWithServices extends Appointment {
  appointment_services: AppointmentService[];
}