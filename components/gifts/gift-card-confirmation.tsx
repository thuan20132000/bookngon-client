"use client";

import { useGiftCardStore } from "@/store/gift-card-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600">
          Your gift card has been purchased successfully
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Gift Card Details
          </CardTitle>
          <CardDescription>
            We&apos;ve sent the gift card details to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Purchase Summary */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Gift Card Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {selectedAmount ? formatCurrency(selectedAmount) : ""}
                </span>
              </div>
            </div>

            {/* Purchase ID */}
            {purchase?.id && (
              <div className="p-4 bg-gray-50 border rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Purchase Reference</div>
                <div className="text-xl font-mono font-bold text-gray-900">
                  #{purchase.id}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Gift card details have been sent to your email
                </div>
              </div>
            )}

            {/* Customer Info */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>Sent to: {customerEmail}</span>
              </div>
              {recipientEmail && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>Recipient: {recipientEmail}</span>
                </div>
              )}
            </div>

            {/* Personal Message */}
            {message && (
              <div className="p-4 bg-gray-50 border rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Personal Message:</div>
                <div className="text-gray-600 italic">&quot;{message}&quot;</div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Check your email for the gift card details</li>
              <li>The gift card code can be used at checkout</li>
              <li>Gift card never expires (unless specified)</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetGiftCard();
                window.location.reload();
              }}
              className="flex-1"
            >
              Purchase Another Gift Card
            </Button>
            <Button
              onClick={() => {
                const businessId = businessInfo?.id;
                if (businessId) {
                  window.location.href = `/?business_id=${businessId}`;
                } else {
                  window.location.href = '/';
                }
              }}
              className="flex-1"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
