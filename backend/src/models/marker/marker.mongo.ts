import mongoose, { Schema, Document } from "mongoose";

export interface IMarker extends Document {
    userId: mongoose.Types.ObjectId;
    location: {
        latitude: number;
        longitude: number;
    };
    obstacleType: string;
    obstacleScore: number;
    images: string[];
}

const markerSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    obstacleType: { type: String, required: true },
    obstacleScore: { type: Number, required: true },
    images: [{ type: String }] // Array of image URLs
});

export default mongoose.model<IMarker>("Marker", markerSchema);
