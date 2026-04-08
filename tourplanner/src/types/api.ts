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
    fromLatitude?: number;
    fromLongitude?: number;
    toLocation: string;
    toLatitude?: number;
    toLongitude?: number;
    distance: number;
    estimatedTime: string | null;
    routeInfo: Record<string, any> | null;
    childFriendliness: number;
    popularityScore: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    imagePath?: string;
}

export type TourRequest = Omit<Tour, 'id' | 'childFriendliness' | 'popularityScore' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface TourResponse extends ApiResponse<Tour[]> {}

export interface LocationSearchResult {
    label: string;
    latitude: number;
    longitude: number;
}

export interface TourLog {
  id: string;                          
  dateTime: string;                    
  comment: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  totalDistance: number;               
  totalTime: number;                   
  rating: number;                      
  tourId: string;                      
  createdAt: string;
  updatedAt: string;
}

export type TourLogRequest = Omit<TourLog, 'id' | 'tourId' | 'createdAt' | 'updatedAt'>;
