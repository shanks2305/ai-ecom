import { VerificationPurpose } from "../../generated/prisma/enums.js"
import generateSecureOTP from "../../util/otpGenerator.js"
import crypto from 'crypto'
import verificationService from "./verification.service.js"
import emailService from "./email.service.js"

const generateOTP = async (email: string, purpose: VerificationPurpose) => {
    try {
        const otp = generateSecureOTP()
        const codeHash = crypto.createHash('sha256').update(otp).digest('hex')
        const verification = await verificationService.createVerification(email, purpose, codeHash)
        await emailService.sendOTP(email, otp, purpose)
        return verification.id
    } catch (error) {
        throw error
    }
}

const verifyOTP = async (email: string, code: string, purpose: VerificationPurpose) => {
    try {
        const verification = await verificationService.getActiveVerificationByEmail(email, purpose)
        if(!verification) {
            throw new Error('Invalid code')
        }
        if(verification.codeHash !== crypto.createHash('sha256').update(code).digest('hex')) {
            throw new Error('Invalid code')
        }
        await verificationService.deleteVerification(verification.id)
        return true
    } catch (error) {
        throw error
    }
}

export default {
    generateOTP,
    verifyOTP
}