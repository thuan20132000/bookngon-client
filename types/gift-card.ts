import { CurrencyType } from "./payment";

export interface GiftCard {
  id: number;
  business: number;
  code: string;
  amount: string;
  currency: CurrencyType;
  balance: string;
  expires_at: string | null;
  is_active: boolean;
  is_redeemed: boolean;
  purchased_by: number | null;
  redeemed_by: number | null;
  purchased_at: string | null;
  redeemed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GiftCardPurchase {
  id: number;
  gift_card: number;
  business: number;
  amount: string;
  currency: CurrencyType;
  payment_intent_id: string;
  payment_status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  customer_email: string;
  customer_name: string;
  recipient_email?: string;
  recipient_name?: string;
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGiftCardPurchasePayload {
  business: string;
  purchaser?: string | null;
  recipient_name?: string;
  recipient_email?: string;
  recipient_phone?: string;
  initial_amount: number;
  currency?: CurrencyType;
  expires_at?: string | null;
  message?: string;
  notes?: string;
}

export interface GiftCardPaymentIntent {
  client_secret: string;
  payment_intent_id: string;
  payment_id: number;
  publishable_key: string;
}

export interface CreateGiftCardCheckoutSessionPayload {
  business: string;
  amount: number;
  currency: CurrencyType;
  recipient_email: string;
  recipient_name?: string;
  recipient_phone?: string;
  message?: string;
  success_url: string;
  cancel_url: string;
}

export interface GiftCardCheckoutSession {
  id: string;
  url: string;
}
