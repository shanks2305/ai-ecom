import { Permission } from "../constant/permision.js";
import { User } from "../generated/prisma/client.js";
import authorizationService from "../modules/auth/authorization.service.js";
import { getConversationContext } from "./context.js";

export const requirePermission = (permission: Permission, action: string): User => {
    const { user, isAuthenticated } = getConversationContext();
    if (!isAuthenticated) {
        throw new Error("You are not authenticated");
    }
    if (!authorizationService.canAccess(user.role, permission)) {
        throw new Error(`You are not authorized to ${action}`);
    }
    return user;
};
