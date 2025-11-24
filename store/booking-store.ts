import { create } from "zustand";
import { Category, Service, Staff, TimeSlot } from "@/types/booking";

import { BOOKING_STEPS } from "@/enums/booking.enums";
import { Business } from "@/types/business";


export interface BookingState {

  // Business
  business?: Business | null;
  setBusiness: (business: Business | null) => void;
  // Step management
  currentStep: BOOKING_STEPS;
  // Booking data
  selectedServices: Service[];
  selectedStaff?: Staff;
  selectedTimeSlot?: TimeSlot;
  customerName: string;
  customerPhone: string;
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
  setSelectedServices: (services: Service[]) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: number) => void;
  toggleService: (service: Service) => void;

  // Staff actions
  setSelectedStaff: (staff?: Staff) => void;

  // Time slot actions
  setSelectedTimeSlot: (timeSlot?: TimeSlot) => void;

  // Customer info actions
  setCustomerInfo: (name: string, phone: string) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;

  // Utility actions
  resetBooking: () => void;
  canProceedToStep2: () => boolean;
  canProceedToStep3: () => boolean;
  canProceedToStep4: () => boolean;
}

const initialState = {
  currentStep: BOOKING_STEPS.SERVICE_SELECTION,
  selectedServices: [],
  selectedStaff: undefined,
  selectedTimeSlot: undefined,
  customerName: "",
  customerPhone: "",
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
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

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
    if (currentStep < BOOKING_STEPS.CUSTOMER_INFO) {
      set({ currentStep: currentStep + 1 });
    }
  },
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > BOOKING_STEPS.SERVICE_SELECTION) {
      set({ currentStep: currentStep - 1 });
    }
  },

  // Service actions
  setSelectedServices: (services) => set({ selectedServices: services }),
  addService: (service) => {
    const { selectedServices } = get();
    if (!selectedServices.some((s) => s.id === service.id)) {
      set({ selectedServices: [...selectedServices, service] });
    }
  },
  removeService: (serviceId) => {
    const { selectedServices } = get();
    set({ selectedServices: selectedServices.filter((s) => s.id !== serviceId) });
  },
  toggleService: (service) => {
    const { selectedServices } = get();
    const exists = selectedServices.some((s) => s.id === service.id);
    if (exists) {
      set({ selectedServices: selectedServices.filter((s) => s.id !== service.id) });
    } else {
      set({ selectedServices: [...selectedServices, service] });
    }
  },

  getTotalDuration: () => {
    const { selectedServices } = get();
    return selectedServices.reduce((sum, service) => sum + service.duration_minutes, 0);
  },
  getTotalPrice: () => {
    const { selectedServices } = get();
    return selectedServices.reduce((sum: number, service: Service) => sum + parseFloat(service.price.toString()), 0);
  },

  // Staff actions
  setSelectedStaff: (staff) => set({ selectedStaff: staff }),

  // Time slot actions
  setSelectedTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),

  // Customer info actions
  setCustomerInfo: (name, phone) => set({ customerName: name, customerPhone: phone }),
  setCustomerName: (name) => set({ customerName: name }),
  setCustomerPhone: (phone) => set({ customerPhone: phone }),

  // Utility actions
  resetBooking: () => set(initialState),
  canProceedToStep2: () => {
    const { selectedServices } = get();
    return selectedServices.length > 0;
  },
  canProceedToStep3: () => {
    const { selectedStaff, selectedTimeSlot } = get();
    return selectedStaff !== undefined && selectedTimeSlot !== undefined;
  },
  canProceedToStep4: () => {
    const { customerName, customerPhone } = get();
    return customerName.trim() !== "" && customerPhone.trim() !== "";
  },
}));

