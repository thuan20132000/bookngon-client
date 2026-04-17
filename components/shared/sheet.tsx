import { AppointmentService, ClientCreate, Staff } from "@/types/appointment";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { StaffItem } from "./item";
import { X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import { businessBookingApi } from "@/lib/api/business-booking.api";
import { authApi } from "@/lib/api/auth.api";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';

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
    if (foundClient) {
      onChangeClientInfo({
        id: foundClient.id,
        first_name: foundClient.first_name || "",
        last_name: foundClient.last_name || "",
        email: foundClient.email || "",
        phone: phone,
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
        primary_business_id: business?.id.toString() || '',
        date_of_birth: null,
      });
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[50%] max-h-[50%]">
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


interface LoyaltyLoginSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
}

export const LoyaltyLoginSheet = ({ open, onOpenChange, businessId }: LoyaltyLoginSheetProps) => {
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneLookedUp, setIsPhoneLookedUp] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);
  const [foundClient, setFoundClient] = useState<ClientCreate | null>(null);
  const { setLoggedInClient, setTokens } = useAuthStore();
  const { setClientInfo } = useBookingStore();

  const resetState = () => {
    setPhone("");
    setFirstName("");
    setLastName("");
    setError("");
    setNameError("");
    setIsPhoneLookedUp(false);
    setIsNewClient(false);
    setFoundClient(null);
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
    if (error) setError("");
    if (isPhoneLookedUp) {
      setIsPhoneLookedUp(false);
      setIsNewClient(false);
      setFoundClient(null);
      setFirstName("");
      setLastName("");
    }
    if (value.trim().length > 0) {
      validatePhone(value);
    }
  };

  const handleFacebookSuccess = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.facebookLogin(accessToken, businessId);
      if (response.success && response.results) {
        const { access, refresh, client } = response.results;
        setTokens(access, refresh);
        setLoggedInClient(client);
        setClientInfo(client);
        toast.success(`Welcome, ${client.first_name}!`, { position: "top-center" });
        resetState();
        onOpenChange(false);
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch {
      setError("Facebook login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("Google sign-in failed. No credential received.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await authApi.googleLogin(idToken, businessId);
      if (response.success && response.results) {
        const { access, refresh, client } = response.results;
        setTokens(access, refresh);
        setLoggedInClient(client);
        setClientInfo(client);
        toast.success(`Welcome, ${client.first_name}!`, { position: "top-center" });
        resetState();
        onOpenChange(false);
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLookup = async () => {
    if (!validatePhone(phone)) return;

    setIsLoading(true);
    try {
      const response = await businessBookingApi.getClientByPhone({
        business_id: businessId,
        phone: phone,
      });

      const client = response.results;
      setIsPhoneLookedUp(true);

      if (client) {
        const clientData: ClientCreate = {
          id: client.id,
          first_name: client.first_name || "",
          last_name: client.last_name || "",
          email: client.email,
          phone: phone,
          primary_business_id: businessId,
          date_of_birth: null,
        };
        setFoundClient(clientData);
        setFirstName(client.first_name || "");
        setLastName(client.last_name || "");
        setIsNewClient(false);
      } else {
        setFoundClient(null);
        setFirstName("");
        setLastName("");
        setIsNewClient(true);
      }
    } catch {
      setFoundClient(null);
      setFirstName("");
      setLastName("");
      setIsNewClient(true);
      setIsPhoneLookedUp(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmFound = () => {
    if (!foundClient) return;
    setLoggedInClient(foundClient);
    setClientInfo(foundClient);
    toast.success(`Welcome back, ${foundClient.first_name}!`, { position: "top-center" });
    resetState();
    onOpenChange(false);
  };

  const handleConfirmNew = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setNameError("First name and last name are required");
      return;
    }
    setNameError("");
    setIsLoading(true);

    try {
      const createResponse = await businessBookingApi.createClient({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        primary_business_id: businessId,
        date_of_birth: null,
      });
      const newClient = createResponse.results;
      if (newClient) {
        const clientData: ClientCreate = {
          id: newClient.id,
          first_name: newClient.first_name,
          last_name: newClient.last_name,
          email: newClient.email,
          phone: newClient.phone,
          primary_business_id: businessId,
          date_of_birth: null,
        };
        setLoggedInClient(clientData);
        setClientInfo(clientData);
        toast.success(`Welcome, ${clientData.first_name}!`, { position: "top-center" });
      }
      resetState();
      onOpenChange(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(val) => { if (!val) resetState(); onOpenChange(val); }}>
      <SheetContent
        side="bottom"
        className="max-h-[50%] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetTitle>Your Information</SheetTitle>
        <SheetDescription>
          Enter your phone number or sign in with Google or Facebook to continue.
        </SheetDescription>
        <div className="space-y-4 mt-4">
          {/* Phone input */}
          <div className="space-y-2">
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
              We&apos;ll send you a confirmation message via SMS
            </p>
          </div>

          {/* Step 1: Phone lookup button */}
          {!isPhoneLookedUp && (
            <Button onClick={handlePhoneLookup} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isLoading ? "Looking up..." : "Continue"}
            </Button>
          )}

          {/* Step 2a: Found client */}
          {isPhoneLookedUp && foundClient && (
            <div className="space-y-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-1">
                <p className="text-sm text-green-800 font-semibold">Welcome back!</p>
                <p className="font-bold text-gray-900">
                  {foundClient.first_name} {foundClient.last_name}
                </p>
                {foundClient.email && (
                  <p className="text-sm text-gray-600">{foundClient.email}</p>
                )}
              </div>
              <Button onClick={handleConfirmFound} className="w-full">
                <CheckCircle className="h-4 w-4" />
                Confirm & Continue
              </Button>
            </div>
          )}

          {/* Step 2b: New client — name fields */}
          {isPhoneLookedUp && isNewClient && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                We didn&apos;t find an account with this number. Please enter your name.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="loyalty-first-name" className="text-sm">First Name *</Label>
                  <Input
                    id="loyalty-first-name"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loyalty-last-name" className="text-sm">Last Name *</Label>
                  <Input
                    id="loyalty-last-name"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                  />
                </div>
              </div>
              {nameError && <p className="text-sm text-red-500">{nameError}</p>}
              <Button onClick={handleConfirmNew} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {isLoading ? "Creating account..." : "Continue"}
              </Button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400 uppercase">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <div className="flex flex-row gap-2 justify-center items-center">
            {/* Google Sign-In */}
            <div className="flex justify-center flex-1">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError("Google sign-in failed. Please try again.");
                }}
                size="large"
                text="continue_with"
              />
            </div>
            {/* Facebook Sign-In */}
            <div className="flex justify-center flex-1">
              <FacebookLogin
                appId={FACEBOOK_APP_ID}
                onSuccess={(response) => handleFacebookSuccess(response.accessToken)}
                onFail={() => setError("Facebook sign-in failed. Please try again.")}
                fields="name,picture"
                scope="public_profile"
                render={({ onClick }) => (
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 cursor-pointer"
                    onClick={onClick}
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-[#1877F2]"
                      aria-hidden="true"
                    >
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                )}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}