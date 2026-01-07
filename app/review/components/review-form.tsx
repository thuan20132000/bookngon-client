"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Clock, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateReviewPayload } from "@/types/review";
import { reviewApi } from "@/lib/api/review.api";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { AxiosError } from "axios";
import { AppointmentWithServices } from "@/types/appointment";
import { businessBookingApi } from "@/lib/api/business-booking.api";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";

interface ReviewFormProps {
  appointmentId: string;
  businessId: string;
  onSubmitSuccess?: () => void;
}

export function ReviewForm({ appointmentId, businessId, onSubmitSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentWithServices | null>(null);
  useEffect(() => {
    const fetchAppointment = async () => {
      const response = await businessBookingApi.getAppointment({
        appointment_id: appointmentId,
        business_id: businessId || ""
      });
      console.log("response: ", response);
      if (response.success && response.results) {
        setAppointment(response.results as AppointmentWithServices);
      }

    };

    if (appointmentId) {
      fetchAppointment();
    }

  }, [appointmentId, businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating", {
        description: "Rating is required to submit a review.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateReviewPayload = {
        appointment: appointmentId,
        rating,
        comment: comment.trim() || null,
      };

      toast.loading("Submitting review...", {
        description: "Please wait while we save your review.",
        position: 'top-center',
      });

      await reviewApi.createReview(payload);


      toast.dismiss();
      toast.success("Review submitted successfully", {
        description: "Thank you for your feedback!",
        duration: 3000,
        position: 'top-center',
      });

      // Reset form
      setRating(0);
      setComment("");
      setHoveredRating(0);

      onSubmitSuccess?.();

      if (rating >= 4) {
        // show google review popup

        // show google review popup
        if (appointment?.business_google_review_url) {
          toast.info("Please leave us Review on Google", {
            description: "We appreciate your feedback and would love to hear from you. Thank you!",
            position: 'bottom-center',
            duration: Infinity,
            icon: <Star className="w-4 h-4" />,
            action: {
              label: "Leave Review",
              onClick: () => {
                window.open(appointment?.business_google_review_url || "", '_blank');
              },
            },
            style: {
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              padding: "1rem",
              fontSize: "1rem",
              fontWeight: "bold",
              textAlign: "center",
              textDecoration: "none",
              textTransform: "uppercase",
              marginTop: "50%",
            },
          });
          return;
        }
      }

    } catch (error: unknown) {
      console.error("Error submitting review", error);
      toast.dismiss();

      const errorMessage = error instanceof AxiosError ? error.response?.data?.message ||
        error.response?.data?.errors?.non_field_errors?.[0] ||
        "Failed to submit review. Please try again." :
        "Failed to submit review. Please try again.";
      toast.error("Error submitting review", {
        description: errorMessage,
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>
          Share your experience with our services and help our services to improve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Appointment Details Section */}
        {appointment && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Business</p>
                  <p className="font-medium">{appointment.business_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-medium">
                    {dayjs(appointment.appointment_date).format("MMM DD, YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Time</p>
                  <p className="font-medium">
                    {dayjs(appointment.start_at).format("h:mm A")} - {dayjs(appointment.end_at).format("h:mm A")}
                  </p>
                </div>
              </div>

              {appointment.client_name && (
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Client</p>
                    <p className="font-medium">{appointment.client_name}</p>
                  </div>
                </div>
              )}
            </div>

            {appointment.appointment_services && appointment.appointment_services.length > 0 && (
              <>
                <div className="border-t my-3" />
                <div>
                  <p className="text-muted-foreground text-xs mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {appointment.appointment_services.map((service) => (
                      <Badge
                        key={service.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {service.service_name}
                        {service.service_duration && (
                          <span className="text-muted-foreground ml-1">
                            ({service.service_duration} min)
                          </span>
                        )}
                        {service.staff_name && (
                          <span className="text-muted-foreground ml-1">
                            - {service.staff_name}
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}


          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-2">
            <Label htmlFor="rating" className="text-base font-medium">
              Rating <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={cn(
                    "transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
                    displayRating >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300"
                  )}
                  disabled={isSubmitting}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star className="w-8 h-8" fill="currentColor" />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} {rating === 1 ? 'star' : 'stars'}
                </span>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {comment.length} / 1000 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="w-full cursor-pointer"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

