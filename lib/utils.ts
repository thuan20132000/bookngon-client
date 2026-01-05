import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import dayjs, { OpUnitType } from "dayjs"
import { AppointmentStatus } from "@/types/appointment"
import { CurrencyType } from "@/types/payment"
import { PaymentStatusType } from "@/types/appointment"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Format a datetime string to HH:mm
 * @param datetime - The datetime string to format
 * @param format - The format to use, defaults to HH:mm:ss
 * @returns The formatted datetime string
 */
export function formatTime(datetime: string | null, format: string = 'HH:mm:ss'): string {
  if (!datetime) return '-'
  return dayjs(datetime).format(format)
}

/**
 * Format a date string to YYYY-MM-DD
 * @param date - The date string to format
 * @returns The formatted date string
 */
export function formatDate(date: string | null, format: string = 'YYYY-MM-DD'): string {
  if (!date) return '-'
  return dayjs(date).format(format)
}


/**
 * Format a number to a percentage
 * @param number - The number to format
 * @param precision - The precision to use, defaults to 2
 * @returns The formatted number
 */
export function formatPercentage(number: number, precision: number = 2): string {
  return (number * 100).toFixed(precision) + '%'
}

/**
 * Round to lower minutes
 * @param date - The date to round
 * @param minutes - The minutes to round, defaults to minute
 * @returns The rounded minutes
 */
export function roundToLowerMinutes(date: string | Date, minutes: number): Date {
  const newDate = new Date(date);
  const currentMinutes = newDate.getMinutes();

  // Calculate how many minutes to subtract to round down to the nearest interval
  const minutesToSubtract = currentMinutes % minutes;

  // Set minutes to the lower interval
  newDate.setMinutes(currentMinutes - minutesToSubtract);

  // Reset seconds and milliseconds to 0
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
}

/**
 * format price to currency
 * @param price - The price to format
 * @param currency - The currency to use, defaults to USD
 * @returns The formatted price
 */
export function formatPrice(price: number, currency: CurrencyType = CurrencyType.USD): string {
  return new Intl.NumberFormat('en-US', 
    { style: 'currency', 
      currency: currency || CurrencyType.USD, 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(price)
}

/**
 * format duration to hours and minutes
 * @param duration - The duration to format
 * @returns The formatted duration
 */
export function formatDuration(duration: number): string {
  if (isNaN(duration)) return '0'
  return `${Math.floor(duration / 60)}h ${duration % 60}m`
}


/**
 * get initials from a string
 * @param fullName - The full name to get initials from
 * @returns The initials
 */
export function getInitials(fullName: string): string {
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Status colors for calendar events (hex colors for FullCalendar)
export const getAppointmentStatusColor = (status: AppointmentStatus, defaultColor: string = '#1890ff') => {
  switch (status) {
    case AppointmentStatus.Scheduled:
      return defaultColor;
    case AppointmentStatus.InService:
      return '#91e3ee';
    case AppointmentStatus.Cancelled:
      return '#FF6B6B';
    case AppointmentStatus.NoShow:
      return '#A19E9C';
    case AppointmentStatus.CheckedIn:
      return '#eaff8f';
    case AppointmentStatus.CheckedOut:
      return '#e2efda';
    case AppointmentStatus.PendingPayment:
      return '#2db7f5';
    default:
      return '#91caff';
  }
}

// Status labels for display
export const getAppointmentStatusLabel = (status: AppointmentStatus): string => {
  switch (status) {
    case AppointmentStatus.Scheduled:
      return 'Scheduled';
    case AppointmentStatus.InService:
      return 'In Service';
    case AppointmentStatus.CheckedIn:
      return 'Checked In';
    case AppointmentStatus.CheckedOut:
      return 'Checked Out';
    case AppointmentStatus.Cancelled:
      return 'Cancelled';
    case AppointmentStatus.NoShow:
      return 'No Show';
    case AppointmentStatus.PendingPayment:
      return 'Pending Payment';
    default:
      return status;
  }
}

// Payment status labels for display
export const getPaymentStatusLabel = (status: PaymentStatusType): string => {
  switch (status) {
    case PaymentStatusType.COMPLETED:
      return 'Completed';
    case PaymentStatusType.FAILED:
      return 'Failed';
    case PaymentStatusType.PENDING:
      return 'Pending';
    case PaymentStatusType.PROCESSING:
      return 'Processing';
    case PaymentStatusType.CANCELLED:
      return 'Cancelled';
    case PaymentStatusType.REFUNDED:
      return 'Refunded';
    case PaymentStatusType.PARTIALLY_REFUNDED:
      return 'Partially Refunded';
    case PaymentStatusType.NOT_PAID:
      return 'No Payment';
    default:
      return status;
  }
}