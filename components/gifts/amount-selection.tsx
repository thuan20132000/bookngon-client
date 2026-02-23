"use client";

import { useGiftCardStore } from "@/store/gift-card-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";

const PRESET_AMOUNTS = [25, 50, 100, 150, 200, 250, 500];

export function AmountSelection() {
  const {
    selectedAmount,
    setSelectedAmount,
    currency,
    businessInfo,
    nextStep,
    canProceedToCustomerInfoStep,
  } = useGiftCardStore();

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSelectedAmount(value);
    } else {
      setSelectedAmount(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <CardContent className="space-y-6">
        {/* Preset Amounts */}
        <div>
          <Label className="mb-3 block">Choose an Amount</Label>
          <div className="grid grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant={selectedAmount === amount ? "default" : "outline"}
                onClick={() => setSelectedAmount(amount)}
                className="h-12"
              >
                {formatCurrency(amount)}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
          <Input
            id="custom-amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter amount"
            value={selectedAmount && !PRESET_AMOUNTS.includes(selectedAmount) ? selectedAmount : ""}
            onChange={handleCustomAmount}
            className="mt-2"
          />
        </div>

        {/* Selected Amount Display */}
        {selectedAmount && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Selected Amount:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(selectedAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <Button
          onClick={nextStep}
          disabled={!canProceedToCustomerInfoStep()}
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
      </CardContent>
    </div>
  );
}
