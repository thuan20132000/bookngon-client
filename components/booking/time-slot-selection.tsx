"use client";

import { useState, useMemo, useEffect } from "react";
import { useBookingStore } from "@/store/booking-store";
import { TimeSlot } from "@/types/appointment";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRightIcon, HeartIcon } from "lucide-react";
import { Button } from "../ui/button";
import { StaffRequestSheet } from "../shared/sheet";
import { DateSelection } from "./date-selection";
import dayjs from "dayjs";
import { businessBookingApi, TimeSlotsParams } from "@/lib/api/business-booking.api";

// Categorize time slot by time of day
function getTimeOfDay(time: string): "morning" | "afternoon" | "evening" {
  const hours = dayjs(time).get("hour");
  if (hours >= 6 && hours < 12) return "morning";
  if (hours >= 12 && hours < 17) return "afternoon";
  return "evening";
}

// Group time slots by time of day
function groupTimeSlotsByTimeOfDay(timeSlots: TimeSlot[]): {
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
} {
  const grouped: {
    morning: TimeSlot[];
    afternoon: TimeSlot[];
    evening: TimeSlot[];
  } = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  const now = dayjs().add(30,'minutes');
  timeSlots.forEach((slot) => {
    // Only include slots starting after the current time
    if (dayjs(slot.start_time).isAfter(now)) {
      const timeOfDay = getTimeOfDay(slot.start_time);
      grouped[timeOfDay].push(slot);
    }
  });

  // Sort each group by start time
  grouped.morning.sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time)));
  grouped.afternoon.sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time)));
  grouped.evening.sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time)));

  return grouped;
}

export function TimeSlotSelection() {
  const [staffRequestSheetOpen, setStaffRequestSheetOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const { 
    selectedAppointmentServices, 
    setSelectedAppointmentServices,
    business, 
    getTotalDuration,
    setSelectedStaff,
    setSelectedTimeSlot,
    selectedStaff,
    selectedTimeSlot,
    setSelectedDate,
    selectedDate,
  } = useBookingStore();


  // Group time slots by time of day
  const groupedTimeSlots = useMemo(() => {
    return groupTimeSlotsByTimeOfDay(timeSlots);
  }, [timeSlots]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!business || !selectedDate) return;

      const timeSlotsParams: TimeSlotsParams = {
        business_id: business?.id.toString() || '',
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        service_ids: selectedAppointmentServices.map((appointmentService) => appointmentService.service),
        duration: getTotalDuration(),
        staff_id: selectedStaff?.id,
        interval_minutes: business?.settings?.time_slot_interval,

      };
      const response = await businessBookingApi.getTimeSlots(timeSlotsParams);
      setTimeSlots(response.results!);
    };
    fetchTimeSlots();
  }, [selectedAppointmentServices, business, selectedDate, selectedStaff]);


  const handleSelectTimeSlot = (value: string | null) => {
    const timeSlot = timeSlots.find((s) => s.start_time === value);
    if (timeSlot) {
      setSelectedTimeSlot(timeSlot);
      updateSelectedServicesTimeSlots(timeSlot);
    }
  }

  const updateSelectedServicesTimeSlots = (timeSlot: TimeSlot) => {
    let nextServiceStartTime = timeSlot.start_time;
    const updatedServices = selectedAppointmentServices.map((service) => {
      const startTime = dayjs(nextServiceStartTime);
      const endTime = dayjs(startTime).add(service.service_duration, 'minutes');

      nextServiceStartTime = endTime.format("YYYY-MM-DDTHH:mm:ssZ");
      const id = service.id +  new Date().getTime();
      return {
        ...service,
        id: id,
        start_at: startTime.format("YYYY-MM-DDTHH:mm:ssZ"),
        end_at: endTime.format("YYYY-MM-DDTHH:mm:ssZ"),
        staff: timeSlot.staff_id,
        is_staff_request: selectedStaff ? true : false,
      }
    });

    setSelectedAppointmentServices(updatedServices);
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Staff Selection */}
      <div>
        <h6 className="mb-4 text-lg font-semibold">Technician</h6>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedStaff(undefined);
              setSelectedTimeSlot(null);
            }}
            size="lg"
            className={`border-gray-300 bg-white text-gray-700 cursor-pointer flex-1 ${!selectedStaff ? "border-blue-600 bg-blue-600 text-white" : ""}`}
          >
            Anyone
          </Button>
          <Button
            variant="outline"
            onClick={() => setStaffRequestSheetOpen(true)}
            size="lg"
            className={`border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all cursor-pointer flex-1 ${selectedStaff ? "border-blue-600 " : ""}`}

          >
            <div className="flex items-center gap-2">
              <span className="ml-2">Request</span>
              {selectedStaff && (
                <div className="flex items-center gap-2">
                  <HeartIcon className="size-4 text-red-500" fill="red" />
                  <span className="text-sm font-bold">{selectedStaff.first_name}</span>
                </div>
              )}
            </div>
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <div className="">
          <h3 className="mb-4 text-lg font-semibold">Date</h3>
          <DateSelection
            date={selectedDate ? dayjs(selectedDate).toDate() : undefined}
            onDateSelect={(date: Date) => {
              setSelectedDate(date)
              setSelectedTimeSlot(null);
            }}
          />
        </div>
      </div>

      {/* Time Slot Selection */}
      <div>
        <h6 className="mb-4 text-lg font-semibold">Time</h6>
        {timeSlots.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No available time slots for this date. Please select another date.
            </CardContent>
          </Card>
        ) : (
          <RadioGroup
            value={selectedTimeSlot?.start_time || null}
            onValueChange={handleSelectTimeSlot}
          >
            <div className="space-y-6">
              {/* Morning Section */}
              {groupedTimeSlots.morning.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-700">Morning</h4>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {groupedTimeSlots.morning.map((slot) => (
                      <div key={slot.start_time}>
                        <RadioGroupItem
                          value={slot.start_time}
                          id={slot.start_time}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={slot.start_time}
                          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-2 text-center transition-all hover:border-blue-500 hover:bg-blue-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50"
                        >
                          <span className="text-sm font-bold cursor-pointer">
                            {dayjs(slot.start_time).format("h:mm A")}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Afternoon Section */}
              {groupedTimeSlots.afternoon.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-700">Afternoon</h4>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {groupedTimeSlots.afternoon.map((slot) => (
                      <div key={slot.start_time}>
                        <RadioGroupItem
                          value={slot.start_time}
                          id={slot.start_time}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={slot.start_time}
                          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-2 text-center transition-all hover:border-blue-500 hover:bg-blue-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50"
                        >
                          <span className="text-sm font-bold cursor-pointer">
                            {dayjs(slot.start_time).format("h:mm A")}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evening Section */}
              {groupedTimeSlots.evening.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-700">Evening</h4>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {groupedTimeSlots.evening.map((slot) => (
                      <div key={slot.start_time}>
                        <RadioGroupItem
                          value={slot.start_time}
                          id={slot.start_time}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={slot.start_time}
                          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-2 text-center transition-all hover:border-blue-500 hover:bg-blue-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50"
                        >
                          <span className="text-sm font-bold cursor-pointer">
                            {dayjs(slot.start_time).format("h:mm A")}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </RadioGroup>
        )}
      </div>


      <StaffRequestSheet
        open={staffRequestSheetOpen}
        onOpenChange={setStaffRequestSheetOpen}
        onStaffSelect={(staff) => {
          setSelectedTimeSlot(null);
          setSelectedStaff(staff);
          setStaffRequestSheetOpen(false);
        }}
      />
    </div>
  );
}

