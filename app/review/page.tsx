"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ReviewForm } from "./components/review-form";
import { reviewApi } from "@/lib/api/review.api";
import { Review } from "@/types/review";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

const ReviewPageContent = () => {
  const query = useSearchParams();
  const router = useRouter();
  const appointmentId = query.get("appointment_id");
  const businessId = query.get("business_id");
  
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchExistingReview = async () => {
      if (!appointmentId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await reviewApi.getReviewByAppointment(Number(appointmentId));
        if (response.success && response.results) {
          setExistingReview(response.results);
        }
      } catch (error: unknown) {
        // If review doesn't exist, that's fine - user can create one
        if (error instanceof AxiosError && error.response?.status !== 404) {
          toast.error("Error fetching review", {
            description: error.response?.data?.message || "Failed to fetch review. Please try again.",
            duration: 5000,
            position: 'top-center',
          });
          console.error("Error fetching review", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingReview();
  }, [appointmentId]);

  const handleSubmitSuccess = () => {
    setReviewSubmitted(true);
  };

  if (!appointmentId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Review Not Found</CardTitle>
              <CardDescription>
                Please provide a valid appointment ID to submit a review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push(`/booking?business_id=${businessId}`)} variant="default">
                Book Another Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="flex items-center justify-center py-12">
              <Spinner className="w-8 h-8" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (reviewSubmitted || existingReview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <CardTitle>Review Submitted</CardTitle>
              </div>
              <CardDescription>
                Thank you for your feedback! Your review has been submitted successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingReview && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Your Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={existingReview.rating >= star ? "text-yellow-400" : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {existingReview.comment && (
                    <div>
                      <span className="font-medium">Your Comment:</span>
                      <p className="text-muted-foreground mt-1">{existingReview.comment}</p>
                    </div>
                  )}
                </div>
              )}
              <Button onClick={() => router.push(`/booking?business_id=${businessId}`)} variant="default">
                Book Next Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-16">
      <div className="container mx-auto max-w-4xl px-4">
        <ReviewForm 
          appointmentId={appointmentId} 
          businessId={businessId || ""}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>
    </div>
  );
};

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="flex items-center justify-center py-12">
              <Spinner className="w-8 h-8" />
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <ReviewPageContent />
    </Suspense>
  );
}

