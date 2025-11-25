"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/booking-store";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOKING_STEPS } from "@/enums/booking.enums";
import { BookingCartSheet } from "../shared/sheet";

export function NavigationBar() {
  const {
    selectedAppointmentServices,
    removeAppointmentService,
    getTotalDuration,
    getTotalPrice,
    currentStep,
    previousStep,
    nextStep,
    setCurrentStep,
    canProceedToTimeSlotStep,
    canProceedToCustomerInfoStep,
  } = useBookingStore();

  const [isOpen, setIsOpen] = useState(false);

  const totalDuration = getTotalDuration();
  const totalPrice = getTotalPrice();
  const totalServices = selectedAppointmentServices.length;

  const handleConfirm = () => {
    setCurrentStep(BOOKING_STEPS.CONFIRMATION);
    setIsOpen(false);
  };

  const getNextButtonDisabled = () => {
    switch (currentStep) {
      case BOOKING_STEPS.SERVICE_SELECTION:
        return !canProceedToTimeSlotStep();
      case BOOKING_STEPS.TIME_SLOT_SELECTION:
        return !canProceedToCustomerInfoStep();
      case BOOKING_STEPS.CUSTOMER_INFO:
        return !canProceedToCustomerInfoStep();
      default:
        return true;
    }
  };

  const getNextButtonText = () => {
    if (currentStep === BOOKING_STEPS.CONFIRMATION) return "Confirm";
    return "Next";
  };

  const handleNext = () => {
    if (currentStep === BOOKING_STEPS.CONFIRMATION) {
      handleConfirm();
    } else {
      nextStep();
      setIsOpen(false);
    }
  };

  if (currentStep == BOOKING_STEPS.CUSTOMER_INFO || currentStep == BOOKING_STEPS.CONFIRMATION) {
    return null;
  }

  return (
    <div className="fixed right-4 z-50 bottom-0 left-0 bg-white shadow-2xl w-full h-[100px] items-center">
      <div className="flex items-center w-full h-full px-4 gap-2">
        {/* Floating Action Button */}
        <div className="flex flex-1 items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
          cursor-pointer"
            aria-label="View selected services"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="font-semibold">{totalServices}</span>
            <span className="hidden sm:inline">Services</span>
            <span className="ml-2 font-bold">${totalPrice.toFixed(2)}</span>
            <span className="text-xs font-bold">~{totalDuration}min</span>
          </button>
        </div>
        {/* Back and Next buttons, floating above sheet trigger */}
        <div className="flex flex-1 gap-2">
          <Button
            variant="outline"
            onClick={() => {
              previousStep();
              setIsOpen(false);
            }}
            disabled={currentStep === BOOKING_STEPS.SERVICE_SELECTION}
            className="flex flex-1 items-center gap-2 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={getNextButtonDisabled()}
            className="flex flex-1 items-center gap-2 cursor-pointer"
          >
            <span>{getNextButtonText()}</span>
            {currentStep < BOOKING_STEPS.CONFIRMATION && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {/* Bottom Sheet */}
      <BookingCartSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        appointmentServices={selectedAppointmentServices}
        onRemoveAppointmentService={removeAppointmentService}
        totalDuration={totalDuration}
        totalPrice={totalPrice}
      />
    </div>
  );
}
