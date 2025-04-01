import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import {
  createMarker,
  deleteMarker,
  getMarkers,
  updateMarker,
} from "./marker.controller.ts";

const markerRouter = new Router();

markerRouter
  .get("/", authMiddleware,getMarkers)
  .post("/", authMiddleware, createMarker)
  .put("/:id", authMiddleware, updateMarker)
  .delete("/:id", authMiddleware, deleteMarker);

export default markerRouter;
