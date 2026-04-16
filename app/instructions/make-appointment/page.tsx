import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarPlus,
  Globe,
  ListChecks,
  Clock,
  User,
  CheckCircle2,
  ArrowLeft,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How to Make an Appointment – BookNgon",
  description: "Step-by-step guide to booking an appointment through BookNgon.",
};

const steps = [
  {
    icon: Globe,
    title: "Open your booking link",
    description:
      "Use the booking link shared by your salon or business. You can find it in a message, email, or on their social media page.",
  },
  {
    icon: ListChecks,
    title: "Select a service",
    description:
      "Browse the list of available services and tap the one you want to book. You can select multiple services if the business allows it.",
  },
  {
    icon: User,
    title: "Choose a staff member (optional)",
    description:
      'Select your preferred staff member, or choose "Any available" to let the system assign someone automatically.',
  },
  {
    icon: Clock,
    title: "Pick a date and time",
    description:
      "Choose an available date from the calendar, then select a time slot that suits you.",
  },
  {
    icon: CheckCircle2,
    title: "Confirm your details",
    description:
      "Enter your name and phone number, review your booking summary, then tap Confirm to complete your appointment.",
  },
];

const tips = [
  "You will receive a confirmation message once your appointment is booked.",
  "Arrive a few minutes early so the staff can prepare for your visit.",
  "If you need to reschedule, cancel your current appointment and book a new one.",
];

export default function MakeAppointmentPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white font-sans dark:from-black dark:to-zinc-950">
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/instructions"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All instructions
        </Link>

        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
            <CalendarPlus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            How to Make an Appointment
          </h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Book your next visit in just a few taps — no account required.
          </p>
        </div>

        {/* Step-by-step */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="h-5 w-5 text-zinc-500" />
              Step-by-step instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-6">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="mb-1 flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-zinc-400" />
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{step.title}</p>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-blue-500" />
              Helpful tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
