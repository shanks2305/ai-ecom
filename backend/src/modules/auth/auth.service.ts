import { env } from "../../config/env.js";
import { Permission } from "../../constant/permision.js";
import { Role, VerificationPurpose } from "../../generated/prisma/enums.js";
import { requirePermission } from "../../lib/auth.js";
import { getConversationContext } from "../../lib/context.js";
import { logger } from "../../lib/logger.js";
import { prisma } from "../../lib/prisma.js";
import jwtService from "./jwt.service.js";
import otpService from "./otp.service.js";

const register = async (email: string, firstName?: string, lastName?: string,) => {
    try {
        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
            },
        });
        await otpService.generateOTP(email, VerificationPurpose.REGISTER);
        return user;
    }
    catch (error) {
        throw error;
    }
}

const createAdmin = async (email: string, token: string, firstName?: string, lastName?: string) => {
    try {
        requirePermission(Permission.ADMIN_CREATE, "create an admin");
        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                role: Role.ADMIN,
            },
        });
        return user;
    } catch (error) {
        throw error;
    }
}

const login = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })
        if (!user) {
            return {
                nextStep: "register"
            }
        }
        await otpService.generateOTP(email, VerificationPurpose.LOGIN);
        return user;
    } catch (error) {
        throw error;
    }
}

const verifyOTP = async (email: string, code: string, purpose: VerificationPurpose = VerificationPurpose.LOGIN) => {
    try {
        const sent = await otpService.verifyOTP(email, code, purpose);
        if (!sent) {
            throw new Error("Failed to verify OTP. Please try again.");
        }
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })
        if (!user) {
            throw new Error("User not found");
        }
        const token = await jwtService.generateToken(user.id);
        const context = getConversationContext()
        context.token = token;
        context.user = user;
        context.isAuthenticated = true;
        logger.info({ hasRes: !!context.res }, "verifyOTP setting cookie")
        context.res?.cookie("sid", token, {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: "lax",
            path: "/",
            maxAge: env.jwtExpirationMinutes * 60_000,
        })
        await jwtService.updateSession(token, user.id);
        return {
            user
        };
    } catch (error) {
        throw error;
    }
}

const logout = async (userId: string, token: string) => {
    try {
        await jwtService.deleteSession(userId, token);
        const context = getConversationContext()
        context.res?.clearCookie("sid", { path: "/" })
        context.token = "";
        context.user = null;
        context.isAuthenticated = false;
        return true;
    } catch (error) {
        throw error;
    }
}

const checkUserAuth = async () => {
    try {
        const { user, isAuthenticated } = getConversationContext()
        logger.info(`User ${user?.email} is authenticated ${isAuthenticated} ${user?.id ? `(id: ${user.id})` : ""}`)
        if(!isAuthenticated) {
            return {
                message: "You are not authenticated. Please login to continue.",
                user: null,
            }
        } else {
            return {
                message: "You are authenticated. Please continue.",
                user: user,
            }
        } 
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export default {
    register,
    login,
    verifyOTP,
    logout,
    createAdmin,
    checkUserAuth
}