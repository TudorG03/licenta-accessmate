export interface UserPreferences {
    activityTypes: string[];
    transportMethod: string;
    budget: string;
    baseLocation: {
        latitude: number;
        longitude: number;
    };
    searchRadius: number;
}

export interface User {
    email: string;
    displayName: string;
    preferences: UserPreferences;
}