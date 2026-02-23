import { api, apiHelpers } from "./base";
import { Appointment, AppointmentWithServices, Client, ClientCreate, CreateAppointmentWithServicesPayload, Staff, TimeSlot } from "@/types/appointment";

interface BusinessBookingParams {
  business_id: string;
};

export interface TimeSlotsParams {
  business_id: string;
  date: string;
  staff_id?: number;
  service_ids: number[];
  duration: number;
  interval_minutes?: number;
  client_id?: number | null;
};

export interface SearchClientByPhoneParams {
  business_id: string;
  phone: string;
};

export interface GetClientParams {
  business_id: string;
  client_id: string;
};

export interface GetClientAppointmentsParams {
  business_id: string;
  client_id: string;
};


export interface CancelAppointmentParams {
  business_id: string;
  client_id: string;
  appointment_id: number;
};

export interface GetAppointmentParams {
  appointment_id: string;
  business_id: string;
};

export const businessBookingApi = {

  getBusinessInfo: async (params: BusinessBookingParams) => {
    const response = await api.get('/business-booking/business-info', { params });
    return response.data;
  },

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

  getClientByPhone: async (params: SearchClientByPhoneParams) => {
    const response = await api.get<ClientCreate>('/business-booking/client-by-phone/', { params });
    return response.data;
  },

  createClient: async (client: ClientCreate) => {
    const response = await api.post<ClientCreate>('/business-booking/client/', client);
    return response.data;
  },

  updateClient: async (id: number, client: ClientCreate) => {
    const response = await api.put<ClientCreate>(`/business-booking/client/${id}`, client);
    return response.data;
  },

  createAppointmentWithServices: async (payload: CreateAppointmentWithServicesPayload) => {
    const response = await api.post<Appointment>('/business-booking/appointment/', payload);
    return response.data;
  },

  getClient: async (params: GetClientParams) => {
    const response = await api.get<Client>(`/business-booking/client-by-id/`, { params });
    return response.data;
  },

  getClientAppointments: async (params: GetClientAppointmentsParams) => {
    const response = await api.get<AppointmentWithServices[]>(`/business-booking/upcoming-appointments/`, { params });
    return response.data;
  },

  cancelAppointment: async (data: CancelAppointmentParams) => {
    const response = await api.post<Appointment>(`/business-booking/cancel-appointment/`, data);
    return response.data;
  },

  getAppointment: async (params: GetAppointmentParams) => {
    const response = await api.get<AppointmentWithServices>(`/business-booking/client-appointment/`, { params });
    return response.data;
  },
};