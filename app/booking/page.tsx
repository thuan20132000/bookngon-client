"use client";
import { BookingFlow } from "@/components/booking/booking-flow";
import { NavigationBar } from "@/components/booking/navigation-bar";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useBookingStore } from "@/store/booking-store";

const BookingPageContent = () => {
  const query = useSearchParams()
  const businessId = query.get('business_id')

  const { setBusiness } = useBookingStore()
  
  useEffect(() => {
    console.log('BookingPage')
    if (businessId) {
      setBusiness({
        id: Number(businessId),
        name: 'Business 1',
        business_type: 1,
        business_type_name: 'Business Type 1',
        phone_number: '1234567890',
        email: 'business1@example.com',
        website: 'https://business1.com',
        address: '123 Main St',
        city: 'Anytown',
        state_province: 'CA',
        postal_code: '12345',
        country: 'US',
        timezone: 'America/New_York',
        status: 'active',
        description: 'Business 1 description',
        logo: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }, [businessId, setBusiness])

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Book an Appointment</h1>
        </div>
        <BookingFlow />
      </div>
      <NavigationBar />
    </div>
  );
}


export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  )
}