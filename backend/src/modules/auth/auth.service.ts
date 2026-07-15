import { Permission } from "../../constant/permision.js";
import { Role, VerificationPurpose } from "../../generated/prisma/enums.js";
import { requirePermission } from "../../lib/auth.js";
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

const verifyOTP = async (email: string, code: string, purpose: VerificationPurpose) => {
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
        await jwtService.updateSession(token, user.id);
        return {
            user,
            token
        };
    } catch (error) {
        throw error;
    }
}

const logout = async (userId: string, token: string) => {
    try {
        await jwtService.deleteSession(userId, token);
        return true;
    } catch (error) {
        throw error;
    }
}

export default {
    register,
    login,
    verifyOTP,
    logout,
    createAdmin
}