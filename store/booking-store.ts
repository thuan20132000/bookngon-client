import { create } from "zustand";
import { Category, ClientCreate, Service, Staff, TimeSlot, AppointmentService, CreateAppointmentWithServicesPayload } from "@/types/appointment";

import { BOOKING_STEPS } from "@/enums/booking.enums";
import { Business, BusinessInfo } from "@/types/business";
import { businessBookingApi } from "@/lib/api/business-booking.api";


export interface BookingState {
  createAppointmentPayload: CreateAppointmentWithServicesPayload | null;
  setCreateAppointmentPayload: (payload: CreateAppointmentWithServicesPayload | null) => void;
  // Business
  business?: BusinessInfo | null;
  setBusiness: (business: BusinessInfo | null) => void;
  businessInfo?: BusinessInfo | null;
  setBusinessInfo: (businessInfo: BusinessInfo | null) => void;
  // Step management
  currentStep: BOOKING_STEPS;
  // Booking data
  selectedAppointmentServices: AppointmentService[];
  selectedStaff?: Staff | null;
  selectedTimeSlot?: TimeSlot | null;
  selectedDate?: Date | null;
  setSelectedDate: (date: Date | null) => void;
  clientInfo: ClientCreate | null;
  setClientInfo: (clientInfo: ClientCreate | null) => void;
  businessStaffs: Staff[];

  // Categories services
  categoriesServices: Category[];
  setCategoriesServices: (categoriesServices: Category[]) => void;

  // Actions
  setCurrentStep: (step: BOOKING_STEPS) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Total duration and price
  getTotalDuration: () => number;
  getTotalPrice: () => number;

  // Business staff actions
  setBusinessStaffs: (staffs: Staff[]) => void;
  getBusinessStaffs: () => Staff[];

  // Service actions
  setSelectedAppointmentServices: (appointmentServices: AppointmentService[]) => void;
  addAppointmentService: (appointmentService: AppointmentService) => void;
  removeAppointmentService: (appointmentService: AppointmentService) => void;
  // Staff actions
  setSelectedStaff: (staff?: Staff | null) => void;

  // Time slot actions
  setSelectedTimeSlot: (timeSlot?: TimeSlot | null) => void;

  // Customer info actions
  getClientInfo: () => ClientCreate | null;
  // Utility actions
  resetBooking: () => void;
  canProceedToTimeSlotStep: () => boolean;
  canProceedToCustomerInfoStep: () => boolean;
  initializeBusiness: (businessId: number) => Promise<void>;
}

const initialState = {
  currentStep: BOOKING_STEPS.SERVICE_SELECTION,
  selectedAppointmentServices: [],
  selectedStaff: null,
  selectedTimeSlot: null,
  selectedDate: null,
  clientInfo: null,
  businessStaffs: [],
  categoriesServices: [],
  business: null,
  createAppointmentPayload: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  // Initialize business
  initializeBusiness: async (businessId: number) => {
    try {
      const response = await businessBookingApi.getBusinessInfo({ business_id: businessId });
      if (response.success) {
        const businessInfo = response.results as BusinessInfo;
        set({ 
          business: businessInfo,
          businessInfo: businessInfo
        });
      }
    } catch (error) {
      console.error("Error initializing business", error);
    }
  },

  // Create appointment payload actions
  setCreateAppointmentPayload: (payload: CreateAppointmentWithServicesPayload | null) => set({
    createAppointmentPayload: payload
  }),

  // Business actions
  setBusiness: (business: BusinessInfo | null) => set({ business: business }),
  getBusiness: () => get().business,
  setBusinessInfo: (businessInfo) => set({ businessInfo: businessInfo }),
  getBusinessInfo: () => get().businessInfo,

  // Business staff actions
  setBusinessStaffs: (staffs) => set({ businessStaffs: staffs }),
  getBusinessStaffs: () => get().businessStaffs,

  // Categories services actions
  setCategoriesServices: (categoriesServices) => set({ categoriesServices: categoriesServices }),
  getCategoriesServices: () => get().categoriesServices,

  // Step management
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < BOOKING_STEPS.CONFIRMATION) {
      set({ currentStep: currentStep + 1 });
    }
  },
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > BOOKING_STEPS.SERVICE_SELECTION) {
      set({ selectedTimeSlot: null });
      set({ currentStep: currentStep - 1 });
    }
  },

  // Service actions
  setSelectedAppointmentServices: (appointmentServices) => set({ selectedAppointmentServices: appointmentServices }),
  addAppointmentService: (appointmentService) => {
    const { selectedAppointmentServices } = get();
    if (!selectedAppointmentServices.some((s) => s.service == appointmentService.service)) {
      set({ selectedAppointmentServices: [...selectedAppointmentServices, appointmentService] });
    }
  },
  removeAppointmentService: (appointmentService: AppointmentService) => {
    const { selectedAppointmentServices } = get();
    set({ selectedAppointmentServices: selectedAppointmentServices.filter((s) => s.service !== appointmentService.service) });
  },
  getTotalDuration: () => {
    const { selectedAppointmentServices } = get();
    return selectedAppointmentServices.reduce((sum, appointmentService) => sum + appointmentService.service_duration, 0);
  },
  getTotalPrice: () => {
    const { selectedAppointmentServices } = get();
    return selectedAppointmentServices.reduce((sum: number, appointmentService: AppointmentService) => sum + parseFloat(appointmentService.service_price.toString()), 0);
  },

  // Staff actions
  setSelectedStaff: (staff) => set({ selectedStaff: staff }),

  // Time slot actions
  setSelectedTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),

  // Date actions
  setSelectedDate: (date: Date | null) => set({ selectedDate: date }),

  // Customer info actions
  setClientInfo: (clientInfo: ClientCreate | null) => set({ clientInfo: clientInfo }),
  getClientInfo: () => get().clientInfo,
  // Utility actions
  resetBooking: () => set({
    currentStep: BOOKING_STEPS.SERVICE_SELECTION,
    selectedAppointmentServices: [],
    selectedStaff: null,
    selectedTimeSlot: null,
    selectedDate: null,
    clientInfo: null,
    businessStaffs: [],
    categoriesServices: [],
    createAppointmentPayload: null,
  }),
  canProceedToTimeSlotStep: () => {
    const { selectedAppointmentServices } = get();


    return selectedAppointmentServices.length > 0;
  },
  canProceedToCustomerInfoStep: () => {
    const { selectedTimeSlot, selectedDate } = get();

    if (!selectedDate) {
      return false;
    }
    if (!selectedTimeSlot) {
      return false;
    }

    return true;
  },
  canProceedToConfirmationStep: () => {
    return get().canProceedToTimeSlotStep() && get().canProceedToCustomerInfoStep();
  },
}));

