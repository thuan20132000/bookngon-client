import { create } from "zustand";
import { BusinessInfo } from "@/types/business";
import { businessBookingApi } from "@/lib/api/business-booking.api";
import { giftCardApi } from "@/lib/api/gift-card.api";
import { GIFT_CARD_STEPS } from "@/enums/gift-card.enums";
import { CreateGiftCardPurchasePayload, GiftCardPurchase, GiftCardPaymentIntent, CreateGiftCardCheckoutSessionPayload, GiftCardCheckoutSession } from "@/types/gift-card";
import { CurrencyType } from "@/types/payment";

export interface GiftCardState {
  // Business
  businessInfo?: BusinessInfo | null;
  setBusinessInfo: (businessInfo: BusinessInfo | null) => void;
  
  // Step management
  currentStep: GIFT_CARD_STEPS;
  setCurrentStep: (step: GIFT_CARD_STEPS) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Gift card purchase data
  selectedAmount: number | null;
  setSelectedAmount: (amount: number | null) => void;
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  
  // Customer info
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  setCustomerEmail: (email: string) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  
  // Recipient info (optional)
  recipientEmail?: string;
  recipientName?: string;
  recipientPhone?: string;
  message?: string;
  setRecipientEmail: (email: string | undefined) => void;
  setRecipientName: (name: string | undefined) => void;
  setRecipientPhone: (phone: string | undefined) => void;
  setMessage: (message: string | undefined) => void;
  
  // Payment
  paymentIntent: GiftCardPaymentIntent | null;
  purchase: GiftCardPurchase | null;
  setPaymentIntent: (intent: GiftCardPaymentIntent | null) => void;
  setPurchase: (purchase: GiftCardPurchase | null) => void;
  
  // Actions
  initializeBusiness: (businessId: string) => Promise<void>;
  createCheckoutSession: () => Promise<GiftCardCheckoutSession | null>;
  resetGiftCard: () => void;
  canProceedToCustomerInfoStep: () => boolean;
  canProceedToPaymentStep: () => boolean;
  verifyCheckoutSession: (sessionId: string) => Promise<void>;
}

const initialState = {
  currentStep: GIFT_CARD_STEPS.AMOUNT_SELECTION,
  selectedAmount: null,
  currency: CurrencyType.CAD,
  customerEmail: "",
  customerName: "",
  customerPhone: "",
  recipientEmail: undefined,
  recipientName: undefined,
  recipientPhone: undefined,
  message: undefined,
  paymentIntent: null,
  purchase: null,
  businessInfo: null,
};

export const useGiftCardStore = create<GiftCardState>((set, get) => ({
  ...initialState,

  // Initialize business
  initializeBusiness: async (businessId: string) => {
    try {
      const response = await businessBookingApi.getBusinessInfo({ business_id: businessId });
      if (response.success) {
        const businessInfo = response.results as BusinessInfo;
        set({ 
          businessInfo: businessInfo,
          currency: (businessInfo.settings?.currency as CurrencyType) || CurrencyType.CAD,
        });
      }
    } catch (error) {
      console.error("Error initializing business", error);
    }
  },

  // Business actions
  setBusinessInfo: (businessInfo: BusinessInfo | null) => set({ businessInfo }),

  // Step management
  setCurrentStep: (step: GIFT_CARD_STEPS) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < GIFT_CARD_STEPS.CONFIRMATION) {
      set({ currentStep: currentStep + 1 });
    }
  },
  
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > GIFT_CARD_STEPS.AMOUNT_SELECTION) {
      set({ currentStep: currentStep - 1 });
    }
  },

  // Amount actions
  setSelectedAmount: (amount: number | null) => set({ selectedAmount: amount }),
  
  // Currency actions
  setCurrency: (currency: CurrencyType) => set({ currency }),

  // Customer info actions
  setCustomerEmail: (email: string) => set({ customerEmail: email }),
  setCustomerName: (name: string) => set({ customerName: name }),
  setCustomerPhone: (phone: string) => set({ customerPhone: phone }),
  // Recipient info actions
  setRecipientEmail: (email: string | undefined) => set({ recipientEmail: email }),
  setRecipientName: (name: string | undefined) => set({ recipientName: name }),
  setRecipientPhone: (phone: string | undefined) => set({ recipientPhone: phone }),
  setMessage: (message: string | undefined) => set({ message }),

  // Payment actions
  setPaymentIntent: (intent: GiftCardPaymentIntent | null) => set({ paymentIntent: intent }),
  setPurchase: (purchase: GiftCardPurchase | null) => set({ purchase }),

  // Create purchase and get payment intent
  createCheckoutSession: async (): Promise<GiftCardCheckoutSession | null> => {
    const { 
      businessInfo, 
      selectedAmount, 
      currency, 
      customerEmail, 
      recipientEmail, 
      recipientName, 
      recipientPhone,
      message 
    } = get();
    
    if (!businessInfo || !selectedAmount) {
      return null;
    }

    try {
      const payload: CreateGiftCardCheckoutSessionPayload = {
        business: businessInfo.id,
        amount: selectedAmount,
        currency: currency,
        recipient_email: recipientEmail || "",
        recipient_name: recipientName || "",
        recipient_phone: recipientPhone || "",
        message: message,
        success_url: `${window.location.origin}/gifts/return?business_id=${businessInfo.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/gifts?business_id=${businessInfo.id}&session_id={CHECKOUT_SESSION_ID}`,
      };

      const response = await giftCardApi.createGiftCardCheckoutSession(payload);
    
      return response?.results || null;
    } catch (error) {
      console.error("Error creating checkout session", error);
      return null;
    }
  },

  // Utility actions
  resetGiftCard: () => set({
    currentStep: GIFT_CARD_STEPS.AMOUNT_SELECTION,
    selectedAmount: null,
    currency: CurrencyType.CAD,
    customerEmail: "",
    customerName: "",
    customerPhone: "",
    recipientEmail: undefined,
    recipientName: undefined,
    recipientPhone: undefined,
    message: undefined,
    paymentIntent: null,
    purchase: null,
  }),

  canProceedToCustomerInfoStep: () => {
    const { selectedAmount } = get();
    return selectedAmount !== null && selectedAmount > 0;
  },

  canProceedToPaymentStep: (): boolean => {
    const { recipientEmail, recipientName } = get();
    if (!recipientEmail || !recipientName) {
      return false;
    }
    return recipientEmail.trim() !== "" && recipientName.trim() !== "";
  },

  verifyCheckoutSession: async (sessionId: string): Promise<void> => {
    const { businessInfo } = get();
    if (!businessInfo) {
      return;
    }
    const response = await giftCardApi.verifyCheckoutSession(sessionId, businessInfo.id);
    if (response?.results) {
      return;
    }
    throw new Error("Failed to verify checkout session");
  },
}));
