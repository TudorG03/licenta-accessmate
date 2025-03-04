import mongoose, { Schema, Document } from "mongoose";

interface IUserPreferences {
    activityTypes: string[];
    transportMethod: string;
    budget: string;
    baseLocation: {
        latitude: number;
        longitude: number;
    };
    searchRadius: number;
}

export interface IUser extends Document {
    email: string;
    password: string;
    preferences: IUserPreferences;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    preferences: {
        type: Object,
        default: {}
    },
    resetToken: {
        type: String,
        default: null
    },
    resetTokenExpiry: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IUser>("User", userSchema);
