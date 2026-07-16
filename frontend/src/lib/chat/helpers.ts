import type { ApiError, ApiMessage, ChatMessage } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export function toChatMessage(message: ApiMessage): ChatMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content ?? '',
    createdAt: message.createdAt,
  }
}

export async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiError
    return data.error || 'Request failed'
  } catch {
    return 'Request failed'
  }
}


export function getApiUrl(): string {
  return API_URL
}

export function createOptimisticUserMessage(content: string): ChatMessage {
  return {
    id: `temp-${crypto.randomUUID()}`,
    role: 'USER',
    content,
    createdAt: new Date().toISOString(),
  }
}

export function mergeIncomingMessages(
  current: ChatMessage[],
  incoming: ChatMessage[],
  pendingMessageId?: string,
): ChatMessage[] {
  const base = pendingMessageId
    ? current.filter((message) => message.id !== pendingMessageId)
    : current
  const existingIds = new Set(base.map((message) => message.id))
  const newMessages = incoming.filter((message) => !existingIds.has(message.id))

  return [...base, ...newMessages]
}
