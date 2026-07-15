import { env } from "../../config/env.js";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import { addMinutes } from "../../util/datetime.js";

interface AuthTokenPayload {
    userId: string;
}

const generateToken = async (userId: string) => {
    try {
        const token = jwt.sign({ userId }, env.jwtSecret, { expiresIn: `${env.jwtExpirationMinutes}m` });
        return token;
    } catch (error) {
        throw error;
    }
};

const verifyToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, env.jwtSecret) as string | AuthTokenPayload;
        if (typeof decoded === "string" || !decoded.userId) {
            throw new Error("Invalid token");
        }
        const currentUser = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });
        if (!currentUser) {
            throw new Error("User not found");
        }
        return currentUser;
    } catch (error) {
        throw error;
    }
};

const updateSession = async (token: string, userId: string) => {
    try {
        const session = await prisma.session.create({
            data: {
                token,
                userId,
                expiresAt: addMinutes(env.jwtExpirationMinutes),
            }
        })
        return session;
    }
    catch (error) {
        throw error;
    }
};

const deleteSession = async (userId: string, token: string) => {
    try {
        await prisma.session.delete({
            where: {
                userId,
                token,  
            },
        })
    } catch (error) {
        throw error;
    }}

export default {
    generateToken,
    verifyToken,
    updateSession,
    deleteSession
}