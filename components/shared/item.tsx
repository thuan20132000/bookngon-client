import { ClientCreate, Service, Staff } from "@/types/appointment";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { formatPrice } from "@/lib/utils";
import { Award, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

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
      className={`transition-all p-2 rounded-lg border-2 ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200"
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
            <span className="font-medium">
              <span className="font-light text-gray-500">from </span>
              {formatPrice(parseFloat(service.price))}</span>
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


interface StaffItemProps {
  staff: Staff;
  selected?: boolean;
  onSelect?: (staff: Staff) => void;
}

export const StaffItem: React.FC<StaffItemProps> = ({
  staff,
  selected = false,
  onSelect,
}) => {
  return (
    <div
      className={`transition-all p-2 rounded-lg border-2 ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200"
        } hover:border-blue-400 cursor-pointer`}
      onClick={() => onSelect?.(staff)}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      onKeyDown={e => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect?.(staff);
        }
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              {staff.first_name.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-medium">{staff.first_name}</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              <span className="text-xs text-gray-500">{staff.role_name}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

interface LoyaltyClientItemProps {
  client: ClientCreate;
}

export const LoyaltyClientItem: React.FC<LoyaltyClientItemProps> = ({ client }) => {
  const logout = useAuthStore((s) => s.logout);

  const initials = client.first_name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="w-full gap-4 py-4 mb-4">
      <CardHeader className="flex flex-row items-center gap-4 py-0">
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span
            className="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-amber-100 text-amber-600 shadow-sm"
            title="Loyalty member"
          >
            <Award className="h-3 w-3" />
          </span>
        </div>
        <div className="flex-1">
          {/* Description */}
          <p className="truncate text-sm text-muted-foreground">Welcome back, {client.first_name}!</p>
          <p className="truncate text-sm text-muted-foreground">{client.phone}</p>
        </div>
        <div className="shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};