import express from "express";
import { applyErrorHandlers, applyMiddleware } from "./middleware/index.js";
import isSuperAdminPreset from "./modules/bootstrap/bootstrap.service.js";
import { logger } from "./lib/logger.js";
import conversationRoute from "./modules/conversation/conversation.route.js";

const app = express();

isSuperAdminPreset().then((superAdmin) => {
  logger.info(`Super admin is preset: ${superAdmin?.email}`);
}).catch((err: Error) => {
  logger.error(`Failed to check if super admin is preset: ${err.message}`);
});

applyMiddleware(app);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/conversation", conversationRoute);

applyErrorHandlers(app);

export default app;
