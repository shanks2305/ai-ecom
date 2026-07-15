import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { env } from "../../../config/env.js";
import { logger } from "../../../lib/logger.js";

export type SendEmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

let transporter: Transporter | null = null;

const getTransporter = (): Transporter | null => {
  if (!env.smtp.host) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth:
        env.smtp.user && env.smtp.password
          ? {
              user: env.smtp.user,
              pass: env.smtp.password,
            }
          : undefined,
    });
  }

  return transporter;
};

export const sendEmail = async (options: SendEmailOptions) => {
  const transport = getTransporter();

  if (!transport) {
    logger.info(
      { to: options.to, subject: options.subject, text: options.text },
      "Email logged (SMTP not configured)"
    );
    return { messageId: "dev-mode" };
  }

  const info = await transport.sendMail({
    from: env.smtp.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html ?? options.text,
  });

  logger.debug({ messageId: info.messageId, to: options.to }, "Email sent");
  return info;
};
