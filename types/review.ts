import { AppointmentWithServices } from "./appointment";


export interface Review {
  id: number;
  appointment_date: string;
  business_name: string;
  appointment: number;
  appointment_details: AppointmentWithServices;
  rating: number;
  comment: string;
  is_visible: boolean;
  is_verified: boolean;
  reviewed_at: string;
  created_at: string;
}

export interface CreateReviewPayload {
  appointment: number;
  rating: number;
  comment?: string | null;
}

export interface UpdateReviewPayload {
  rating?: number | null;
  comment?: string | null;
}


export interface ReviewFilters {
  rating?: number;
  is_visible?: boolean;
  is_verified?: boolean;
  appointment_date?: string;
  business_id?: string;
  reviewed_date?: string;
}