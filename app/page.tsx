"use client";
import { useBookingStore, BookingState } from "@/store/booking-store";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessInfo } from "@/types/business";
import Link from "next/link";
import { Phone, Mail, MapPin, Globe, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";

const HomeContent = () => {
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
    loadBusiness();
  }, [businessId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!businessInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">Business not found</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Unable to load business information.</p>
        </div>
      </div>
    );
  }

  const formatTime = (time: string | null) => {
    if (!time) return "Closed";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatOperatingHours = (hours: BusinessInfo["operating_hours"]) => {
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return hours.map((hour) => {
      const dayName = hour.day_name || dayNames[hour.day_of_week];
      if (!hour.is_open) {
        return { day: dayName, hours: "Closed" };
      }
      const openTime = formatTime(hour.open_time);
      const closeTime = formatTime(hour.close_time);
      return { day: dayName, hours: `${openTime} - ${closeTime}` };
    });
  };

  const operatingHours = formatOperatingHours(businessInfo.operating_hours);
  const fullAddress = `${businessInfo.address}, ${businessInfo.city}, ${businessInfo.state_province} ${businessInfo.postal_code}, ${businessInfo.country}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white font-sans dark:from-black dark:to-zinc-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Logo and Business Name */}
          <div className="mb-8 flex flex-col items-center text-center sm:mb-12">
            {businessInfo.logo && (
              <div className="mb-6">
                <Image
                  src={businessInfo.logo}
                  alt={businessInfo.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover shadow-lg"
                />
              </div>
            )}
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
              {businessInfo.name}
            </h1>
            {businessInfo.description && (
              <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                {businessInfo.description}
              </p>
            )}
          </div>

          {/* CTA Button */}
          <div className="mb-12 flex justify-center">
            <Link href={`/booking?business_id=${businessInfo.id}`}>
              <Button size="lg" className="h-12 px-8 text-base">
                Book an Appointment
              </Button>
            </Link>
          </div>

          {/* Information Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {businessInfo.phone_number && (
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    <a
                      href={`tel:${businessInfo.phone_number}`}
                      className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-zinc-50"
                    >
                      {businessInfo.phone_number}
                    </a>
                  </div>
                )}
                {businessInfo.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    <a
                      href={`mailto:${businessInfo.email}`}
                      className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-zinc-50"
                    >
                      {businessInfo.email}
                    </a>
                  </div>
                )}
                {businessInfo.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    <address 
                      className="not-italic text-sm text-zinc-700 dark:text-zinc-300"
                      title={fullAddress}
                      aria-label={fullAddress}
                    >
                      {fullAddress}
                    </address>
                  </div>
                )}
               
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {operatingHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm"
                    >
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {schedule.day}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
              
                {businessInfo.online_booking?.policy && (
                  <div>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      Policy:
                    </span>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {businessInfo.online_booking.policy}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

