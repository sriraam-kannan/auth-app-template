import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { authMiddleware } from "./middlewares/authMiddleware";
import {
  createUser,
  getUserProfile,
  getReports,
} from "./controllers/userController";

const app = new Hono();

app.use(logger());
app.use(cors());

app.use("/api/*", authMiddleware);
app.post("/api/getUserProfile", getUserProfile);
app.post("/api/createUser", createUser);
app.get("api/getReports", getReports);

app.get("/healthcheck", async (c) => {
  c.json({
    message: "Server is running fine!",
  });
});

export default app;
