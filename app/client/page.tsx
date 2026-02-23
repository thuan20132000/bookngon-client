"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Phone, Mail, Calendar, Clock, User, Badge, Heart, X } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import { Client } from "@/types/client";
import { AppointmentWithServices, AppointmentStatus } from "@/types/appointment";
import { businessBookingApi, CancelAppointmentParams } from "@/lib/api/business-booking.api";
import { getAppointmentStatusColor, getAppointmentStatusLabel } from "@/lib/utils";
import { toast } from "sonner";

const ClientPageContent = () => {
  const query = useSearchParams();
  const clientId = query.get("client_id");
  const businessId = query.get("business_id");

  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<AppointmentWithServices[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClientData = async () => {
      if (!clientId || !businessId) {
        setError("Missing client_id or business_id");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [clientResponse, appointmentsResponse] = await Promise.all([
          businessBookingApi.getClient({ business_id: businessId, client_id: clientId }),
          businessBookingApi.getClientAppointments({ business_id: businessId, client_id: clientId }),
        ]);
        if (clientResponse) {
          setClientInfo(clientResponse.results || null);
        }

        if (appointmentsResponse) {
          setAppointments(appointmentsResponse.results || []);
        }
      } catch (err) {
        console.error("Error loading client data:", err);
        setError("Failed to load client data");
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [clientId, businessId]);

  const handleCancelAppointment = async (params: CancelAppointmentParams) => {
    try {
      // Confirm cancel appointment
      const confirm = window.confirm("Are you sure you want to cancel this appointment?");
      if (!confirm) {
        return;
      }

      await businessBookingApi.cancelAppointment(params);
      // refresh appointments
      const appointmentsResponse = await businessBookingApi.getClientAppointments({
        business_id: params.business_id,
        client_id: params.client_id,
      });
      
      setAppointments(appointmentsResponse.results || []);
      toast.success("Appointment cancelled successfully");
    } catch (err) {
      console.error("Error canceling appointment:", err);
      toast.error("Failed to cancel appointment");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">Loading client information...</div>
        </div>
      </div>
    );
  }

  if (error || !clientInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">Client not found</h1>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">{error || "Unable to load client information."}</p>
          {businessId && (
            <Link href={`/?business_id=${businessId}`}>
              <Button>Go Home</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white font-sans dark:from-black dark:to-zinc-950">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          {businessId && (
            <Link href={`/?business_id=${businessId}`}>
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          )}
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Client Information Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Client Information</CardTitle>
                {clientInfo.is_vip && (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    VIP
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Name */}
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Name</p>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {clientInfo.full_name || `${clientInfo.first_name} ${clientInfo.last_name}`.trim()}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                {clientInfo.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Phone</p>
                      <a
                        href={`tel:${clientInfo.phone}`}
                        className="font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
                      >
                        {clientInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {clientInfo.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Email</p>
                      <a
                        href={`mailto:${clientInfo.email}`}
                        className="font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
                      >
                        {clientInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Date of Birth */}
                {clientInfo.date_of_birth && (
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Date of Birth</p>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {dayjs(clientInfo.date_of_birth).format("MMMM DD, YYYY")}
                        {clientInfo.age && ` (Age: ${clientInfo.age})`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Address */}
                {clientInfo.full_address && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Address</p>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{clientInfo.full_address}</p>
                    </div>
                  </div>
                )}

                {/* Primary Business */}
                {clientInfo.primary_business_name && (
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Primary Business</p>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{clientInfo.primary_business_name}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {clientInfo.notes && (
                  <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Notes</p>
                      <p className="text-zinc-700 dark:text-zinc-300">{clientInfo.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Upcoming Appointments ({appointments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-zinc-600 dark:text-zinc-400">No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
                    >
                      {/* Appointment Header */}
                      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                              #{appointment.id}
                            </h3>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getAppointmentStatusColor(appointment.status as AppointmentStatus)}`}>
                              {getAppointmentStatusLabel(appointment.status as AppointmentStatus)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{dayjs(appointment.start_at).format("dddd, MMMM DD, YYYY")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {dayjs(appointment.start_at).format("h:mm A")} - {dayjs(appointment.end_at).format("h:mm A")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Appointment Services */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Services:</p>
                        {appointment.appointment_services.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900"
                          >
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: service.service_color_code || "#81bcff" }}
                                />
                                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{service.service_name}</p>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                                {service.staff_name && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {
                                      service?.is_staff_request ?
                                        <div className="flex items-center gap-1">
                                          <Heart className="h-3 w-3 text-red-500" fill="red" /> {service.staff_name}
                                        </div> :
                                        <div className="flex items-center gap-1">Anyone</div>
                                    }
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{service.service_duration} min</span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                                ${parseFloat(service.service_price || "0").toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Appointment Total */}
                      <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">Total</p>
                        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                          $
                          {appointment.appointment_services
                            .reduce((sum, service) => sum + parseFloat(service.service_price || "0"), 0)
                            .toFixed(2)}
                        </p>
                      </div>

                      {/* Cancel Appointment Button */}
                      <Button 
                        variant="outline" 
                        className="mt-4 bg-red-500 text-white hover:bg-red-600"
                        onClick={() => handleCancelAppointment({ business_id: businessId || '', client_id: clientId || '', appointment_id: appointment.id })}
                      >
                        <X className="h-4 w-4" />
                        Cancel Appointment
                      </Button>

                      {/* Notes */}
                      {appointment.notes && (
                        <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Notes:</p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function ClientPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPageContent />
    </Suspense>
  );
}

