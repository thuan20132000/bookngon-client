import { Service, Staff } from "@/types/booking";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { StaffItem } from "./item";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useBookingStore } from "@/store/booking-store";
import { businessBookingApi } from "@/lib/api/business-booking.api";


interface StaffRequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStaffSelect?: (staff: Staff) => void;
}

export const StaffRequestSheet = ({ open, onOpenChange, onStaffSelect }: StaffRequestSheetProps) => {
  const { business } = useBookingStore();
  const [businessTechnicians, setBusinessTechnicians] = useState<Staff[]>([]);

  useEffect(() => {
    const fetchBusinessTechnicians = async () => {
      if (!business) return;
      const response = await businessBookingApi.getBusinessTechnicians({ business_id: business?.id });
      setBusinessTechnicians(response.results!);
    };
    fetchBusinessTechnicians();
  }, [business]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Staff Request</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          Please select the staff you would like to request.
        </SheetDescription>
        <div className="h-full overflow-y-auto flex flex-col gap-2">
          {businessTechnicians?.map((staff) => (
            <StaffItem
              key={staff.id}
              staff={staff}
              selected={false}
              onSelect={onStaffSelect}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};


interface BookingCartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedServices: Service[];
  onRemoveService: (serviceId: number) => void;
  totalDuration: number;
  totalPrice: number;
}

export const BookingCartSheet = ({ open, onOpenChange, selectedServices, onRemoveService, totalDuration, totalPrice }: BookingCartSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
              Services ({selectedServices?.length})
            </h3>
            <div className="space-y-2">
              {selectedServices?.map((service) => (
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
                    onClick={() => onRemoveService(service.id)}
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
                  {totalDuration} minutes
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Total Price</span>
                <p className="text-lg font-semibold text-gray-900">
                  ${totalPrice}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>

  );
};