import { VerificationPurpose } from "../../generated/prisma/enums.js";
import notificationService from "../notification/notification.service.js";

const sendOTP = async (email: string, code: string, purpose: VerificationPurpose) =>  notificationService.sendOTP(email, code, purpose)

export default {
  sendOTP
}
