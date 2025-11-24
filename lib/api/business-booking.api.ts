import { api } from "./base";
import { Staff, TimeSlot } from "@/types/booking";

interface BusinessBookingParams {
  business_id: number;
};

export interface TimeSlotsParams {
  business_id: number;
  date: string;
  staff_id?: number;
  service_ids: number[];
  duration: number;
};

export const businessBookingApi = {
  getBusinessBooking: async () => {
    const response = await api.get('/business/booking');
    return response.data;
  },

  getCategoriesServices: async (params: BusinessBookingParams) => {
    const response = await api.get('/business-booking/categories-services', { params });
    return response.data;
  },

  getBusinessTechnicians: async (params: BusinessBookingParams) => {
    const response = await api.get<Staff[]>('/business-booking/technicians', { params });
    return response.data;
  },

  getTimeSlots: async (params: TimeSlotsParams) => {
    const response = await api.get<TimeSlot[]>('/business-booking/available-time-slots', { params });
    return response.data;
  },
};