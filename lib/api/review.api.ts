import { api } from "./base";
import { Review, CreateReviewPayload, UpdateReviewPayload } from "@/types/review";

export const reviewApi = {
  createReview: async (payload: CreateReviewPayload) => {
    const response = await api.post<Review>('/business-reviews/', payload);
    return response.data;
  },

  updateReview: async (id: number, payload: UpdateReviewPayload) => {
    const response = await api.patch<Review>(`/business-reviews/${id}/`, payload);
    return response.data;
  },

  getReview: async (id: number) => {
    const response = await api.get<Review>(`/business-reviews/${id}/`);
    return response.data;
  },

  getReviewByAppointment: async (appointmentId: number) => {
    const response = await api.get<Review>(`/business-reviews/appointment/${appointmentId}/`);
    return response.data;
  },
};

