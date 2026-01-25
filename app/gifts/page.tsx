"use client";

import { GiftCardFlow } from "@/components/gifts/gift-card-flow";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useGiftCardStore } from "@/store/gift-card-store";

const GiftCardPageContent = () => {
  const { initializeBusiness, businessInfo } = useGiftCardStore();
  const query = useSearchParams();
  const businessId = query.get('business_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusiness = async () => {
      if (!businessId) {
        return;
      }
      setLoading(true);
      await initializeBusiness(businessId);
      setLoading(false);
    };
    if (businessId && businessId !== businessInfo?.id.toString()) {
      loadBusiness();
    }
  }, [businessId, businessInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Business ID is required</p>
          <Button onClick={() => window.location.href = '/'}>
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-16">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = `/?business_id=${businessId}`}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Buy a Gift Card</h3>
        </div>
        <GiftCardFlow />
      </div>
    </div>
  );
};

export default function GiftsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <GiftCardPageContent />
    </Suspense>
  );
}
