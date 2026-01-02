"use client";
import { BookingFlow } from "@/components/booking/booking-flow";
import { NavigationBar } from "@/components/booking/navigation-bar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { BookingState, useBookingStore } from "@/store/booking-store";

export default function BookingPage() {

  const { initializeBusiness, businessInfo } = useBookingStore((state: BookingState) => state);
  const query = useSearchParams()
  const businessId = query.get('business_id')
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusiness = async () => {
      setLoading(true);
      await initializeBusiness(Number(businessId));
      setLoading(false);
    };
    if (businessId && businessId != businessInfo?.id.toString()) {
      loadBusiness();
    }
  }, [businessId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-16">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => window.location.href = `/?business_id=${businessId}`}>
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>


        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Book an Appointment</h1>
        </div>
        <BookingFlow />
      </div>
      <NavigationBar />
    </div>
  );
}
