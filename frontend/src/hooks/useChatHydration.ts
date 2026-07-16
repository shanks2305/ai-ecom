import { useEffect, useState } from 'react'
import { CONVERSATION_STORAGE_KEY, fetchConversationMessages, type ChatMessage } from '../lib/chat'

export function useChatHydration() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isHydrating, setIsHydrating] = useState(true)

  useEffect(() => {
    const storedConversationId = sessionStorage.getItem(CONVERSATION_STORAGE_KEY)

    if (!storedConversationId) {
      setIsHydrating(false)
      return
    }

    fetchConversationMessages(storedConversationId)
      .then((loadedMessages) => {
        setConversationId(storedConversationId)
        setMessages(loadedMessages)
      })
      .catch(() => {
        sessionStorage.removeItem(CONVERSATION_STORAGE_KEY)
      })
      .finally(() => {
        setIsHydrating(false)
      })
  }, [])

  return { messages, setMessages, conversationId, setConversationId, isHydrating }
}
