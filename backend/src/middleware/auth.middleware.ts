import { NextFunction, Request, Response } from "express";
import { type User } from "../generated/prisma/client.js";
import { runWithConversationContext } from "../lib/context.js";
import jwtService from "../modules/auth/jwt.service.js";

const getHeader = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token =
            req.cookies?.sid ??
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.slice(7)
                : req.headers.authorization?.split(" ")[1])

        const conversationId = getHeader(
            req.headers["x-conversation-id"] ?? req.headers.conversationid
        );

        let user: User | null = null;
        let isAuthenticated = false;

        if (token) {
            try {
                user = await jwtService.verifyToken(token);
                isAuthenticated = true;
            } catch {
                // invalid or expired token — continue as guest
            }
        }
        runWithConversationContext(
            { token: token ?? "", user, isAuthenticated, conversationId, res },
            () => next()
        )
    } catch (error) {
        next(error);
    }
};

export default authenticateUser;
