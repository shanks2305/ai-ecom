import { Router } from "express";
import conversationController from "./conversation.controller.js";
import authenticateUser from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/chat", authenticateUser, conversationController.createConversation);
router.get("/:id", conversationController.getConversation);

export default router;
