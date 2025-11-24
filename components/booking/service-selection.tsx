"use client";

import { useEffect, useState } from "react";
import { Category, Service } from "@/types/booking";
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
    selectedServices,
    addService,
    removeService,
    business,
    categoriesServices,
    setCategoriesServices,
  } = useBookingStore();
  // For accordions, optionally allow multiple open or single open: here we allow multiple open
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategoriesServices = async () => {
      console.log('fetching categories services');
      if (!business) return;
      const response = await businessBookingApi.getCategoriesServices({ business_id: business?.id });
      setCategoriesServices(response.results as Category[]);
    };
    fetchCategoriesServices();
  }, [business, setCategoriesServices]);


  // Utility to toggle a service
  const handleServiceToggle = (service: Service) => {
    const exists = selectedServices.some((s) => s.id === service.id);
    if (exists) {
      removeService(service.id);
    } else {
      addService(service);
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
                        selected={selectedServices.some((s) => s.id === service.id)}
                        onSelect={(service) => handleServiceToggle(service)}
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
