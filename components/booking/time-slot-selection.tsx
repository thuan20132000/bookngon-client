"use client";

import { useState, useMemo } from "react";
import { Service, Staff, TimeSlot, useBookingStore } from "@/store/booking-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data - in a real app, this would come from an API
const STAFF_MEMBERS: Staff[] = [
  {
    id: "staff1",
    name: "Sarah Johnson",
    specialties: ["Hair", "Beauty"],
  },
  {
    id: "staff2",
    name: "Emily Chen",
    specialties: ["Nails", "Skincare"],
  },
  {
    id: "staff3",
    name: "Michael Brown",
    specialties: ["Hair", "Wellness"],
  },
  {
    id: "staff4",
    name: "Jessica Martinez",
    specialties: ["Hair", "Nails", "Beauty"],
  },
];

// Generate time slots for the next 7 days
function generateTimeSlots(selectedServices: Service[]): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = new Date();
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Generate slots for the next 7 days
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);
    currentDate.setHours(9, 0, 0, 0); // Start at 9 AM

    // Generate slots from 9 AM to 6 PM
    while (currentDate.getHours() < 18) {
      const endTime = new Date(currentDate);
      endTime.setMinutes(endTime.getMinutes() + totalDuration);

      // Only add slot if it doesn't go past 6 PM
      if (endTime.getHours() <= 18) {
        STAFF_MEMBERS.forEach((staff) => {
          // Check if staff can handle the selected services
          const canHandle = selectedServices.some((service) =>
            staff.specialties.includes(service.category)
          );

          if (canHandle) {
            slots.push({
              id: `slot-${day}-${currentDate.getHours()}-${currentDate.getMinutes()}-${staff.id}`,
              startTime: currentDate.toISOString(),
              endTime: endTime.toISOString(),
              staffId: staff.id,
              available: Math.random() > 0.3, // 70% availability for demo
            });
          }
        });
      }

      currentDate.setMinutes(currentDate.getMinutes() + 30); // Next slot in 30 minutes
    }
  }

  return slots;
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
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const { selectedServices } = useBookingStore();
  const timeSlots = useMemo(() => {
    return generateTimeSlots(selectedServices);
  }, [selectedServices]);

  // Filter available staff based on selected services
  const availableStaff = useMemo(() => {
    return STAFF_MEMBERS.filter((staff) => selectedServices.some((service) => staff.specialties.includes(service.category)));
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


  return (
    <div className="space-y-6">
      {/* Staff Selection */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Select Staff Member</h3>
        <RadioGroup
          value={selectedStaffId}
          onValueChange={(value) => {
            const staff = availableStaff.find((s) => s.id === value);
            if (staff) {
              setSelectedStaffId(staff.id);
            }
          }}
          className="grid gap-4 md:grid-cols-2"
        >
          {availableStaff.map((staff) => {
            const isSelected = selectedStaffId === staff.id;
            return (
              <div key={staff.id}>
                <RadioGroupItem
                  value={staff.id}
                  id={`staff-${staff.id}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`staff-${staff.id}`}
                  className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Avatar>
                    <AvatarFallback>
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{staff.name}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {staff.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {/* Date Selection */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Select Date</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
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
              className={`min-w-[100px] rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                selectedDate === dateOption.key
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {dateOption.label}
            </button>
          ))}
        </div>
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
            {filteredSlots.map((slot) => {
              const staff = STAFF_MEMBERS.find((s) => s.id === slot.staffId);
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
                      <span className="mt-1 text-xs text-gray-400">{staff.name}</span>
                    )}
                  </Label>
                </div>
              );
            })}
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
    </div>
  );
}

