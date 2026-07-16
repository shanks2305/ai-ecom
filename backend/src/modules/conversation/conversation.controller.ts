import type { NextFunction, Request, Response } from "express";
import conversationService from "./conversation.service.js";

const createConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, channel, stage, content, model } = req.body;

        if (!content || !model) {
            res.status(400).json({ error: "content and model are required" });
            return;
        }

        const { conversation, message, assistantMessage } = await conversationService.createConversation(
            userId,
            channel,
            stage,
            content,
            model
        );
        res.status(201).json({ conversation, message, assistantMessage });
    } catch (error) {
        next(error);
    }
};

const getConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const conversation = await conversationService.getConversation(id);

        if (!conversation) {
            res.status(404).json({ error: "Conversation not found" });
            return;
        }

        res.status(200).json(conversation);
    } catch (error) {
        next(error);
    }
};

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const conversation = await conversationService.getConversation(id);

        if (!conversation) {
            res.status(404).json({ error: "Conversation not found" });
            return;
        }

        const messages = await conversationService.getMessages(id);
        res.status(200).json({ messages });
    } catch (error) {
        next(error);
    }
};

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { content, model } = req.body;

        if (!content || !model) {
            res.status(400).json({ error: "content and model are required" });
            return;
        }

        const { userMessage, assistantMessage } = await conversationService.sendMessage(
            id,
            content,
            model
        );

        res.status(201).json({ userMessage, assistantMessage });
    } catch (error) {
        if (error instanceof Error && error.message === "Conversation not found") {
            res.status(404).json({ error: error.message });
            return;
        }

        next(error);
    }
};

export default { createConversation, getConversation, getMessages, sendMessage };
