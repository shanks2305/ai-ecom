import express from "express";
import { applyErrorHandlers, applyMiddleware } from "./middleware/index.js";
import isSuperAdminPreset from "./modules/bootstrap/bootstrap.service.js";
import { logger } from "./lib/logger.js";

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

applyErrorHandlers(app);

export default app;
