import { api } from "./base";
import { ClientCreate } from "@/types/appointment";

interface GoogleLoginResponse {
  access: string;
  refresh: string;
  client: ClientCreate;
}

interface RefreshTokenResponse {
  access: string;
}

export const authApi = {
  googleLogin: async (googleIdToken: string, businessId: string) => {
    const response = await api.post<GoogleLoginResponse>(
      "/client-auth/google/",
      { google_id_token: googleIdToken, business_id: businessId },
      { skipAuth: true }
    );
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post<RefreshTokenResponse>(
      "/client-auth/token/refresh/",
      { refresh: refreshToken },
      { skipAuth: true }
    );
    return response.data;
  },
};
