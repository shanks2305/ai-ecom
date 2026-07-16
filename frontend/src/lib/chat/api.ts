import { getApiUrl, parseError, toChatMessage } from './helpers'
import type { ApiMessage, ChatMessage } from './types'

export async function startConversation(content: string, conversationId?: string): Promise<{
  conversationId: string
  messages: ChatMessage[]
}> {
  const response = await fetch(`${getApiUrl()}/api/v1/conversation/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      channel: 'WEB',
      stage: 'BROWSING',
      conversationId,
    }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const data = await response.json()
  const messages = data.messages.map(toChatMessage)

  return {
    conversationId: data.conversation.id as string,
    messages,
  }
}

export async function fetchConversationMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const response = await fetch(
    `${getApiUrl()}/api/v1/conversation/${conversationId}`,
  )

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const data = await response.json()
  return (data.messages as ApiMessage[]).map(toChatMessage)
}
