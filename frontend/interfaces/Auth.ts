export interface BaseLocation {
    latitude: number;
    longitude: number;
}

export interface UserPreferences {
    activityTypes: string[];
    transportMethod: string;
    budget: string;
    baseLocation: BaseLocation;
    searchRadius: number;
}

export interface User {
    id: string;
    email: string;
    displayName: string;
    preferences: UserPreferences;
}

export interface AuthResponse {
    message: string;
    accessToken: string;
    user: User;
} 