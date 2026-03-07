import { api } from "@/api/ApiClient";
import { UserLoginRequest, UserLoginResponse, UserRegisterRequest, UserRegisterResponse } from "@/types/api";

export const UserService = {

    login: async (credentials: UserLoginRequest): Promise<UserLoginResponse> => {
        return api.post('/api/login', credentials);
    },
    
    register: async (userData: UserRegisterRequest): Promise<UserRegisterResponse> => {
        return api.post('/api/register', userData);
    },
};

export default UserService;
