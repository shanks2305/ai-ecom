import type { NextFunction, Request, Response } from "express";
import conversationService from "./conversation.service.js";
import { env } from "../../config/env.js";
import { Conversation, Message } from "../../generated/prisma/client.js";

const serializeConversation = (conversation: Conversation, messages: Message[]) => {
    return {
        conversation: {
            id: conversation.id,
            title: conversation.title,
            summary: conversation.summary,
        },
        messages: messages.map(message => ({
            id: message.id,
            role: message.role,
            content: message.content,
            createdAt: message.createdAt,
        })),
    };
}

const createConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, channel, stage, content, conversationId } = req.body;
        const model = env.ai.model;

        if (!content) {
            res.status(400).json({ error: "content is required" });
            return;
        }
        if(conversationId) {
            const conversation = await conversationService.getConversation(conversationId);
            if (!conversation) {
                res.status(404).json({ error: "Conversation not found" });
                return;
            }
            const { messages } = await conversationService.sendMessage(conversationId, content, model);
            res.status(200).json(serializeConversation(conversation, messages));
            return;
        }

        const { conversation, messages } = await conversationService.createConversation(
            userId,
            channel,
            stage,
            content,
            model
        );
        res.status(201).json(serializeConversation(conversation, messages));
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
        const checkIfContextIsExpired = await conversationService.checkIfContextIsExpired(conversation);
        if(checkIfContextIsExpired) {
            res.status(404).json({ error: "Conversation context is expired" });
            return;
        }
        const messages = await conversationService.getMessages(id);
        res.status(200).json({ conversation, messages });
    } catch (error) {
        next(error);
    }
};

export default { createConversation, getConversation };
