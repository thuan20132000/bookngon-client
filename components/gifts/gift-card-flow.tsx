"use client";

import { useGiftCardStore } from "@/store/gift-card-store";
import { AmountSelection } from "./amount-selection";
import { CustomerInfo } from "./customer-info";
import { PaymentForm } from "./payment-form";
import { GiftCardConfirmation } from "./gift-card-confirmation";
import { Card, CardContent } from "@/components/ui/card";
import { GIFT_CARD_STEPS } from "@/enums/gift-card.enums";

export function GiftCardFlow() {
  const { currentStep } = useGiftCardStore();

  const renderContentStep = (step: GIFT_CARD_STEPS) => {
    switch (step) {
      case GIFT_CARD_STEPS.AMOUNT_SELECTION:
        return <AmountSelection />;
      case GIFT_CARD_STEPS.CUSTOMER_INFO:
        return <CustomerInfo />;
      case GIFT_CARD_STEPS.PAYMENT:
        return <PaymentForm />;
      case GIFT_CARD_STEPS.CONFIRMATION:
        return <GiftCardConfirmation />;
      default:
        return <AmountSelection />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          {renderContentStep(currentStep)}
        </CardContent>
      </Card>
    </div>
  );
}
