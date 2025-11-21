"use client";

import { useState, useMemo } from "react";
import { TimeSlot, useBookingStore } from "@/store/booking-store";
import { Service, Staff } from "@/types/booking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRightIcon, GroupIcon, HeartIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { StaffRequestSheet } from "../shared/sheet";
import { cn } from "@/lib/utils";
import { DateSelection } from "./date-selection";

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
  const [selectedDate, setSelectedDate] = useState<string>("today");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const { selectedServices } = useBookingStore();
  const timeSlots = useMemo(() => {
    return generateTimeSlots(selectedServices);
  }, [selectedServices]);


  // Group time slots by date
  const slotsByDate = useMemo(() => {
    const grouped: Record<string, TimeSlot[]> = {};
    timeSlots.forEach((slot) => {
      const date = new Date(slot.startTime);
      const dateKey = date.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    });
    return grouped;
  }, [timeSlots]);

  // Filter slots by selected date and staff
  const filteredSlots = useMemo(() => {
    const today = new Date();
    let targetDate: Date;

    if (selectedDate === "today") {
      targetDate = today;
    } else if (selectedDate === "tomorrow") {
      targetDate = new Date(today);
      targetDate.setDate(today.getDate() + 1);
    } else {
      const days = parseInt(selectedDate);
      targetDate = new Date(today);
      targetDate.setDate(today.getDate() + days);
    }

    const dateKey = targetDate.toDateString();
    const slotsForDate = slotsByDate[dateKey] || [];

    return slotsForDate.filter((slot) => slot.available);
  }, [selectedDate, slotsByDate]);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const [staffRequestSheetOpen, setStaffRequestSheetOpen] = useState(false);


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
          <DateSelection />
        </div>
        {/* <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: "today", label: "Today" },
            { key: "tomorrow", label: "Tomorrow" },
            ...Array.from({ length: 5 }, (_, i) => ({
              key: String(i + 2),
              label: new Date(
                new Date().setDate(new Date().getDate() + i + 2)
              ).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
            })),
          ].map((dateOption) => (
            <button
              key={dateOption.key}
              onClick={() => setSelectedDate(dateOption.key)}
              className={`min-w-[100px] rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${selectedDate === dateOption.key
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              {dateOption.label}
            </button>
          ))}
        </div> */}
      </div>

      {/* Time Slot Selection */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Select Time</h3>
        {filteredSlots.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No available time slots for this date. Please select another date.
            </CardContent>
          </Card>
        ) : (
          <RadioGroup
            value={selectedTimeSlot?.id}
            onValueChange={(value) => setSelectedTimeSlot(filteredSlots.find((s) => s.id === value) || null)}
            className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
          >
            {/* {filteredSlots.map((slot) => {
              const staff = BUSINESS_STAFFS.find((s) => s.id === parseInt(slot.staffId));
              return (
                <div key={slot.id}>
                  <RadioGroupItem
                    value={slot.id}
                    id={slot.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={slot.id}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-4 text-center transition-all hover:border-blue-500 hover:bg-blue-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50"
                  >
                    <span className="text-sm font-medium">{formatTime(slot.startTime)}</span>
                    <span className="mt-1 text-xs text-gray-500">
                      {formatDate(slot.startTime)}
                    </span>
                    {staff && (
                      <span className="mt-1 text-xs text-gray-400">{staff.first_name} {staff.last_name}</span>
                    )}
                  </Label>
                </div>
              );
            })} */}
          </RadioGroup>
        )}
      </div>

      {selectedTimeSlot && (
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Time</p>
                <p className="font-semibold">
                  {formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}
                </p>
                <p className="text-sm text-gray-600">{formatDate(selectedTimeSlot.startTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
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

