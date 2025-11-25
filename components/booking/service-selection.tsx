"use client";

import { useEffect, useState } from "react";
import { AppointmentService, Category, Service } from "@/types/booking";
import { useBookingStore } from "@/store/booking-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// You may want to use your own Accordion component or from your design system:
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ServiceItem } from "../shared/item";
import { businessBookingApi } from "@/lib/api/business-booking.api";

export function ServiceSelection() {
  const {
    selectedAppointmentServices,
    addAppointmentService,
    removeAppointmentService,
    business,
    categoriesServices,
    setCategoriesServices,
  } = useBookingStore();
  // For accordions, optionally allow multiple open or single open: here we allow multiple open
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategoriesServices = async () => {
      if (!business) return;
      const response = await businessBookingApi.getCategoriesServices({ business_id: business?.id });
      setCategoriesServices(response.results as Category[]);
    };
    fetchCategoriesServices();
  }, [business, setCategoriesServices]);


  // Utility to toggle a service
  const handleServiceToggle = (appointmentService: AppointmentService) => {
    const exists = selectedAppointmentServices.some((s) => s.service == appointmentService.service);
    if (exists) {
      removeAppointmentService(appointmentService);
    } else {
      addAppointmentService(appointmentService);
    }
  };

  // Handle open/close of accordion items
  const handleAccordionChange = (categoryId: number) => {
    setOpenCategories((prev) =>
      prev.includes(String(categoryId))
        ? prev.filter((id) => id !== String(categoryId))
        : [...prev, String(categoryId)]
    );
  };

  return (
    <div className="space-y-6">
      <Accordion
        type="multiple"
        value={openCategories}
        onValueChange={setOpenCategories}
        className="w-full"
      >
        {categoriesServices.map((category) => (
          <AccordionItem key={category.id} value={String(category.id)}>
            <AccordionTrigger onClick={() => handleAccordionChange(category.id)}>
              <div className="flex items-center gap-2">
                <span className="font-bold">{category.name}</span>
                {category.services && category.services.length > 0 && (
                  <span className="text-gray-500 ml-2 font-bold">
                    ({category.services.length})
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {category.services && category.services.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {category.services.map((service) => {
                    return (
                      <ServiceItem
                        key={service.id}
                        service={service}
                        selected={selectedAppointmentServices.some((s) => s.service == service.id)}
                        onSelect={(appointmentService) => {
                          
                          handleServiceToggle({
                            ...appointmentService,
                            id: new Date().getTime(),
                            service: service.id,
                            service_name: service.name,
                            service_duration: service.duration_minutes,
                            service_price: service.price,
                            service_color_code: service.color_code || '',
                            staff: null,
                            staff_name: '',
                            is_staff_request: false,
                            custom_price: null,
                            custom_duration: null,
                            start_at: '',
                            end_at: '',
                            is_active: true,
                            tip_amount: null,
                            is_draft: false,
                          });
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No services in this category.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
