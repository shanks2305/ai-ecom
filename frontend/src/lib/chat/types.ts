export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM'

export type ChatMessage = {
  id: string
  role: MessageRole
  content: string
  createdAt: string
}

export type ApiMessage = {
  id: string
  role: MessageRole
  content: string | null
  createdAt: string
}

export type ApiError = {
  error: string
}
