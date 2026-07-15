import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const nodeEnv = process.env.NODE_ENV ?? "development";
const isProduction = nodeEnv === "production";

const smtpHost = process.env.SMTP_HOST ?? "";
const smtpFrom = process.env.SMTP_FROM ?? "noreply@ai-ecom.local";

if (isProduction && !smtpHost) {
  throw new Error("Missing required environment variable: SMTP_HOST");
}

if (isProduction && smtpFrom === "noreply@ai-ecom.local") {
  throw new Error("Missing required environment variable: SMTP_FROM");
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  databaseUrl: requireEnv("DATABASE_URL"),
  initialSuperAdminEmail: requireEnv("INITIAL_SUPER_ADMIN_EMAIL"),
  initialSuperAdminFirstName: requireEnv("INITIAL_SUPER_ADMIN_FIRST_NAME"),
  initialSuperAdminLastName: requireEnv("INITIAL_SUPER_ADMIN_LAST_NAME"),
  smtp: {
    host: smtpHost,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER ?? "",
    password: process.env.SMTP_PASSWORD ?? "",
    from: smtpFrom,
  },
  otpExpirationMinutes: Number(process.env.OTP_EXPIRATION_MINUTES) || 5,
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpirationMinutes: Number(process.env.JWT_EXPIRATION_MINUTES) || 120,
} as const;
