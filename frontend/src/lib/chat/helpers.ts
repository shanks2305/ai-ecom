import type { ApiError, ApiMessage, ChatMessage } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? ''
const CHAT_MODEL = import.meta.env.VITE_CHAT_MODEL?.trim() || 'llama3'

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

export function getChatModel(): string {
  return CHAT_MODEL
}

export function getApiUrl(): string {
  return API_URL
}
