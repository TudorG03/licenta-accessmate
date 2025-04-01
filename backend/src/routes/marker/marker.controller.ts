import { Context, RouterContext } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import mongoose from "npm:mongoose@^6.7";
import Marker, { IMarker } from "../../models/marker/marker.mongo.ts";
import { UserRole } from "../../models/auth/auth.mongo.ts";

// Request interfaces for type safety
interface Location {
  latitude: number;
  longitude: number;
}

interface CreateMarkerRequest {
  location: Location;
  obstacleType: string;
  obstacleScore?: number;
  description?: string;
  images?: string[];
}

interface UpdateMarkerRequest {
  location?: Location;
  obstacleType?: string;
  obstacleScore?: number;
  description?: string;
  images?: string[];
}

// Helper function to check if user has admin/moderator role
const isAdminOrModerator = (role: string) => {
  return role === UserRole.ADMIN || role === UserRole.MODERATOR;
};

// Get all markers
export const getMarkers = async (ctx: Context) => {
  try {
    const markers = await Marker.find().exec();

    ctx.response.status = 200;
    ctx.response.body = {
      message: "Markers retrieved successfully",
      markers: markers.map((marker) => ({
        ...marker.toObject(),
        id: marker._id,
      })),
    };
  } catch (error) {
    console.error("Get markers error:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Create new marker
export const createMarker = async (ctx: Context) => {
  try {
    const data = await ctx.request.body.json() as CreateMarkerRequest;

    // Validate required fields
    if (
      !data.location?.latitude || !data.location?.longitude ||
      !data.obstacleType
    ) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Missing required fields" };
      return;
    }

    // Get user ID from authenticated user
    const userId = ctx.state.user.userId;

    const marker = new Marker({
      userId: new mongoose.Types.ObjectId(userId),
      location: {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
      },
      obstacleType: data.obstacleType,
      obstacleScore: data.obstacleScore || 1,
      description: data.description,
      images: data.images || [],
    });

    await marker.save();

    ctx.response.status = 201;
    ctx.response.body = {
      message: "Marker created successfully",
      marker: marker.toObject(),
    };
  } catch (error) {
    console.error("Create marker error:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Update marker
export const updateMarker = async (ctx: RouterContext<"/markings/:id">) => {
  try {
    const markerId = ctx.params.id;
    const data = await ctx.request.body.json() as UpdateMarkerRequest;
    const userId = ctx.state.user.userId;
    const userRole = ctx.state.user.role;

    // Find marker
    const marker = await Marker.findById(markerId).exec();

    if (!marker) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Marker not found" };
      return;
    }

    // Check permissions
    if (!isAdminOrModerator(userRole) && marker.userId.toString() !== userId) {
      ctx.response.status = 403;
      ctx.response.body = {
        message: "Unauthorized to update this marker",
        requiredRole: "admin/moderator or marker owner",
      };
      return;
    }

    // If location is provided, it must have both latitude and longitude
    if (
      data.location && (!data.location.latitude || !data.location.longitude)
    ) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Location must include both latitude and longitude",
      };
      return;
    }

    // Prepare update object with all optional fields set to null by default
    const update = {
      obstacleScore: null,
      description: null,
      images: null,
      ...data, // Override nulls with any provided values
      userId: marker.userId, // Prevent userId from being changed
    };

    // If obstacleType is provided, it's required and can't be null
    if ("obstacleType" in data && !data.obstacleType) {
      ctx.response.status = 400;
      ctx.response.body = { message: "obstacleType cannot be null" };
      return;
    }

    const updatedMarker = await Marker.findByIdAndUpdate(
      markerId,
      { $set: update },
      { new: true }, // Return the updated document
    ).exec();

    ctx.response.status = 200;
    ctx.response.body = {
      message: "Marker updated successfully",
      marker: updatedMarker?.toObject(),
    };
  } catch (error) {
    console.error("Update marker error:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Delete marker
export const deleteMarker = async (ctx: RouterContext<"/markings/:id">) => {
  try {
    const markerId = ctx.params.id;
    const userId = ctx.state.user.userId;
    const userRole = ctx.state.user.role;

    // Find marker
    const marker = await Marker.findById(markerId).exec();

    if (!marker) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Marker not found" };
      return;
    }

    // Check permissions
    if (!isAdminOrModerator(userRole) && marker.userId.toString() !== userId) {
      ctx.response.status = 403;
      ctx.response.body = {
        message: "Unauthorized to delete this marker",
        requiredRole: "admin/moderator or marker owner",
      };
      return;
    }

    await marker.delete();

    ctx.response.status = 200;
    ctx.response.body = { message: "Marker deleted successfully" };
  } catch (error) {
    console.error("Delete marker error:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
