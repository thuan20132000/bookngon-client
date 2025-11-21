import { Service } from "@/types/booking";
import { Card, CardContent, CardHeader } from "../ui/card";


import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

interface ServiceItemProps {
  service: Service;
  selected?: boolean;
  onSelect?: (service: Service) => void;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  selected = false,
  onSelect,
}) => {
  return (
    <div
      className={`transition-all p-2 rounded-lg border-2 ${
        selected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      } hover:border-blue-400 cursor-pointer`}
      onClick={() => onSelect?.(service)}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      onKeyDown={e => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect?.(service);
        }
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium">{service.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className="font-bold">${service.price}</span>
            <span>·</span>
            <span className="font-bold">{service.duration_minutes} min</span>
          </div>
        </div>
        <Checkbox
          checked={selected}
          aria-label={`Select ${service.name}`}
          onClick={e => e.stopPropagation()}
          onChange={() => onSelect?.(service)}
          className="ml-2"
        />
      </div>
    </div>
  );
};