import { api, ApiError } from "@/api/ApiClient";
import {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    UserLoginRequest,
    UserLoginResponse
} from "@/types/api";

export const AuthService = {

    login: async (credentials: UserLoginRequest): Promise<UserLoginResponse> => {
        try {
            return await api.post('/api/auth/login', credentials);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Login failed. Please check your username and password and try again.');
        }
    },

    getCurrentUser: async (): Promise<{ success: boolean; message: string; data: { username: string; token: string } } | null> => {
        try {
            return await api.get<{ success: boolean; message: string; data: { username: string; token: string } }>('/api/auth/me');
        } catch {
            return null;
        }
    },

    forgotPassword: async (request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
        try {
            return await api.post('/api/auth/forgot-password', request);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Could not request a password reset. Please try again.');
        }
    },

    resetPassword: async (request: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        try {
            return await api.post('/api/auth/reset-password', request);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Could not reset your password. Please try again.');
        }
    },

    logout: async () => {
        try {
            return await api.post('/api/auth/logout', {});
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Logout failed. Please try again.');
        }
    }

};

export default AuthService;
