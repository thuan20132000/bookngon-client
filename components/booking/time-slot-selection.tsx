"use client";

import { useState, useMemo, useEffect } from "react";
import { useBookingStore } from "@/store/booking-store";
import { Staff, TimeSlot } from "@/types/booking";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRightIcon, HeartIcon } from "lucide-react";
import { Button } from "../ui/button";
import { StaffRequestSheet } from "../shared/sheet";
import { DateSelection } from "./date-selection";
import dayjs from "dayjs";
import { businessBookingApi, TimeSlotsParams } from "@/lib/api/business-booking.api";

type TimeOfDay = "morning" | "afternoon" | "evening";

interface GroupedTimeSlots {
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
}

// Categorize time slot by time of day
function getTimeOfDay(time: string): TimeOfDay {
  const [hours] = time.split(":").map(Number);
  if (hours >= 6 && hours < 12) return "morning";
  if (hours >= 12 && hours < 17) return "afternoon";
  return "evening";
}

// Group time slots by time of day
function groupTimeSlotsByTimeOfDay(timeSlots: TimeSlot[]): GroupedTimeSlots {
  const grouped: GroupedTimeSlots = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  timeSlots.forEach((slot) => {
    const timeOfDay = getTimeOfDay(slot.start_time);
    grouped[timeOfDay].push(slot);
  });

  // Sort each group by start time
  grouped.morning.sort((a, b) => a.start_time.localeCompare(b.start_time));
  grouped.afternoon.sort((a, b) => a.start_time.localeCompare(b.start_time));
  grouped.evening.sort((a, b) => a.start_time.localeCompare(b.start_time));

  return grouped;
}

interface TimeSlotSelectionProps {
  selectedStaff?: Staff;
  selectedTimeSlot?: TimeSlot;
  onStaffSelection: (staff: Staff) => void;
  onTimeSlotSelection: (timeSlot: TimeSlot) => void;
}

export function TimeSlotSelection({
}: TimeSlotSelectionProps) {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [staffRequestSheetOpen, setStaffRequestSheetOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const { selectedServices, business, getTotalDuration } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);


  // Group time slots by time of day
  const groupedTimeSlots = useMemo(() => {
    return groupTimeSlotsByTimeOfDay(timeSlots);
  }, [timeSlots]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!business || !selectedDate) return;

      const timeSlotsParams: TimeSlotsParams = {
        business_id: business?.id,
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        service_ids: selectedServices.map((service) => service.id),
        duration: getTotalDuration(),
        staff_id: selectedStaff?.id,
      };
      const response = await businessBookingApi.getTimeSlots(timeSlotsParams);
      setTimeSlots(response.results!);
    };
    fetchTimeSlots();
  }, [selectedServices, business, selectedDate, selectedStaff]);



  return (
    <div className="space-y-6">
      {/* Staff Selection */}
      <div>
        <h6 className="mb-4 text-lg font-semibold">Technician</h6>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSelectedStaff(null)}
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
            date={selectedDate}
            onDateSelect={(date: Date) => setSelectedDate(date)}
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
            value={selectedTimeSlot?.start_time}
            onValueChange={(value) => setSelectedTimeSlot(timeSlots.find((s) => s.start_time === value) || null)}
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
                            {slot.start_time}
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
                            {slot.start_time}
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
                            {slot.start_time}
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
          setSelectedStaff(staff);
          setStaffRequestSheetOpen(false);
        }}
      />
    </div>
  );
}

