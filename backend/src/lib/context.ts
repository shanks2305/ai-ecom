import { AsyncLocalStorage } from "node:async_hooks";
import { User } from "../generated/prisma/client.js";

type ConversationContext = {
    token: string;
    user: User;
    isAuthenticated: boolean;
    conversationId: string;
};

const conversationContext = new AsyncLocalStorage<ConversationContext>();

export const getConversationContext = () => {
    const context = conversationContext.getStore();
    if (!context) {
        throw new Error("Conversation context not found");
    }
    return context;
};

export const setConversationContext = (context: ConversationContext) => {
    conversationContext.run(context, () => {
        return context;
    });
};
