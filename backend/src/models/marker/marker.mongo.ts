import mongoose from "npm:mongoose@^6.7";

export interface IMarker {
  userId: mongoose.Types.ObjectId;
  location: {
    latitude: number;
    longitude: number;
  };
  obstacleType: string;
  obstacleScore: number;
  description?: string;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const markerSchema = new mongoose.Schema<IMarker>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  obstacleType: { type: String, required: true },
  obstacleScore: { type: Number, default: 1 },
  description: { type: String },
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create a 2dsphere index on the location field
markerSchema.index({ location: "2dsphere" });

export default mongoose.model<IMarker>("Marker", markerSchema);
