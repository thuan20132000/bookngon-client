"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGiftCardStore } from "@/store/gift-card-store";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const GiftCardReturnContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = useSearchParams();
  const businessId = query.get('business_id');
  const { verifyCheckoutSession, nextStep } = useGiftCardStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleReturn = async () => {
      const sessionId = searchParams.get("session_id");
      const canceled = searchParams.get("canceled");

      if (canceled === "true") {
        setStatus("error");
        setErrorMessage("Payment was canceled");
        toast.error("Payment was canceled");
        // Redirect back to payment step after 2 seconds
        // setTimeout(() => {
        //   router.push(`/gifts?business_id=${businessInfo?.id}`);
        // }, 2000);
        return;
      }

      if (!sessionId) {
        setStatus("error");
        setErrorMessage("No session ID provided");
        toast.error("Invalid checkout session");
        // setTimeout(() => {
        //   router.push(`/gifts?business_id=${businessInfo?.id}`);
        // }, 2000);
        return;
      }

      try {
        // Verify the checkout session
        await verifyCheckoutSession(sessionId);
        setStatus("success");
        toast.success("Payment successful! Your gift card is being processed.");

        return;
      } catch (error) {
        console.error("Error verifying checkout session:", error);
        setStatus("error");
        setErrorMessage("Failed to verify payment");
        toast.error("Failed to verify payment. Please contact support.");
        setTimeout(() => {
          router.push(`/?business_id=${businessId}`);
        }, 3000);
      }
    };

    handleReturn();
  }, [searchParams, verifyCheckoutSession, nextStep, router, businessId]);

  const handleReturnToHome = () => {
    if (!businessId) {
      window.location.href = '/';
      return;
    }
    window.location.href = `/?business_id=${businessId}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-16 flex items-center justify-center">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardContent className="py-12">
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Verifying payment...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we confirm your payment
                  </p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600">
                    Your gift card purchase has been confirmed
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Redirecting to home...
                  </p>
                  <Button onClick={handleReturnToHome}>Return to Home</Button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Payment Verification Failed
                  </h3>
                  <p className="text-gray-600">
                    {errorMessage || "An error occurred during payment verification"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Redirecting back...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function GiftCardReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <GiftCardReturnContent />
    </Suspense>
  );
}
