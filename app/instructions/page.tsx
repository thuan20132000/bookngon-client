import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CalendarPlus, CalendarX2, Trash2, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Instructions – BookNgon",
  description: "Step-by-step guides for using BookNgon.",
};

const instructions = [
  {
    href: "/instructions/make-appointment",
    icon: CalendarPlus,
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "Make an Appointment",
    description: "Learn how to book a service with your salon or business in a few simple steps.",
  },
  {
    href: "/instructions/cancel-appointment",
    icon: CalendarX2,
    iconBg: "bg-yellow-100 dark:bg-yellow-950",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    title: "Cancel an Appointment",
    description: "Find out how to cancel an upcoming appointment quickly and easily.",
  },
  {
    href: "/instructions/delete-account",
    icon: Trash2,
    iconBg: "bg-red-100 dark:bg-red-950",
    iconColor: "text-red-600 dark:text-red-400",
    title: "Delete Your Account",
    description: "Request permanent deletion of your BookNgon account and all personal data.",
  },
];

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white font-sans dark:from-black dark:to-zinc-950">
      <div className="container mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <BookOpen className="h-7 w-7 text-zinc-600 dark:text-zinc-300" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Instructions</h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Step-by-step guides to help you get the most out of BookNgon.
          </p>
        </div>

        {/* Instruction list */}
        <ol className="space-y-3">
          {instructions.map((item, index) => (
            <li key={item.href}>
              <Link href={item.href} className="group block">
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 py-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {index + 1}
                    </span>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}>
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</p>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
