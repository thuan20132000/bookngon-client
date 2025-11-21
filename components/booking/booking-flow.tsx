"use client";

import { useBookingStore, Staff, TimeSlot } from "@/store/booking-store";
import { ServiceSelection } from "./service-selection";
import { TimeSlotSelection } from "./time-slot-selection";
import { CustomerInfoForm } from "./customer-info-form";
import { BookingConfirmation } from "./booking-confirmation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BOOKING_STEPS } from "@/enums/booking.enums";

// Re-export types for backwards compatibility
export type { Staff, TimeSlot } from "@/store/booking-store";

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
        return <TimeSlotSelection selectedStaff={selectedStaff} selectedTimeSlot={selectedTimeSlot} onStaffSelection={setSelectedStaff} onTimeSlotSelection={setSelectedTimeSlot} />;
      case BOOKING_STEPS.CUSTOMER_INFO:
        return <CustomerInfoForm customerName={customerName} customerPhone={customerPhone} onInfoChange={setCustomerInfo} />;
    }
  };

  const renderStepTitle = (step: BOOKING_STEPS) => {
    switch (step) {
      case BOOKING_STEPS.SERVICE_SELECTION:
        return "Step 1: Select Services";
      case BOOKING_STEPS.TIME_SLOT_SELECTION:
        return "Step 2: Choose Time Slot";
      case BOOKING_STEPS.CUSTOMER_INFO:
        return "Step 3: Your Information";
      case BOOKING_STEPS.CONFIRMATION:
        return "Booking Confirmed";
    }
  };

  const renderStepDescription = (step: BOOKING_STEPS) => {
    switch (step) {
      case BOOKING_STEPS.SERVICE_SELECTION:
        return "Choose the services you'd like to book";
      case BOOKING_STEPS.TIME_SLOT_SELECTION:
        return "Select an available time slot";
      case BOOKING_STEPS.CUSTOMER_INFO:
        return "Enter your contact information";
      case BOOKING_STEPS.CONFIRMATION:
        return "Your booking has been confirmed";
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {renderStepTitle(currentStep)}
          </CardTitle>
          <CardDescription>
            {renderStepDescription(currentStep)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContentStep(currentStep)}
        </CardContent>
      </Card>
    </div>
  );
}

