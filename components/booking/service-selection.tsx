"use client";

import { useState } from "react";
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
import { BOOKING_STEPS } from "@/enums/booking.enums";

// Mock data - in a real app, this would come from an API
const CATEGORY_SERVICES: Category[] =
  [
    {
      id: 6,
      business: 1,
      name: "Dental Services",
      description: "Dental Services",
      sort_order: 0,
      is_active: true,
      is_online_booking: true,
      created_at: "2025-11-19T06:42:03.427120Z",
      color_code: "#ab8c50",
      icon: null,
      image: null,
      services: [
        {
          "id": 2,
          "category": 6,
          "category_name": "Dental Services",
          "name": "Men's Cut",
          "description": "Men's Cut",
          "duration_minutes": 30,
          "price": "45.00",
          "is_active": true,
          "requires_staff": true,
          "max_capacity": 1,
          "is_online_booking": true,
          "created_at": "2025-11-19T06:42:03.428919Z",
          "updated_at": "2025-11-19T06:53:33.346229Z",
          "sort_order": 0,
          "color_code": "#8f863e",
          "icon": "fas fa-cut",
          "image": "https://snapslearning-bk.s3.amazonaws.com/media/services/men_cut.jpg"
        }
      ]
    },
    {
      "id": 2,
      "business": 1,
      "name": "Hair Coloring",
      "description": "Hair Coloring",
      "sort_order": 0,
      "is_active": true,
      "is_online_booking": true,
      "created_at": "2025-11-19T06:42:03.425837Z",
      "color_code": "#a55b5b",
      "icon": null,
      "image": null,
      "services": [
        {
          "id": 12,
          "category": 2,
          "category_name": "Hair Coloring",
          "name": "Hair Cut For Man",
          "description": "",
          "duration_minutes": 30,
          "price": "0.00",
          "is_active": true,
          "requires_staff": false,
          "max_capacity": 1,
          "is_online_booking": true,
          "created_at": "2025-11-19T07:03:12.764176Z",
          "updated_at": "2025-11-19T07:03:12.764185Z",
          "sort_order": 0,
          "color_code": "#a55b5b",
          "icon": null,
          "image": null
        },
        {
          "id": 11,
          "category": 2,
          "category_name": "Hair Coloring",
          "name": "jjkbj",
          "description": "",
          "duration_minutes": 30,
          "price": "0.00",
          "is_active": true,
          "requires_staff": false,
          "max_capacity": 1,
          "is_online_booking": true,
          "created_at": "2025-11-19T07:03:01.631521Z",
          "updated_at": "2025-11-19T07:03:01.631537Z",
          "sort_order": 0,
          "color_code": "#c56363",
          "icon": null,
          "image": null
        }
      ]
    },
    {
      "id": 1,
      "business": 1,
      "name": "Hair Cuts",
      "description": "Hair Cuts",
      "sort_order": 0,
      "is_active": true,
      "is_online_booking": true,
      "created_at": "2025-11-19T06:42:03.425375Z",
      "color_code": null,
      "icon": null,
      "image": null,
      "services": []
    },
    {
      "id": 3,
      "business": 1,
      "name": "Hair Treatments",
      "description": "Hair Treatments",
      "sort_order": 0,
      "is_active": true,
      "is_online_booking": true,
      "created_at": "2025-11-19T06:42:03.426201Z",
      "color_code": null,
      "icon": null,
      "image": null,
      "services": []
    },
    {
      "id": 4,
      "business": 1,
      "name": "Nail Services",
      "description": "Nail Services",
      "sort_order": 0,
      "is_active": true,
      "is_online_booking": true,
      "created_at": "2025-11-19T06:42:03.426602Z",
      "color_code": null,
      "icon": null,
      "image": null,
      "services": [
        {
          "id": 14,
          "category": 4,
          "category_name": "Nail Services",
          "name": "csa acs as",
          "description": "",
          "duration_minutes": 30,
          "price": "0.00",
          "is_active": true,
          "requires_staff": false,
          "max_capacity": 1,
          "is_online_booking": true,
          "created_at": "2025-11-19T16:31:49.372217Z",
          "updated_at": "2025-11-19T16:31:49.372244Z",
          "sort_order": 0,
          "color_code": "#b05858",
          "icon": null,
          "image": null
        },
        {
          "id": 15,
          "category": 4,
          "category_name": "Nail Services",
          "name": "csa sac sac sac",
          "description": "",
          "duration_minutes": 30,
          "price": "0.00",
          "is_active": true,
          "requires_staff": false,
          "max_capacity": 1,
          "is_online_booking": true,
          "created_at": "2025-11-19T16:31:54.779273Z",
          "updated_at": "2025-11-19T16:31:54.779281Z",
          "sort_order": 0,
          "color_code": "#b46868",
          "icon": null,
          "image": null
        }
      ]
    },
    {
      "id": 5,
      "business": 1,
      "name": "Spa Services",
      "description": "Spa Services",
      "sort_order": 0,
      "is_active": true,
      "is_online_booking": true,
      "created_at": "2025-11-19T06:42:03.426848Z",
      "color_code": null,
      "icon": null,
      "image": null,
      "services": []
    }
  ];

export function ServiceSelection() {
  const {
    selectedServices,
    addService,
    removeService,
    setCurrentStep,
  } = useBookingStore();
  // For accordions, optionally allow multiple open or single open: here we allow multiple open
  const [openCategories, setOpenCategories] = useState<string[]>([]);


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
        {CATEGORY_SERVICES.map((category) => (
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
