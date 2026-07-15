import { env } from "../../config/env.js";
import { VerificationPurpose } from "../../generated/prisma/enums.js";
import { sendEmail } from "./provider/nodemailer.provider.js";
import templates from "./template/otp.template.js";

const purposeLabels: Record<VerificationPurpose, string> = {
    BOOTSTRAP: "account setup",
    LOGIN: "login",
    REGISTER: "registration",
};

const sendOTP = async (
    email: string,
    code: string,
    purpose: VerificationPurpose = VerificationPurpose.LOGIN
) => {
    try {
        const action = purposeLabels[purpose];
        const subject = "Your verification code";
        const text = `Your ${action} code is ${code}. It expires in ${env.otpExpirationMinutes} minutes.`;
        const html = templates.otpTemplate(code);
        await sendEmail({
            to: email,
            subject,
            text,
            html,
        });
        return true
    } catch (error) {
        throw error;
    }
};

// sendWelcome()
const sendWelcome = async (email: string) => {
    try {
        const subject = "Welcome to our platform";
        const text = "Welcome to our platform";
        const html = templates.welcomeTemplate(email);
        await sendEmail({
            to: email,
            subject,
            text,
            html,
        });
        return true
    } catch (error) {
        throw error;
    }
};

// sendOrderConfirmation()

// sendOrderShipped()

export default {
    sendOTP,
    sendWelcome
}