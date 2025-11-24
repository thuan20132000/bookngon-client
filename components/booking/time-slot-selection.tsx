"use client";

import { useState, useMemo, useEffect } from "react";
import { useBookingStore } from "@/store/booking-store";
import { Service, Staff, TimeSlot } from "@/types/booking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRightIcon, GroupIcon, HeartIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { StaffRequestSheet } from "../shared/sheet";
import { DateSelection } from "./date-selection";
import dayjs from "dayjs";
import { businessBookingApi, TimeSlotsParams } from "@/lib/api/business-booking.api";

// Mock data - in a real app, this would come from an API
// Generate time slots for the next 7 days
function generateTimeSlots(selectedServices: Service[]): TimeSlot[] {
  return [];
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
      console.log("time slots:: ", response);
      setTimeSlots(response.results!);
    };
    fetchTimeSlots();
  }, [selectedServices, business, selectedDate, selectedStaff]);



  return (
    <div className="space-y-6">
      {/* Staff Selection */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Select Staff</h3>
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
          <h3 className="mb-4 text-lg font-semibold">Select Date</h3>
          <DateSelection
            date={selectedDate}
            onDateSelect={(date: Date) => setSelectedDate(date)}
          />
        </div>
      </div>

      {/* Time Slot Selection */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Select Time</h3>
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
            className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
          >
            {timeSlots.map((slot) => {
              return (
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
              );
            })}
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

