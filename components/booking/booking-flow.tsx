"use client";

import { useBookingStore } from "@/store/booking-store";
import { ClientCreate, TimeSlot } from "@/types/appointment";
import { ServiceSelection } from "./service-selection";
import { TimeSlotSelection } from "./time-slot-selection";
import { BookingSummary } from "./booking-summary";
import { BookingConfirmation } from "./booking-confirmation";
import { Card, CardContent } from "@/components/ui/card";
import { BOOKING_STEPS } from "@/enums/booking.enums";
import { Staff } from "@/types/appointment";

// Re-export types for backwards compatibility

export type BookingData = {
  selectedStaff?: Staff;
  selectedTimeSlot?: TimeSlot;
  clientInfo: ClientCreate | null;
};

export function BookingFlow() {
  const {
    currentStep,
  } = useBookingStore();

  const renderContentStep = (step: BOOKING_STEPS) => {
    switch (step) {
      case BOOKING_STEPS.SERVICE_SELECTION:
        return <ServiceSelection />;
      case BOOKING_STEPS.TIME_SLOT_SELECTION:
        return <TimeSlotSelection/>;
      case BOOKING_STEPS.CUSTOMER_INFO:
        return <BookingSummary />;
      case BOOKING_STEPS.CONFIRMATION:
        return <BookingConfirmation />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          {renderContentStep(currentStep)}
        </CardContent>
      </Card>
    </div>
  );
}

