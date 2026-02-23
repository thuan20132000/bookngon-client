"use client";
import { useBookingStore, BookingState } from "@/store/booking-store";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessInfo } from "@/types/business";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Search, Gift, LogIn, LogOut, User } from "lucide-react";
import { InstallPWAButton } from "@/components/shared/install-pwa-button";
import { useRouter, useSearchParams } from "next/navigation";
import { ClientPhoneSheet, LoyaltyLoginSheet } from "@/components/shared/sheet";
import { ClientCreate } from "@/types/appointment";
import { BusinessBannerModal } from "@/components/shared/business-banner";
import { useAuthStore } from "@/store/auth-store";

const PWA_BUSINESS_ID_KEY = "pwa_business_id";

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as unknown as { standalone: boolean }).standalone)
  );
}

const HomeContent = () => {
  const { initializeBusiness, businessInfo } = useBookingStore((state: BookingState) => state);
  const query = useSearchParams()
  const businessId = query.get('business_id')
  const [loading, setLoading] = useState(true);
  const [openClientPhoneSheet, setOpenClientPhoneSheet] = useState(false);
  const [openLoyaltySheet, setOpenLoyaltySheet] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientCreate | null>(null);
  const { isLoggedIn, loggedInClient, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (businessId) {
      try {
        localStorage.setItem(PWA_BUSINESS_ID_KEY, businessId);
      } catch {
        // ignore
      }
    }
  }, [businessId]);

  useEffect(() => {
    if (!isInStandaloneMode() || businessId) return;
    try {
      const saved = localStorage.getItem(PWA_BUSINESS_ID_KEY);
      if (saved) {
        router.replace(`/?business_id=${saved}`);
      }
    } catch {
      // ignore
    }
  }, [businessId, router]);

  useEffect(() => {
    const loadBusiness = async () => {
      if (!businessId) {
        return;
      }
      setLoading(true);
      await initializeBusiness(businessId);
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

          {/* Welcome Banner for logged-in clients */}
          {isLoggedIn && loggedInClient && (
            <div className="mb-6 mx-auto w-full max-w-md rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-green-700 dark:text-green-300" />
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                      Welcome back, {loggedInClient.first_name}!
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {loggedInClient.phone}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-700 hover:text-red-600 hover:bg-green-100 dark:text-green-300 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link href={`/booking?business_id=${businessInfo.id}`} className="flex-1">
                <Button
                  size="lg"
                  className="w-full h-14 px-8 text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  Book an Appointment
                </Button>
              </Link>
              <Link href={`/gifts?business_id=${businessInfo.id}`} className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 px-8 text-base flex items-center justify-center gap-2 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-500 hover:text-yellow-700 cursor-pointer"
                  disabled
                >
                  <Gift className="h-5 w-5 mr-2 text-yellow-500" />
                  Buy a Gift Card
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-md">
              {!isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-12 w-full px-8 text-base underline flex items-center justify-center cursor-pointer"
                  onClick={() => setOpenLoyaltySheet(true)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  I&apos;m a returning client
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-12 w-full px-8 text-base underline flex items-center justify-center cursor-pointer"
                onClick={() => {
                  if (isLoggedIn && loggedInClient?.id) {
                    router.push(`/client?client_id=${loggedInClient.id}&business_id=${businessInfo.id}`);
                  } else {
                    setOpenClientPhoneSheet(true);
                  }
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Find your appointment
              </Button>
              <InstallPWAButton />
            </div>
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
              {businessInfo.online_booking?.policy && (
                <CardContent className="space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Policy
                    </span>
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                    {businessInfo.online_booking.policy}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>

      <ClientPhoneSheet
        open={openClientPhoneSheet}
        onOpenChange={setOpenClientPhoneSheet}
        clientInfo={clientInfo}
        onChangeClientInfo={(clientInfo) => {
          setClientInfo(clientInfo);
          setOpenClientPhoneSheet(false);
          if (clientInfo) {
            router.push(`/client?client_id=${clientInfo.id}&business_id=${businessInfo.id}`);
          }
        }}
      />

      {businessId && (
        <LoyaltyLoginSheet
          open={openLoyaltySheet}
          onOpenChange={setOpenLoyaltySheet}
          businessId={businessId}
        />
      )}

      {/* Business Banner Modal */}
      <BusinessBannerModal
        banner={businessInfo.active_banner || null}
        businessId={businessInfo.id}
      />
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

