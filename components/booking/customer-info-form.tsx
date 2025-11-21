"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerInfoFormProps {
  customerName: string;
  customerPhone: string;
  onInfoChange: (name: string, phone: string) => void;
}

export function CustomerInfoForm({
  customerName,
  customerPhone,
  onInfoChange,
}: CustomerInfoFormProps) {
  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    onInfoChange(name, phone);
  }, [name, phone, onInfoChange]);

  const validateName = (value: string) => {
    if (value.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    setNameError("");
    return true;
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const digitsOnly = value.replace(/\D/g, "");
    
    if (digitsOnly.length < 10) {
      setPhoneError("Phone number must be at least 10 digits");
      return false;
    }
    if (!phoneRegex.test(value)) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.trim().length > 0) {
      validateName(value);
    } else {
      setNameError("");
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (value.trim().length > 0) {
      validatePhone(value);
    } else {
      setPhoneError("");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Please provide your contact details to confirm your booking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={() => validateName(name)}
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={() => validatePhone(phone)}
              className={phoneError ? "border-red-500" : ""}
            />
            {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
            <p className="text-xs text-gray-500">
              We'll send you a confirmation message via SMS
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900">Booking Summary</p>
            <p className="text-gray-600">
              Once you confirm, you'll receive a booking confirmation with all the details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

