import { addMinutes, now } from "../../util/datetime.js"
import { prisma } from "../../lib/prisma.js"
import { VerificationPurpose } from "../../generated/prisma/enums.js"
import { env } from "../../config/env.js"

const getAllActiveVerifications = async () => {
    try {
        const verifications = await prisma.verification.findMany({
            where: {
                expiresAt: {
                    gt: now()
                }
            },
        })
        return verifications
    } catch (error) {
        throw error
    }
}

const getActiveVerificationByEmail = async (email: string, purpose: VerificationPurpose) => {
    try {
        const verification = await prisma.verification.findFirst({
            where: {
                email,
                purpose,
                expiresAt: {
                    gt: now()
                }
            }
        })
        return verification
    }
    catch (error) {
        throw error
    }
}

const createVerification = async (email: string, purpose: VerificationPurpose, codeHash: string) => {
    try {
        const verification = await prisma.verification.upsert({
            where: { email },
            create: {
                email,
                purpose,
                codeHash,
                expiresAt: addMinutes(env.otpExpirationMinutes),
            },
            update: {
                purpose,
                codeHash,
                expiresAt: addMinutes(env.otpExpirationMinutes),
            },
        })
        return verification
    } catch (error) {
        throw error
    }
}

const deleteVerification = async (id: string) => {
    try {
        await prisma.verification.delete({
            where: {
                id
            }
        })
    } catch (error) {
        throw error
    }
}

export default {
    getAllActiveVerifications,
    getActiveVerificationByEmail,
    createVerification,
    deleteVerification
}