import { Router } from "express";
import conversationController from "./conversation.controller.js";

const router = Router();

router.post("/chat", conversationController.createConversation);

export default router;
