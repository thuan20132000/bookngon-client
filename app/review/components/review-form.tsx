"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateReviewPayload } from "@/types/review";
import { reviewApi } from "@/lib/api/review.api";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { AxiosError } from "axios";

interface ReviewFormProps {
  appointmentId: number;
  onSubmitSuccess?: () => void;
}

export function ReviewForm({ appointmentId, onSubmitSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          Share your experience and help others make informed decisions.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              className="min-w-32"
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

