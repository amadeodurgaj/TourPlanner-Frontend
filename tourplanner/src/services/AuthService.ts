import { api, ApiError } from "@/api/ApiClient";
import { UserLoginRequest, UserLoginResponse} from "@/types/api";

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
