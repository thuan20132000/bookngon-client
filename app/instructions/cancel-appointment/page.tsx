import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarX2,
  Globe,
  ListChecks,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How to Cancel an Appointment – BookNgon",
  description: "Step-by-step guide to cancelling an appointment through BookNgon.",
};

const steps = [
  {
    icon: Globe,
    title: "Open your booking confirmation",
    description:
      "Find the appointment confirmation message or email sent to you after booking. It contains a link to manage your appointment.",
  },
  {
    icon: ListChecks,
    title: "View your upcoming appointments",
    description:
      'Tap "View My Profile" or open your client page. Your upcoming appointments are listed at the top of the page.',
  },
  {
    icon: CalendarX2,
    title: 'Tap "Cancel" on the appointment',
    description:
      'Find the appointment you want to cancel and tap the "Cancel" button next to it.',
  },
  {
    icon: AlertTriangle,
    title: "Confirm the cancellation",
    description:
      'A confirmation prompt will appear. Tap "Yes, cancel" to finalise. The appointment will be removed and the time slot freed up.',
  },
];

const notes = [
  "Cancellations may be subject to the business's cancellation policy.",
  "Some businesses require cancellations to be made a certain number of hours in advance.",
  "If you are unable to cancel online, contact the business directly to inform them.",
];

export default function CancelAppointmentPage() {
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
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-950">
            <CalendarX2 className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            How to Cancel an Appointment
          </h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Plans changed? You can cancel your appointment directly from your client profile.
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

        {/* Notes */}
        <Card className="border-yellow-100 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-yellow-500" />
              Things to keep in mind
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                  {note}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
