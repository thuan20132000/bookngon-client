import { api } from "./base";
import { GiftCard, GiftCardPurchase, CreateGiftCardPurchasePayload, GiftCardPaymentIntent, GiftCardCheckoutSession, CreateGiftCardCheckoutSessionPayload } from "@/types/gift-card";

export interface CreateGiftCardPurchaseParams {
  business_id: string;
}

export interface GetGiftCardByCodeParams {
  business_id: string;
  code: string;
}

export interface GetGiftCardPurchaseParams {
  business_id: string;
  purchase_id: number;
}

export const giftCardApi = {
  // Verify a checkout session
  verifyCheckoutSession: async (sessionId: string, businessId: string) => {
    const response = await api.get(
      `/gift-card-checkouts/verify-session/`,
      { params: { business_id: businessId, session_id: sessionId } }
    );
    return response.data;
  },
  // Create a gift card purchase and get payment intent
  createGiftCardPurchase: async (payload: CreateGiftCardPurchasePayload) => {
    const response = await api.post<GiftCardPaymentIntent>(
      '/online-payment-intent/',
      payload
    );
    return response.data;
  },
  
  // Create a gift card checkout session
  createGiftCardCheckoutSession: async (payload: CreateGiftCardCheckoutSessionPayload) => {
    const response = await api.post<GiftCardCheckoutSession>(
      '/gift-card-checkouts/checkout-session/',
      payload
    );
    return response.data;
  },

  // Confirm payment completion
  confirmGiftCardPurchase: async (params: GetGiftCardPurchaseParams) => {
    const response = await api.post<GiftCardPurchase>(
      `/gift-cards/purchase/${params.purchase_id}/confirm`,
      { business_id: params.business_id }
    );
    return response.data;
  },

  // Get gift card purchase details
  getGiftCardPurchase: async (params: GetGiftCardPurchaseParams) => {
    const response = await api.get<GiftCardPurchase>(
      `/gift-cards/purchase/${params.purchase_id}`,
      { params: { business_id: params.business_id } }
    );
    return response.data;
  },

  // Get gift card by code
  getGiftCardByCode: async (params: GetGiftCardByCodeParams) => {
    const response = await api.get<GiftCard>(
      '/gift-cards/by-code',
      { params }
    );
    return response.data;
  },
};
