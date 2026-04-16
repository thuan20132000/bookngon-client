import { api } from "./base";
import { ClientCreate } from "@/types/appointment";

interface GoogleLoginResponse {
  access: string;
  refresh: string;
  client: ClientCreate;
}

interface FacebookLoginResponse {
  access: string;
  refresh: string;
  client: ClientCreate;
  is_new_client: boolean;
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

  facebookLogin: async (facebookAccessToken: string, businessId: string) => {
    const response = await api.post<FacebookLoginResponse>(
      "/client-auth/facebook/",
      { facebook_access_token: facebookAccessToken, business_id: businessId },
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

  deleteAccount: async (clientId: string, businessId: string) => {
    const response = await api.delete(
      `/client-auth/delete-account/`,
      { data: { client_id: clientId, business_id: businessId } }
    );
    return response.data;
  },
};
