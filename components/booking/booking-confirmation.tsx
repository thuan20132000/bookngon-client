"use client";

import { BookingData } from "./booking-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Clock, User, Phone, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookingConfirmationProps {
  bookingData: BookingData;
}

export function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalPrice = bookingData.selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const totalDuration = bookingData.selectedServices.reduce(
    (sum, service) => sum + service.duration,
    0
  );

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
          <p className="mt-2 text-gray-600">
            Your appointment has been successfully booked. We've sent a confirmation to your phone.
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>Your appointment information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Services */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Services</h3>
            <div className="space-y-2">
              {bookingData.selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <div className="mt-1 flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {service.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {service.duration} min
                      </Badge>
                    </div>
                  </div>
                  <p className="font-semibold text-blue-600">${service.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Time & Date */}
          {bookingData.selectedTimeSlot && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Calendar className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{formatDate(bookingData.selectedTimeSlot.startTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Clock className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold">
                    {formatTime(bookingData.selectedTimeSlot.startTime)} -{" "}
                    {formatTime(bookingData.selectedTimeSlot.endTime)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Staff */}
          {bookingData.selectedStaff && (
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <User className="mt-0.5 h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Staff Member</p>
                <p className="font-semibold">{bookingData.selectedStaff.name}</p>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <User className="mt-0.5 h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{bookingData.customerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Phone className="mt-0.5 h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{bookingData.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xs text-gray-500">Duration: {totalDuration} minutes</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">${totalPrice}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button asChild variant="outline">
          <Link href="/booking">Book Another Appointment</Link>
        </Button>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

