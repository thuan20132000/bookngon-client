"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGiftCardStore } from "@/store/gift-card-store";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function StatusBlock({
  icon,
  iconBg,
  iconColor,
  title,
  message,
  extra,
  actions,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  message: string;
  extra?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center`}>
        {/* Using icon from props */}
        <span className={`w-10 h-10 ${iconColor}`}>{icon}</span>
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-base text-gray-700">{message}</p>
        {extra}
        {actions && <div className="mt-4 flex flex-col items-center">{actions}</div>}
      </div>
    </div>
  );
}

const GiftCardReturnContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const businessId = searchParams.get('business_id');
  const { verifyCheckoutSession } = useGiftCardStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleReturn = async () => {
      const sessionId = searchParams.get("session_id");
      const canceled = searchParams.get("canceled");

      if (canceled === "true") {
        setStatus("error");
        setErrorMessage("Payment was canceled.");
        toast.error("Payment was canceled.");
        return;
      }

      if (!sessionId) {
        setStatus("error");
        setErrorMessage("No session ID provided.");
        toast.error("Invalid checkout session.");
        return;
      }

      try {
        await verifyCheckoutSession(sessionId);
        setStatus("success");
        toast.success("Payment successful! Your gift card is being processed.");
        // Optionally, implement redirect after a timeout here
      } catch (error) {
        console.error("Error verifying checkout session:", error);
        setStatus("error");
        setErrorMessage("Failed to verify payment.");
        toast.error("Failed to verify payment. Please contact support.");

        setTimeout(() => {
          router.push(businessId ? `/?business_id=${businessId}` : "/");
        }, 3000);
      }
    };

    handleReturn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, verifyCheckoutSession, router]);

  const handleReturnToHome = () => {
    window.location.href = businessId ? `/?business_id=${businessId}` : '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 py-12 flex items-center justify-center">
      <div className="w-full max-w-lg px-4">
        <Card className="rounded-xl shadow-2xl border-0">
          <CardContent className="py-10 px-6">
            {status === "loading" && (
              <StatusBlock
                icon={<Loader2 className="animate-spin" />}
                iconBg="bg-blue-50"
                iconColor="text-blue-500"
                title="Verifying your payment..."
                message="Please wait while we confirm your payment."
                extra={<p className="mt-2 text-sm text-gray-400">Do not close this window.</p>}
              />
            )}

            {status === "success" && (
              <StatusBlock
                icon={<CheckCircle />}
                iconBg="bg-green-50"
                iconColor="text-green-500"
                title="Payment Confirmed!"
                message="Your gift card purchase is complete."
                extra={
                  <ul className="mt-4 text-green-900 text-sm list-disc list-inside text-left space-y-1 mx-auto max-w-xs">
                    <li>Confirmation email sent.</li>
                    <li>Gift card details are in your inbox.</li>
                  </ul>
                }
                actions={
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleReturnToHome}
                  >
                    Return to Home
                  </Button>
                }
              />
            )}

            {status === "error" && (
              <StatusBlock
                icon={<XCircle />}
                iconBg="bg-red-50"
                iconColor="text-red-500"
                title="Payment Issue"
                message={errorMessage || "An unexpected error occurred during payment verification."}
                extra={
                  <p className="mt-2 text-sm text-gray-400">
                    Redirecting to home. If the problem persists, please contact support.
                  </p>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function GiftCardReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <GiftCardReturnContent />
    </Suspense>
  );
}
