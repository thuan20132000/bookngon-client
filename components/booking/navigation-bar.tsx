"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/booking-store";
import { X, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { BOOKING_STEPS } from "@/enums/booking.enums";

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
    <>
      {/* Floating Action Button */}

      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
          cursor-pointer"
          aria-label="View selected services"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="font-semibold">{selectedServices.length}</span>
          <span className="hidden sm:inline">Services</span>
          <span className="ml-2 font-bold">${totalPrice.toFixed(2)}</span>
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
      </div>

      {/* Bottom Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Selected Services</SheetTitle>
            <SheetDescription>
              Review your selected services and proceed with booking
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Services List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Services ({selectedServices.length})
              </h3>
              <div className="space-y-2">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">
                        {service.name}
                      </h4>
                      <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                        <span>{service.duration_minutes} min</span>
                        <span>·</span>
                        <span className="font-semibold text-gray-900">
                          ${parseFloat(service.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeService(service.id)}
                      className="shrink-0 rounded-full p-2 transition-colors hover:bg-gray-200"
                      aria-label={`Remove ${service.name}`}
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Total Duration</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {totalDuration} min
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Total Price</span>
                  <p className="text-lg font-semibold text-gray-900">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 border-t pt-4">
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
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

