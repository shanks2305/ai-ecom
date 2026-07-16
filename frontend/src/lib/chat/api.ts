import { getApiUrl, getChatModel, parseError, toChatMessage } from './helpers'
import type { ApiMessage, ChatMessage } from './types'

export async function startConversation(content: string): Promise<{
  conversationId: string
  messages: ChatMessage[]
}> {
  const response = await fetch(`${getApiUrl()}/api/v1/conversation/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      model: getChatModel(),
      channel: 'WEB',
      stage: 'BROWSING',
    }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const data = await response.json()
  const messages = [
    toChatMessage(data.message as ApiMessage),
    toChatMessage(data.assistantMessage as ApiMessage),
  ]

  return {
    conversationId: data.conversation.id as string,
    messages,
  }
}

export async function sendChatMessage(
  conversationId: string,
  content: string,
): Promise<ChatMessage[]> {
  const response = await fetch(
    `${getApiUrl()}/api/v1/conversation/${conversationId}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        model: getChatModel(),
      }),
    },
  )

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const data = await response.json()

  return [
    toChatMessage(data.userMessage as ApiMessage),
    toChatMessage(data.assistantMessage as ApiMessage),
  ]
}

export async function fetchConversationMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const response = await fetch(
    `${getApiUrl()}/api/v1/conversation/${conversationId}/messages`,
  )

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const data = await response.json()
  return (data.messages as ApiMessage[]).map(toChatMessage)
}
