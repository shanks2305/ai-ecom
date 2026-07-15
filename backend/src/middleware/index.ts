import compression from "compression";
import cors from "cors";
import type { Express } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { logger } from "../lib/logger.js";
import { errorHandler, notFoundHandler } from "./errorHandler.js";

const isProduction = process.env.NODE_ENV === "production";

const morganStream = {
  write: (message: string) => logger.info({ type: "http" }, message.trim()),
};

export function applyMiddleware(app: Express) {
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL ?? "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(compression());
  app.use(morgan(isProduction ? "combined" : "dev", { stream: morganStream }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
}

export function applyErrorHandlers(app: Express) {
  app.use(notFoundHandler);
  app.use(errorHandler);
}
