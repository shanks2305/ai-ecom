-- CreateEnum
CREATE TYPE "ConversationStage" AS ENUM ('BROWSING', 'REGISTERING', 'LOGGING_IN', 'AUTHENTICATED', 'ADMIN');

-- CreateEnum
CREATE TYPE "ConversationChannel" AS ENUM ('WEB', 'TELEGRAM', 'WHATSAPP', 'DISCORD');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('SYSTEM', 'USER', 'ASSISTANT', 'TOOL');

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "stage" "ConversationStage" NOT NULL DEFAULT 'BROWSING',
    "channel" "ConversationChannel" NOT NULL DEFAULT 'WEB',
    "externalThreadId" VARCHAR(255),
    "title" VARCHAR(255),
    "summary" TEXT,
    "metadata" JSONB,
    "lastMessageAt" TIMESTAMP(3),
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT,
    "toolCalls" JSONB,
    "toolCallId" VARCHAR(255),
    "toolName" VARCHAR(100),
    "model" VARCHAR(100),
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "finishReason" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversations_userId_idx" ON "conversations"("userId");

-- CreateIndex
CREATE INDEX "conversations_lastMessageAt_idx" ON "conversations"("lastMessageAt");

-- CreateIndex
CREATE INDEX "conversations_deletedAt_idx" ON "conversations"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_channel_externalThreadId_key" ON "conversations"("channel", "externalThreadId");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "messages_conversationId_sequence_key" ON "messages"("conversationId", "sequence");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
