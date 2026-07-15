import express from "express";
import { applyErrorHandlers, applyMiddleware } from "./middleware/index.js";

const app = express();

applyMiddleware(app);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

applyErrorHandlers(app);

export default app;
