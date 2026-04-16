import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Smartphone, Globe, Mail, AlertTriangle, CheckCircle2, Clock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Delete Your Account – BookNgon",
  description: "Instructions for requesting deletion of your BookNgon account and personal data.",
};

const steps = [
  {
    icon: Globe,
    title: "Visit your client profile",
    description:
      'Open the booking link sent to you by your salon or business and tap "View My Profile". You can also navigate directly to the client page URL included in your appointment confirmation.',
  },
  {
    icon: Trash2,
    title: 'Find the "Danger Zone" section',
    description:
      'Scroll to the bottom of your Client Information page. You will see a red-bordered "Danger Zone" card.',
  },
  {
    icon: AlertTriangle,
    title: 'Click "Delete Account"',
    description:
      'Tap the "Delete Account" button. A confirmation message will appear asking you to verify your intent.',
  },
  {
    icon: CheckCircle2,
    title: "Confirm the deletion",
    description:
      'Click "Yes, delete my account" to permanently remove your account and all associated personal data from our system.',
  },
];

const dataItems = [
  "Full name, phone number, and email address",
  "Date of birth and address",
  "Appointment history",
  "Loyalty points and visit records",
  "Notes added by the business about you",
];

const retainedItems = [
  "Anonymised transaction records required for financial reporting (no personal identifiers)",
  "Aggregated, non-identifiable analytics data",
];

export default function DeleteAccountPage() {
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
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
            <Trash2 className="h-7 w-7 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            How to Delete Your Account
          </h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            You have the right to request deletion of your personal data at any time.
            Follow the steps below or contact us directly.
          </p>
        </div>

        {/* Step-by-step */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Smartphone className="h-5 w-5 text-zinc-500" />
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

        {/* What gets deleted */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              What data will be deleted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dataItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* What we retain */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-yellow-500" />
              What we may retain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
              In limited cases, applicable law may require us to retain certain records. Where we do, the data contains no personal identifiers.
            </p>
            <ul className="space-y-2">
              {retainedItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Contact fallback */}
        <Card className="border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Prefer to email us instead?
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Send a deletion request to{" "}
                  <a
                    href="mailto:support@bookngon.com"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    support@bookngon.com
                  </a>{" "}
                  with the subject line <strong>&quot;Account Deletion Request&quot;</strong> and include
                  your registered phone number or email. We will process your request within{" "}
                  <strong>30 days</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
