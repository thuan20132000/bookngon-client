import { CurrencyType } from "./payment"

export interface BusinessSettings {
  id: number
  advance_booking_days: number
  min_advance_booking_hours: number
  max_advance_booking_days: number
  time_slot_interval: number
  buffer_time_minutes: number
  send_reminder_emails: boolean
  send_reminder_sms: boolean
  send_confirmation_sms: boolean
  reminder_hours_before: number
  currency: CurrencyType
  tax_rate: string
  require_payment_advance: boolean
  allow_online_booking: boolean
  require_client_phone: boolean
  require_client_email: boolean
  auto_confirm_appointments: boolean
  created_at: string
  updated_at: string
}

export interface Business {
  id: number
  name: string
  business_type: number
  business_type_name: string
  phone_number: string
  email: string
  website: string
  address: string
  city: string
  state_province: string
  postal_code: string
  country: string
  timezone: string
  status: string
  description: string
  logo: string | null
  created_at: string
  updated_at: string
}