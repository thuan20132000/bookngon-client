"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/booking-store";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOKING_STEPS } from "@/enums/booking.enums";
import { BookingCartSheet } from "../shared/sheet";

export function NavigationBar() {
  const {
    selectedServices,
    removeService,
    getTotalDuration,
    getTotalPrice,
    currentStep,
    previousStep,
    nextStep,
    setCurrentStep,
    canProceedToStep2,
    canProceedToStep3,
    canProceedToStep4,
  } = useBookingStore();

  const [isOpen, setIsOpen] = useState(false);

  const totalDuration = getTotalDuration();
  const totalPrice = getTotalPrice();
  const totalServices = selectedServices.length;

  const handleConfirm = () => {
    setCurrentStep(4);
    setIsOpen(false);
  };

  const getNextButtonDisabled = () => {
    if (currentStep === BOOKING_STEPS.SERVICE_SELECTION) return !canProceedToStep2();
    if (currentStep === BOOKING_STEPS.TIME_SLOT_SELECTION) return !canProceedToStep3();
    if (currentStep === BOOKING_STEPS.CUSTOMER_INFO) return !canProceedToStep4();
    return false;
  };

  const getNextButtonText = () => {
    if (currentStep === BOOKING_STEPS.CUSTOMER_INFO) return "Confirm";
    return "Next";
  };

  const handleNext = () => {
    if (currentStep === BOOKING_STEPS.CUSTOMER_INFO) {
      handleConfirm();
    } else {
      nextStep();
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
          cursor-pointer"
        aria-label="View selected services"
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="font-semibold">{totalServices}</span>
        <span className="hidden sm:inline">Services</span>
        <span className="ml-2 font-bold">${totalPrice.toFixed(2)}</span>
        <span className="text-xs font-bold">~{totalDuration}min</span>
      </button>
      {/* Back and Next buttons, floating above sheet trigger */}
      <div className="fixed bottom-4 left-4 z-50 flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            previousStep();
            setIsOpen(false);
          }}
          disabled={currentStep === BOOKING_STEPS.SERVICE_SELECTION}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={getNextButtonDisabled()}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span>{getNextButtonText()}</span>
          {currentStep !== BOOKING_STEPS.CUSTOMER_INFO && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Bottom Sheet */}
      <BookingCartSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        selectedServices={selectedServices}
        onRemoveService={removeService}
        totalDuration={totalDuration}
        totalPrice={totalPrice}
      />
    </div>
  );
}
