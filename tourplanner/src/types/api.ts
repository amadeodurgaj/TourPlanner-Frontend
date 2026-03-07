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