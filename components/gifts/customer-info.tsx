"use client";

import { useGiftCardStore } from "@/store/gift-card-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Gift, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function CustomerInfo() {
  const {
    customerEmail,
    customerName,
    recipientEmail,
    recipientName,
    message,
    recipientPhone,
    setRecipientPhone,
    setRecipientEmail,
    setRecipientName,
    setMessage,
    selectedAmount,
    currency,
    nextStep,
    previousStep,
    canProceedToPaymentStep,
    createCheckoutSession,
  } = useGiftCardStore();
  
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleContinueToPayment = async () => {
    if (!canProceedToPaymentStep()) return;
    
    setIsCreatingPayment(true);
    try {
      const checkoutSession = await createCheckoutSession();
      if (!checkoutSession) {
        throw new Error("Failed to create checkout session");
      }
      window.location.href = checkoutSession.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to create checkout session. Please try again.");
      setIsCreatingPayment(false);
    }
  }

  useEffect(() => {
    setRecipientEmail("ethantruong1602@gmail.com");
    setRecipientName("Thuan Truong");
  }, []);  

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Information</h2>
        <p className="text-gray-600">
          Please provide your contact details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Information
          </CardTitle>
          <CardDescription>
            We&apos;ll send the gift card receipt to the recipient&apos;s email address and phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customer-name">Recipient Name *</Label>
            <Input
              id="customer-name"
              type="text"
              placeholder="Enter recipient's full name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="customer-email">Recipient Email *</Label>
            <Input
              id="customer-email"
              type="email"
              placeholder="Enter recipient's email address"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="customer-phone">Recipient Phone</Label>
            <Input
              id="customer-phone"
              type="tel"
              placeholder="Enter recipient's phone number"
              value={recipientPhone || ""}
              onChange={(e) => setRecipientPhone(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="customer-message">Message</Label>
            <Textarea
              id="customer-message"
              placeholder="Enter your message"
              value={message || ""}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Summary */}
          {selectedAmount && (
            <div className="p-4 bg-gray-50 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Gift Card Amount:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(selectedAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={isCreatingPayment}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleContinueToPayment}
              disabled={!canProceedToPaymentStep() || isCreatingPayment}
              className="flex-1"
              size="lg"
            >
              Continue to Payment
              {isCreatingPayment && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
