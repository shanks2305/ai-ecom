import { AsyncLocalStorage } from "node:async_hooks";
import { User } from "../generated/prisma/client.js";
import type { Response } from "express"

type ConversationContext = {
    token: string;
    user: User | null;
    isAuthenticated: boolean;
    conversationId: string | undefined;
    res: Response | null
};

const conversationContext = new AsyncLocalStorage<ConversationContext>();

export const getConversationContext = () => {
    const context = conversationContext.getStore();
    if (!context) {
        throw new Error("Conversation context not found");
    }
    return context;
};

export const runWithConversationContext = <T>(
    context: ConversationContext,
    fn: () => T
): T => {
    return conversationContext.run(context, fn);
};
