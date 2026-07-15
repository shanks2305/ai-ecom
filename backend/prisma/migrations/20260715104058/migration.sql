-- CreateEnum
CREATE TYPE "VerificationPurpose" AS ENUM ('BOOTSTRAP', 'LOGIN', 'REGISTER');

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "codeHash" VARCHAR(255) NOT NULL,
    "purpose" "VerificationPurpose" NOT NULL DEFAULT 'LOGIN',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verifications_email_key" ON "verifications"("email");

-- CreateIndex
CREATE INDEX "verifications_email_idx" ON "verifications"("email");

-- CreateIndex
CREATE INDEX "verifications_expiresAt_idx" ON "verifications"("expiresAt");
