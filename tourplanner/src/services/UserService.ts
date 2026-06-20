import { api, ApiError } from "@/api/ApiClient";
import { UserRegisterRequest, UserRegisterResponse } from "@/types/api";

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
};

export default UserService;
