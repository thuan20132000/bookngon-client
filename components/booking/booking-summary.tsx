"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { LoyaltyLoginSheet } from "../shared/sheet";
import { AppointmentService, CreateAppointmentWithServicesPayload } from "@/types/appointment";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import dayjs from "dayjs";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { businessBookingApi } from "@/lib/api/business-booking.api";
import { toast } from "sonner";

export function BookingSummary() {
  const [isShowClientInfoSheet, setIsShowClientInfoSheet] = useState(false);
  const {
    selectedAppointmentServices,
    selectedTimeSlot,
    selectedDate,
    selectedStaff,
    getTotalDuration,
    getTotalPrice,
    clientInfo,
    setClientInfo,
    business,
    nextStep,
    previousStep,
    createAppointmentPayload,
    setCreateAppointmentPayload,
  } = useBookingStore();
  const { isLoggedIn, loggedInClient, setLoggedInClient, logout } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn && loggedInClient && !clientInfo) {
      setClientInfo(loggedInClient);
    }
  }, [isLoggedIn, loggedInClient]);

  const handleLogout = () => {
    logout();
    setLoggedInClient(null);
    setClientInfo(null);
  };

  const handleConfirmBooking = async () => {
    if (!business) return;

    try {
      toast.loading("Creating appointment...", {
        description: "We're preparing your appointment.",
        position: 'top-center',
        className: "bg-blue-500 text-white mt-50",
      });
      const startAt = dayjs(selectedTimeSlot?.start_time)
        .format("YYYY-MM-DDTHH:mm:ssZ");
      const endAt = dayjs(selectedTimeSlot?.start_time)
        .add(getTotalDuration(), 'minutes')
        .format("YYYY-MM-DDTHH:mm:ssZ");
      const payload: CreateAppointmentWithServicesPayload = {
        appointment_date: dayjs(selectedDate).format("YYYY-MM-DD"),
        appointment_services: selectedAppointmentServices,
        start_at: startAt,
        end_at: endAt,
        business_id: business?.id.toString() || '',
        client_id: clientInfo?.id || null,
        notes: createAppointmentPayload?.notes || "",
      }

      payload.metadata = {
        is_rescheduled: false,
        is_cancelled: false,
        is_send_confirmation_sms: true,
        is_send_reminder_sms: true,
        appointment_services: selectedAppointmentServices,
        ...payload.metadata,
      }

      await businessBookingApi.createAppointmentWithServices(payload);
      toast.dismiss();
      toast.success("Appointment created successfully", {
        description: "We've sent a confirmation to your phone.",
        duration: 3000,
        position: 'top-center',
      })
      nextStep();
    } catch (error) {
      console.error("Error creating appointment", error);
      toast.error("Error creating appointment", {
        description: "Please try again.",
        duration: 3000,
        position: 'top-center',
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="pt-6 border-b border-gray-200">
        <div className="space-y-2">
          {/* services */}
          <p className="font-semibold text-gray-900">Services</p>
          {selectedAppointmentServices.map((appointmentService: AppointmentService) => {
            return (
              <div key={appointmentService.id}>
                <div className="flex items-center justify-between">
                  <p className="font-bold">{appointmentService.service_name}</p>
                  <p className="font-bold">${appointmentService.service_price}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">~{appointmentService.service_duration} min</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="pt-6 border-gray-200">
        <div className="space-y-2">
          <p className="font-semibold text-gray-900">Booking Summary</p>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 font-semibold">Date</p>
            <p className="text-gray-900 font-bold">{dayjs(selectedDate).format("dddd, DD MMM YYYY")}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 font-semibold">Time</p>
            <p className="text-gray-900 font-bold">{dayjs(selectedTimeSlot?.start_time).format("h:mm A")}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 font-semibold">Technician</p>
            <p className="text-gray-900 font-bold">{selectedStaff?.first_name || 'Anyone'}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 font-semibold">Total Duration</p>
            <p className="text-gray-900 font-bold">~{getTotalDuration()} minutes</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 font-semibold">Total Price</p>
            <p className="text-gray-900 font-bold">${getTotalPrice()}</p>
          </div>
        </div>
      </div>
      <div>
        {isLoggedIn && loggedInClient ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-2">
            <p className="text-sm font-semibold text-green-800">Booking as:</p>
            <p className="font-bold text-gray-900">
              {loggedInClient.first_name} {loggedInClient.last_name}
            </p>
            <p className="text-sm text-gray-600">{loggedInClient.phone}</p>
            <p className="text-sm text-gray-600">{loggedInClient.email}</p>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-red-600 hover:text-red-800"
              onClick={handleLogout}
            >
              Not you?
            </Button>
          </div>
        ) : (
          <LoyaltyLoginSheet
            open={isShowClientInfoSheet}
            onOpenChange={setIsShowClientInfoSheet}
            businessId={business?.id.toString() || ''}
          />
        )}
        <div className="space-y-2 mt-4">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="Enter your notes"
            defaultValue={createAppointmentPayload?.notes || ""}
            onChange={(e) => {
              setCreateAppointmentPayload({
                ...createAppointmentPayload as CreateAppointmentWithServicesPayload,
                notes: e.target.value || "",
              })
            }}
          />
        </div>

        <div className="flex justify-end mt-4 gap-5">
          <Button className="flex-1 cursor-pointer" onClick={() => previousStep()}>
            Back
          </Button>
          {
            isLoggedIn ? (
              <Button
                className="flex-1 cursor-pointer"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </Button>
            ) : (
              <Button
                className="flex-1 cursor-pointer"
                onClick={() => setIsShowClientInfoSheet(true)}
              >
                Continue
              </Button>
            )
          }
        </div>
      </div>
    </div>
  );
}


