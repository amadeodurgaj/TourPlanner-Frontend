export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginData {
  username: string;
  email: string;
  token: string;
}

export interface RegisterData {
  username: string;
  email: string;
}

export interface UserLoginRequest {
    username: string;
    password: string;
}

export interface UserRegisterRequest {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}


export type UserLoginResponse = ApiResponse<LoginData>;
export type UserRegisterResponse = ApiResponse<RegisterData>;

export interface Tour {
    id: string;
    name: string;
    description: string;
    transportType: string;
    fromLocation: string;
    toLocation: string;
    distance: number;
    estimatedTime: string | null;
    routeInfo: Record<string, any> | null;
    childFriendliness: number;
    popularityScore: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export type TourRequest = Omit<Tour, 'id' | 'childFriendliness' | 'popularityScore' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface TourResponse extends ApiResponse<Tour[]> {}