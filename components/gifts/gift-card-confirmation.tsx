"use client";

import { useGiftCardStore } from "@/store/gift-card-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Gift, Mail } from "lucide-react";

export function GiftCardConfirmation() {
  const {
    purchase,
    selectedAmount,
    currency,
    customerEmail,
    recipientEmail,
    message,
    businessInfo,
    resetGiftCard,
  } = useGiftCardStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="max-w-md mx-auto space-y-7">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-green-700 mb-1">
          Payment Successful
        </h2>
        <p className="text-gray-700 text-base">
          Your gift card purchase was completed!
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Gift className="w-5 h-5 text-yellow-500" />
            Gift Card Details
          </CardTitle>
          <CardDescription className="text-sm pt-1 text-gray-600">
            We&apos;ve sent the gift card details to your email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Purchase Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Gift Card Amount</span>
              <span className="text-2xl font-bold text-blue-700">
                {selectedAmount ? formatCurrency(selectedAmount) : ""}
              </span>
            </div>
          </div>

          {/* Purchase ID */}
          {purchase?.id && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-500 mb-1">
                Purchase Reference
              </span>
              <span className="text-lg font-mono font-medium text-gray-900 tracking-tight select-all">
                #{purchase.id}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Details sent to your email
              </span>
            </div>
          )}

          {/* Customer & Recipient Info */}
          <div className="space-y-1 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Sent to: <span className="font-medium">{customerEmail}</span></span>
            </div>
            {recipientEmail && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span>Recipient: <span className="font-medium">{recipientEmail}</span></span>
              </div>
            )}
          </div>

          {/* Personal Message */}
          {message && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex flex-col">
              <span className="text-xs font-semibold text-yellow-800 mb-1">
                Personal Message
              </span>
              <span className="text-gray-700 italic">
                &quot;{message}&quot;
              </span>
            </div>
          )}

          {/* Next Steps / Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-1 text-base">
              What&apos;s Next?
            </h3>
            <ul className="text-sm text-green-900 space-y-1 list-disc list-inside">
              <li>Check your inbox for the gift card details</li>
              <li>Apply your gift card code at checkout</li>
              <li>Gift cards never expire unless specified</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                resetGiftCard();
                window.location.reload();
              }}
              className="sm:flex-1 w-full"
            >
              Purchase Another Gift Card
            </Button>
            <Button
              onClick={() => {
                const businessId = businessInfo?.id;
                if (businessId) {
                  window.location.href = `/?business_id=${businessId}`;
                } else {
                  window.location.href = "/";
                }
              }}
              className="sm:flex-1 w-full"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
