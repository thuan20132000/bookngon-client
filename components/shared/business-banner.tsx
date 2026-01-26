"use client";

import { useState, useEffect } from "react";
import { BusinessBanner } from "@/types/business";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, Info, Megaphone } from "lucide-react";
import Image from "next/image";

interface BusinessBannerModalProps {
  banner: BusinessBanner | null;
  businessId: string;
}

export function BusinessBannerModal({ banner, businessId }: BusinessBannerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!banner || !banner.is_active || !banner.is_visible) {
      return;
    }

    // Check if banner was already dismissed in this session
    const dismissedKey = `banner-dismissed-${businessId}-${banner.id}`;
    const isDismissed = sessionStorage.getItem(dismissedKey);
    console.log("isDismissed: " + isDismissed);
    if (isDismissed && isDismissed == "true") {
      console.log("banner already dismissed, returning");
      return;
    }
    setTimeout(() => {
      console.log("setting isOpen to true");
      setIsOpen(true);
    }, 100);

    // Show the banner
  }, [banner, businessId]);

  const handleDismiss = () => {
    console.log("handleDismiss called");
    if (banner) {
      // Store dismissal in session storage
      const dismissedKey = `banner-dismissed-${businessId}-${banner.id}`;
      sessionStorage.setItem(dismissedKey, "true");
    }
    setIsOpen(false);
  };

  if (!banner) return null;

  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={banner.dismissible ? setIsOpen : undefined}

    >
      <SheetContent
        side="top"
        className="max-w-2xl mx-auto mt-10"
        style={{
          backgroundColor: banner.background_color || undefined,
          color: banner.text_color || undefined,
        }}
      >
        <SheetClose asChild>
          <Button
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-sm ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer z-50"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetClose>

        <div className="space-y-4 pr-8">
          {/* Banner Image */}
          {banner.image && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Header with Icon */}
          <SheetHeader>
            <div className="flex items-start gap-3">
              <div className="flex-1 text-left">
                <SheetTitle
                  className="text-xl font-bold"
                  style={{ color: banner.text_color || undefined }}
                >
                  {banner.title}
                </SheetTitle>
              </div>
            </div>
          </SheetHeader>

          {/* Message */}
          <SheetDescription
            className="text-base leading-relaxed"
            style={{ color: banner.text_color || undefined }}
          >
            {banner.message}
          </SheetDescription>

          {/* CTA Button */}
          {banner.cta_text && banner.cta_url && (
            <div className="flex justify-center pt-2">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto"
              >
                <a
                  href={banner.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDismiss}
                >
                  {banner.cta_text}
                </a>
              </Button>
            </div>
          )}

          {/* Dismiss Button for non-dismissible banners with no CTA */}
          {!banner.dismissible && !banner.cta_text && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="w-full sm:w-auto"
              >
                Got it
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
