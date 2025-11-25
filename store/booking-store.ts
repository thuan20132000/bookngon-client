import { create } from "zustand";
import { Category, ClientCreate, Service, Staff, TimeSlot, AppointmentService, CreateAppointmentWithServicesPayload } from "@/types/booking";

import { BOOKING_STEPS } from "@/enums/booking.enums";
import { Business } from "@/types/business";


export interface BookingState {
  createAppointmentPayload: CreateAppointmentWithServicesPayload | null;
  setCreateAppointmentPayload: (payload: CreateAppointmentWithServicesPayload | null) => void;
  // Business
  business?: Business | null;
  setBusiness: (business: Business | null) => void;
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
  business: {
    id: 1,
    name: "Style Studio Hair Salon 1",
    business_type: 1,
    business_type_name: "Hair Salon",
    phone_number: "+1-555-0123",
    email: "info@stylestudio.com",
    website: "https://stylestudio.com",
    address: "123 Main Street 2",
    city: "Toronto",
    state_province: "ON",
    postal_code: "M5V 3A8",
    country: "Canada",
    timezone: "America/Toronto",
    status: "active",
    description: "Professional hair salon offering cutting-edge styles and treatments",
    logo: null,
    created_at: "2025-11-19T06:42:03.424337Z",
    updated_at: "2025-11-23T06:29:31.264507Z"
  },
  createAppointmentPayload: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  // Create appointment payload actions
  setCreateAppointmentPayload: (payload: CreateAppointmentWithServicesPayload | null) => set({
    createAppointmentPayload: payload
  }),

  // Business actions
  setBusiness: (business) => set({ business: business }),
  getBusiness: () => get().business,

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
  resetBooking: () => set(initialState),
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

