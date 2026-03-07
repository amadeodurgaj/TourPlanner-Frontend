import { api } from "@/api/ApiClient";
import { UserRegisterRequest, UserRegisterResponse } from "@/types/api";

export const UserService = {

    register: async (userData: UserRegisterRequest): Promise<UserRegisterResponse> => {
        return api.post('/api/register', userData);
    },
};

export default UserService;
