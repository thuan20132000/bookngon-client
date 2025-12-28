"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Clock, User, Phone, DollarSign, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentService } from "@/types/appointment";
import { useBookingStore } from "@/store/booking-store";
import { BOOKING_STEPS } from "@/enums/booking.enums";
import dayjs from "dayjs";

export function BookingConfirmation() {
  const {
    selectedAppointmentServices,
    selectedTimeSlot,
    selectedStaff,
    getClientInfo,
    getTotalDuration,
    getTotalPrice,
    resetBooking,
    setCurrentStep,
    createAppointmentPayload,
  } = useBookingStore();

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
          <p className="mt-2 text-gray-600">
            Your appointment has been successfully booked. We&apos;ve sent a confirmation to your phone.
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-6">
        {/* Services */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Services</h3>
          <div className="space-y-2">
            {selectedAppointmentServices?.map((appointmentService: AppointmentService) => (
              <div
                key={appointmentService.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{appointmentService.service_name}</p>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {appointmentService.service_name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {appointmentService.service_duration} min
                    </Badge>
                  </div>
                </div>
                <p className="font-semibold text-blue-600">${appointmentService.service_price}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Total */}
        <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">${getTotalPrice()}</p>
        </div>

        {/* Time & Date */}
        {selectedTimeSlot && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Calendar className="mt-0.5 h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{dayjs(selectedTimeSlot.start_time).format("dddd, DD MMM YYYY")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Clock className="mt-0.5 h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">
                  {dayjs(selectedTimeSlot.start_time).format("h:mm A")} -{" "}
                  {dayjs(selectedTimeSlot.end_time).format("h:mm A")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Staff */}
        {selectedStaff && (
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <User className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Technician</p>
              <p className="font-semibold">{selectedStaff.first_name} {selectedStaff.last_name}</p>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <MessageSquare className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Notes</p>
            <p className="font-normal text-gray-500 text-xs">{createAppointmentPayload?.notes}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <User className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{getClientInfo()?.first_name} {getClientInfo()?.last_name} { }</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Phone className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold">{getClientInfo()?.phone}</p>
            </div>
          </div>
        </div>


      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button className="w-full cursor-pointer" onClick={() => {
          resetBooking();
          setCurrentStep(BOOKING_STEPS.SERVICE_SELECTION);
        }}>
          Book Another Appointment
        </Button>
      </div>
    </div>
  );
}

