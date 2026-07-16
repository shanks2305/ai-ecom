import aiService from "../ai/core/ai.service.js";
import { Conversation, Prisma } from "../../generated/prisma/client.js";
import { ConversationChannel, ConversationStage, ConversationStatus, MessageRole } from "../../generated/prisma/enums.js";
import { logger } from "../../lib/logger.js";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";

const generateAssistantReply = async (conversationId: string, model: string) => {
    const history = await getMessages(conversationId);
    const aiMessages = history
        .filter((message) =>
            message.role === MessageRole.USER ||
            message.role === MessageRole.ASSISTANT ||
            message.role === MessageRole.SYSTEM
        )
        .map((message) => ({
            role: message.role.toLowerCase() as "user" | "assistant" | "system",
            content: message.content ?? "",
        }));

    const aiResponse = await aiService({ messages: aiMessages });
    const assistantContent = typeof aiResponse === "string"
        ? aiResponse
        : aiResponse.error ?? "Sorry, I could not generate a response.";

    return createMessage(
        conversationId,
        MessageRole.ASSISTANT,
        assistantContent,
        model
    );
};

const createConversation = async (userId: string | null | undefined, channel: ConversationChannel = ConversationChannel.WEB, stage: ConversationStage = ConversationStage.BROWSING, content: string, model: string ) => {
    try {
        const title = userId
            ? `Conversation with ${userId} on ${channel} on stage ${stage}`
            : `Guest conversation on ${channel} on stage ${stage}`;
        const conversation = await prisma.conversation.create({
            data: {
                userId: userId ?? null,
                channel,
                stage,
                title,
                lastMessageAt: new Date(),
                status: ConversationStatus.ACTIVE,
            },
        });
        if(!conversation) {
            logger.error({ userId, channel, stage }, "Failed to create conversation");
            throw new Error("Failed to create conversation");
        }
        const message = await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: MessageRole.USER,
                content,
                sequence: 1,
                model
            },
        });
        const assistantMessage = await generateAssistantReply(conversation.id, model);
        return { conversation, messages: [message, assistantMessage] };
    } catch (error) {
        logger.error({ error }, "Failed to create conversation");
        throw error;
    }
};

const getConversation = async (id: string) => {
    try {
        const conversation = await prisma.conversation.findUnique({
            where: { id },
        });
        return conversation;
    } catch (error) {
        logger.error({ error }, "Failed to get conversation");
        throw error;
    }
};

const listConversations = async (status: ConversationStatus[]) => {
    try {
        const conversations = await prisma.conversation.findMany({
            where: { status: { in: status } },
        });
        return conversations;
    } catch (error) {
        logger.error({ error }, "Failed to list conversations");
        throw error;
    }
};

const createMessage = async (conversationId: string, role: MessageRole, content: string, model: string) => {
    try {
        const sequence = await prisma.message.count({
            where: { conversationId },
        }) + 1;
        if(!sequence) {
            logger.error({ conversationId }, "Failed to create message");
            throw new Error("Failed to create message");
        }
        const message = await prisma.message.create({
            data: { conversationId, role, content, model, sequence },
        });
        if(!message) {
            logger.error({ conversationId, role, content, model, sequence }, "Failed to create message");
            throw new Error("Failed to create message");
        }
        return message;
    } catch (error) {
        logger.error({ error }, "Failed to create message");
        throw error;
    }
}

const getMessages = async (conversationId: string) => {
    try {
        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { sequence: "asc" },
        });
        return messages;
    } catch (error) {
        logger.error({ error }, "Failed to get conversation messages");
        throw error;
    }
};

const sendMessage = async (conversationId: string, content: string, model: string) => {
    const conversation = await getConversation(conversationId);

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    await createMessage(conversationId, MessageRole.USER, content, model);
    await generateAssistantReply(conversationId, model);
    
    await updateConversation(conversationId, { lastMessageAt: new Date() });
    const messages = await getMessages(conversationId);

    return { messages };
};

const updateConversation = async (id: string, data: Prisma.ConversationUpdateInput) => {
    try {
        const conversation = await prisma.conversation.update({
            where: { id },
            data,
        });
        return conversation;
    } catch (error) {
        logger.error({ error }, "Failed to update conversation");
        throw error;
    }
};

const updateMessage = async (id: string, data: Prisma.MessageUpdateInput) => {
    try {
        const message = await prisma.message.update({
            where: { id },
            data,
        });
        return message;
    } catch (error) {
        logger.error({ error }, "Failed to update message");
        throw error;
    }
};

const checkIfContextIsExpired = async (conversation: Conversation) => {
    try {
        const contextExpirationMinutes = env.conversation.contextExpirationMinutes;
        const lastMessageAt = conversation.lastMessageAt;
        const isExpired = lastMessageAt && lastMessageAt.getTime() + contextExpirationMinutes * 60 * 1000 < Date.now();
        return isExpired;
    } catch (error) {
        logger.error({ error }, "Failed to check if context is expired");
        throw error;
    }
}

export default {
    createConversation,
    getConversation,
    listConversations,
    getMessages,
    createMessage,
    sendMessage,
    updateConversation,
    updateMessage,
    checkIfContextIsExpired,
}