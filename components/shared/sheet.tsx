import { AppointmentService, Client, ClientCreate, Service, Staff } from "@/types/appointment";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { StaffItem } from "./item";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import { businessBookingApi } from "@/lib/api/business-booking.api";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";


interface StaffRequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStaffSelect?: (staff: Staff) => void;
}

export const StaffRequestSheet = ({ open, onOpenChange, onStaffSelect }: StaffRequestSheetProps) => {
  const { business } = useBookingStore();
  const [businessTechnicians, setBusinessTechnicians] = useState<Staff[]>([]);

  useEffect(() => {
    const fetchBusinessTechnicians = async () => {
      if (!business) return;
      const response = await businessBookingApi.getBusinessTechnicians({ business_id: business?.id.toString() || '' });
      setBusinessTechnicians(response.results!);
    };
    fetchBusinessTechnicians();
  }, [business]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Staff Request</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          Please select the staff you would like to request.
        </SheetDescription>
        <div className="h-full overflow-y-auto flex flex-col gap-2 pb-50">
          {businessTechnicians?.map((staff) => (
            <StaffItem
              key={staff.id}
              staff={staff}
              selected={false}
              onSelect={onStaffSelect}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};


interface BookingCartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentServices: AppointmentService[];
  onRemoveAppointmentService: (appointmentService: AppointmentService) => void;
  totalDuration: number;
  totalPrice: number;
}

export const BookingCartSheet = ({ open, onOpenChange, appointmentServices, onRemoveAppointmentService, totalDuration, totalPrice }: BookingCartSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Selected Services</SheetTitle>
          <SheetDescription>
            Review your selected services and proceed with booking
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Services List */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Services ({appointmentServices?.length})
            </h3>
            <div className="space-y-2">
              {appointmentServices?.map((appointmentService) => (
                <div
                  key={appointmentService.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">
                      {appointmentService.service_name}
                    </h4>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                      <span>{appointmentService.service_duration} min</span>
                      <span>·</span>
                      <span className="font-semibold text-gray-900">
                        ${parseFloat(appointmentService.service_price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveAppointmentService(appointmentService)}
                    className="shrink-0 rounded-full p-2 transition-colors hover:bg-gray-200"
                    aria-label={`Remove ${appointmentService.service_name}`}
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500">Total Duration</span>
                <p className="text-lg font-semibold text-gray-900">
                  {totalDuration} minutes
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Total Price</span>
                <p className="text-lg font-semibold text-gray-900">
                  ${totalPrice}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>

  );
};


interface ClientPhoneSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientInfo: ClientCreate | null;
  onChangeClientInfo: (clientInfo: ClientCreate | null) => void;
}

export const ClientPhoneSheet = ({ open, onOpenChange, clientInfo, onChangeClientInfo }: ClientPhoneSheetProps) => {
  const [phone, setPhone] = useState(clientInfo?.phone || "");
  const [error, setError] = useState("");
  const { business } = useBookingStore();

  const fetchClient = async () => {
    if (!phone || !business) return;
    try {
      const response = await businessBookingApi.getClientByPhone({
        business_id: business.id.toString(),
        phone: phone
      });
      return response.results;
    } catch (error) {
      console.error("Error fetching client by phone", error);
      return null;
    }
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length < 10) {
      setError("Phone number must be at least 10 digits");
      return false;
    }
    if (!phoneRegex.test(value)) {
      setError("Please enter a valid phone number");
      return false;
    }
    setError("");
    return true;
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (value.trim().length > 0) {
      validatePhone(value);
    } else {
      setError("");
    }
  };

  const handleConfirm = async () => {
    const foundClient = await fetchClient();
    console.log("foundClient: " + JSON.stringify(foundClient));
    if (foundClient) {
      onChangeClientInfo({
        id: foundClient.id,
        first_name: foundClient.first_name,
        last_name: foundClient.last_name,
        email: foundClient.email,
        phone: phone,
        is_active: true,
        is_vip: false,
        notes: "",
        primary_business_id: business?.id.toString() || '',
        date_of_birth: null,
      });
      onOpenChange(false);
    } else {
      onChangeClientInfo({
        id: undefined,
        first_name: "",
        last_name: "",
        email: "",
        phone: phone,
        is_active: true,
        is_vip: false,
        notes: "",
        primary_business_id: business?.id.toString() || '',
        date_of_birth: null,
      });
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" >
        {/* Visually hidden dialog title for accessibility */}
        <SheetTitle>Enter Phone Number</SheetTitle>
        <div className="space-y-4">
          <div className="space-y-2 pt-4">
            <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={() => validatePhone(phone)}
              className={error ? "border-red-500" : ""}
              autoComplete="off"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-gray-500">
              We&apos;ll send you a confirmation message via SMS
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Button onClick={handleConfirm} className="w-full">
            <CheckCircle className="h-4 w-4" />
            Continue
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};


interface ClientFullNameSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientInfo: ClientCreate | null;
  setClientInfo: (clientInfo: ClientCreate | null) => void;
  onChangeClientInfo: (clientInfo: ClientCreate | null) => void;
}
export const ClientFullNameSheet = ({ open, onOpenChange, clientInfo, setClientInfo, onChangeClientInfo }: ClientFullNameSheetProps) => {
  const { business } = useBookingStore();



  const updateOrCreateClientInfo = async () => {
    if (!clientInfo) return;
    try {
      if (!business) return;
      const response = await businessBookingApi.createClient({
        first_name: clientInfo.first_name,
        last_name: clientInfo.last_name,
        email: clientInfo?.email || null,
        phone: clientInfo?.phone || null,
        is_active: true,
        is_vip: false,
        notes: "",
        primary_business_id: business.id.toString(),
        date_of_birth: null,
        id: clientInfo?.id,
      });
      return response.results;
    } catch (error) {
      console.error("Error updating client info", error);
      return null;
    }
  };

  const handleConfirm = async () => {
    const response = await updateOrCreateClientInfo();
    if (response) {
      onChangeClientInfo({
        id: response.id,
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
        phone: response.phone,
        is_active: response.is_active,
        is_vip: response.is_vip,
        notes: response.notes,
        primary_business_id: response.primary_business_id,
        date_of_birth: response.date_of_birth,
      });
      onOpenChange(false);
    }
  };


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" >
        {/* Visually hidden dialog title for accessibility */}
        <SheetTitle>Enter Full Name</SheetTitle>
        <div className="space-y-4">
          <div className="space-y-2 pt-4">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={clientInfo?.first_name || ""}
              onChange={(e) => setClientInfo({ ...clientInfo, first_name: e.target.value || "" } as ClientCreate)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={clientInfo?.last_name || ""}
              onChange={(e) => setClientInfo({ ...clientInfo, last_name: e.target.value || "" } as ClientCreate)}
            />
          </div>
          <div className="flex justify-center mt-10">
            <Button onClick={handleConfirm}>
              <CheckCircle className="h-4 w-4" />
              Confirm
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


interface LoyaltyLoginSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
}

export const LoyaltyLoginSheet = ({ open, onOpenChange, businessId }: LoyaltyLoginSheetProps) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setLoggedInClient } = useAuthStore();

  const validatePhone = (value: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length < 10) {
      setError("Phone number must be at least 10 digits");
      return false;
    }
    if (!phoneRegex.test(value)) {
      setError("Please enter a valid phone number");
      return false;
    }
    setError("");
    return true;
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (error) setError("");
    if (value.trim().length > 0) {
      validatePhone(value);
    }
  };

  const handleConfirm = async () => {
    if (!validatePhone(phone)) return;

    setIsLoading(true);
    try {
      const response = await businessBookingApi.getClientByPhone({
        business_id: businessId,
        phone: phone,
      });

      const foundClient = response.results;
      if (foundClient) {
        setLoggedInClient({
          id: foundClient.id,
          first_name: foundClient.first_name,
          last_name: foundClient.last_name,
          email: foundClient.email,
          phone: phone,
          is_active: true,
          is_vip: false,
          notes: "",
          primary_business_id: businessId,
          date_of_birth: null,
        });
        toast.success(`Welcome back, ${foundClient.first_name}!`, {
          position: "top-center",
        });
        setPhone("");
        onOpenChange(false);
      } else {
        setError("No account found with this phone number. Please book an appointment to create one.");
      }
    } catch {
      setError("No account found with this phone number. Please book an appointment to create one.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetTitle>Returning Client</SheetTitle>
        <div className="space-y-4">
          <div className="space-y-2 pt-4">
            <Label htmlFor="loyalty-phone" className="text-sm">Phone Number *</Label>
            <Input
              id="loyalty-phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={() => phone.trim() && validatePhone(phone)}
              className={error ? "border-red-500" : ""}
              autoComplete="off"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-gray-500">
              Enter the phone number you used for previous bookings
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Button onClick={handleConfirm} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {isLoading ? "Looking up..." : "Continue"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};