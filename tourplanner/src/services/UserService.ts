import { api, ApiError } from "@/api/ApiClient";
import type {
  ApiResponse,
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserProfile,
  UserRegisterRequest,
  UserRegisterResponse
} from "@/types/api";

export const UserService = {
  register: async (userData: UserRegisterRequest): Promise<UserRegisterResponse> => {
    try {
      return await api.post('/api/register', userData);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Registration failed. Please check your information and try again.');
    }
  },

  // ─── NEW: Get current user profile ────────────────────────────────────
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    try {
      return await api.get<ApiResponse<UserProfile>>('/api/users/me');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to load profile. Please try again later.');
    }
  },

  // ─── NEW: Update profile (username & email) ──────────────────────────
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> => {
    try {
      return await api.put<ApiResponse<UserProfile>>('/api/users/me', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update profile. Please try again.');
    }
  },

  // ─── NEW: Change password ──────────────────────────────────────────────
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    try {
      return await api.put<ApiResponse<void>>('/api/users/me/password', data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to change password. Please try again.');
    }
  },
};

export default UserService;
