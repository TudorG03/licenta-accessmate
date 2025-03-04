import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import logger from "https://deno.land/x/oak_logger/mod.ts";
import routerAuth from "./routes/auth/auth.router.ts";

const app = new Application();

// Middleware
app.use(oakCors());
app.use(logger.logger);
app.use(logger.responseTime);

// Routes
const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = "Hello from Deno + MongoDB Atlas!";
});

// Apply routers
app.use(router.routes());
app.use(router.allowedMethods());
// app.use('/auth', routerAuth);

export default app;