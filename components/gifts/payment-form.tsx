"use client";

import { useGiftCardStore } from "@/store/gift-card-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";

// Stripe will be initialized with the publishable key from the payment intent response

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
    complete: {
      color: "#32325d",
    },
  },
};

function PaymentFormContent() {
  const stripe = useStripe();
  const elements = useElements();
  const {
    selectedAmount,
    currency,
    paymentIntent,
    customerEmail,
    customerName,
    nextStep,
    previousStep,
  } = useGiftCardStore();

  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment intent should already be created when reaching this step
  const clientSecret = paymentIntent?.client_secret;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerName,
              email: customerEmail,
            },
          },
        }
      );

      if (error) {
        toast.error(error.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (confirmedPaymentIntent?.status === "succeeded") {
        // Confirm purchase with backend
        toast.success("Payment successful! Your gift card is being processed.");
        nextStep();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!clientSecret && isProcessing) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Setting up payment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
        <p className="text-gray-600">
          Complete your gift card purchase securely
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Your payment is secure and encrypted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
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

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="p-4 border rounded-lg bg-white">
                <CardElement 
                  options={CARD_ELEMENT_OPTIONS} 
                />
              </div>
            </div>

            {/* Security Notice */}
            <p className="text-xs text-gray-500 text-center">
              🔒 Your payment information is secure and encrypted. We never store your card details.
            </p>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                disabled={isProcessing}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="flex-1"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${selectedAmount ? formatCurrency(selectedAmount) : ""}`
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export function PaymentForm() {
  const { paymentIntent } = useGiftCardStore();
  // Initialize Stripe with publishable key from paymentIntent or env
  // useMemo ensures loadStripe is only called once per key change
  const stripePromise = useMemo(() => {
    if (paymentIntent?.publishable_key) {
      return loadStripe(paymentIntent.publishable_key);
    }
    const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder";
    return loadStripe(envKey);
  }, [paymentIntent]);

  if (!paymentIntent?.client_secret || !stripePromise) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Setting up payment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret: paymentIntent.client_secret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <PaymentFormContent />
    </Elements>
  );
}

