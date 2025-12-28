import { CurrencyType } from "./payment"

export interface OperatingHour {
  id: number
  day_of_week: number // 0 = Monday, 6 = Sunday
  day_name: string
  is_open: boolean
  open_time: string | null // e.g. "09:00:00" or null if closed
  close_time: string | null
  is_break_time: boolean
  break_start_time: string | null
  break_end_time: string | null
}

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
  timezone: string
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

export interface BusinessOnlineBooking {
  id: number
  business: number
  name: string
  slug: string
  logo: string | null
  description: string
  policy: string
  interval_minutes: number
  buffer_time_minutes: number
  is_active: boolean
  shareable_link: string
}

export interface BusinessInfo {
  id: number
  name: string
  phone_number: string
  email: string
  website: string
  address: string
  city: string
  state_province: string
  postal_code: string
  country: string
  description: string
  logo: string | null
  currency: string
  cost_per_minute: string
  status: string
  operating_hours: OperatingHour[]
  settings: BusinessSettings
  online_booking: BusinessOnlineBooking
}