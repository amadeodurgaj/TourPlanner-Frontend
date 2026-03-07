import { api } from "@/api/ApiClient";
import { UserLoginRequest, UserLoginResponse} from "@/types/api";

export const AuthService = {

    login: async (credentials: UserLoginRequest): Promise<UserLoginResponse> => {
        return api.post('/api/auth/login', credentials);
    },

    getCurrentUser: async () => {
        try {
            return await api.get('/api/auth/me');
        } catch (error) {
            return null;
        }
    },

    logout: async () => {
        return api.post('/api/auth/logout', {});
    }

};

export default AuthService;
