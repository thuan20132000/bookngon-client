"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ClientFullNameSheet, ClientPhoneSheet } from "../shared/sheet";
import { AppointmentService, ClientCreate, CreateAppointmentWithServicesPayload } from "@/types/booking";
import { useBookingStore } from "@/store/booking-store";
import dayjs from "dayjs";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { businessBookingApi } from "@/lib/api/business-booking.api";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { FullScreenSpinner } from "../shared/spinner";

export function BookingSummary() {
  const [isShowCustomerInfoSheet, setIsShowCustomerInfoSheet] = useState(false);
  const [isShowClientFullNameSheet, setIsShowClientFullNameSheet] = useState(false);
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
  const [isLoading, setIsLoading] = useState(false);


  const getClientFullName = () => {
    if (!clientInfo) return "";
    return clientInfo.first_name + " " + clientInfo.last_name;
  }

  const handleConfirmBooking = async () => {
    if (!business) return;

    setIsLoading(true);
    try {
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
        business_id: business?.id,
        client_id: clientInfo?.id || null,
        notes: createAppointmentPayload?.notes || "",
      }


      payload.metadata = {
        is_rescheduled: false,
        is_cancelled: false,
        ...payload.metadata,
      }

      console.log("create appointment payload", payload);
      const response = await businessBookingApi.createAppointmentWithServices(payload);
      console.log("create appointment response", response);

      nextStep();
    } catch (error) {
      console.error("Error creating appointment", error);
      toast.error("Error creating appointment");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {isLoading && (
        <FullScreenSpinner />
      )}
      <CardContent className="pt-6">
        <div className="space-y-2 text-sm">
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
      </CardContent>
      <CardContent className="pt-1">
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-gray-900">Booking Summary</p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 font-semibold">Date</p>
            <p className="text-sm font-bold">{dayjs(selectedDate).format("dddd, DD MMM YYYY")}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 font-semibold">Time</p>
            <p className="text-sm font-bold">{dayjs(selectedTimeSlot?.start_time).format("h:mm A")}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 font-semibold">Technician</p>
            <p className="text-sm font-bold">{selectedStaff?.first_name || 'Anyone'}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 font-semibold">Total Duration</p>
            <p className="text-sm font-bold">~{getTotalDuration()} minutes</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 font-semibold">Total Price</p>
            <p className="text-sm font-bold">${getTotalPrice()}</p>
          </div>
        </div>
      </CardContent>
      <Card className="m-2">
        <CardContent >
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              defaultValue={clientInfo?.phone || ""}
              onClick={() => setIsShowCustomerInfoSheet(true)}
            />
            <ClientPhoneSheet
              open={isShowCustomerInfoSheet}
              onOpenChange={setIsShowCustomerInfoSheet}
              clientInfo={clientInfo}
              onChangeClientInfo={(clientInfo: ClientCreate | null) => {
                alert("onChangeClientInfo: " + JSON.stringify(clientInfo));
                if (clientInfo) {
                  setClientInfo(clientInfo)
                }
                setIsShowCustomerInfoSheet(false)
                if (!clientInfo?.first_name || !clientInfo?.last_name) {
                  setIsShowClientFullNameSheet(true)
                }
              }}
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              defaultValue={getClientFullName()}
              onClick={() => setIsShowClientFullNameSheet(true)}
            />
            <ClientFullNameSheet
              open={isShowClientFullNameSheet}
              onOpenChange={setIsShowClientFullNameSheet}
              clientInfo={clientInfo}
              setClientInfo={setClientInfo}
              onChangeClientInfo={(clientInfo) => {
                setClientInfo(clientInfo)
              }}
            />
          </div>
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
            <Button className="flex-1 cursor-pointer" onClick={handleConfirmBooking}>
              Confirm Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


