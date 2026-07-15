import { env } from "../../../config/env.js"

const otpTemplate = (code: string) => {
    return `
    <p>Your verification code is:</p>
    <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
    <p>This code expires in ${env.otpExpirationMinutes} minutes. If you did not request it, you can ignore this email.</p>
  `
}

const welcomeTemplate = (email: string) => {
    return `
    <p>Welcome to our platform</p>
    <p>Your email is ${email}. Please use this email to login to your account.</p>
  `
}

export default {
    otpTemplate,
    welcomeTemplate
}