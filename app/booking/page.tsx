import { BookingFlow } from "@/components/booking/booking-flow";
import { NavigationBar } from "@/components/booking/navigation-bar";

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Book an Appointment</h1>
        </div>
        <BookingFlow />
      </div>
      <NavigationBar />
    </div>
  );
}

