"use client";

import { useBookingStore } from "@/store/booking-store";
import { TimeSlot } from "@/types/booking";
import { ServiceSelection } from "./service-selection";
import { TimeSlotSelection } from "./time-slot-selection";
import { CustomerInfoForm } from "./customer-info-form";
import { BookingConfirmation } from "./booking-confirmation";
import { Card, CardContent } from "@/components/ui/card";
import { BOOKING_STEPS } from "@/enums/booking.enums";
import { Staff } from "@/types/booking";

// Re-export types for backwards compatibility

export type BookingData = {
  selectedStaff?: Staff;
  selectedTimeSlot?: TimeSlot;
  customerName: string;
  customerPhone: string;
};

export function BookingFlow() {
  const {
    currentStep,
    selectedStaff,
    selectedTimeSlot,
    customerName,
    customerPhone,
    setSelectedStaff,
    setSelectedTimeSlot,
    setCustomerInfo,
  } = useBookingStore();

  const renderContentStep = (step: BOOKING_STEPS) => {
    switch (step) {
      case BOOKING_STEPS.SERVICE_SELECTION:
        return <ServiceSelection />;
      case BOOKING_STEPS.TIME_SLOT_SELECTION:
        return <TimeSlotSelection
          selectedStaff={selectedStaff}
          selectedTimeSlot={selectedTimeSlot}
          onStaffSelection={setSelectedStaff}
          onTimeSlotSelection={setSelectedTimeSlot}
        />;
      case BOOKING_STEPS.CUSTOMER_INFO:
        return <CustomerInfoForm customerName={customerName} customerPhone={customerPhone} onInfoChange={setCustomerInfo} />;
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

