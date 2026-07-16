import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { CONVERSATION_STORAGE_KEY, startConversation } from '../lib/chat'
import { createOptimisticUserMessage, mergeIncomingMessages } from '../lib/chat/helpers'
import { useChatHydration } from './useChatHydration'

export function useChatPage() {
  const { messages, setMessages, conversationId, setConversationId, isHydrating } =
    useChatHydration()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async () => {
    const content = input.trim()
    if (!content || isLoading) return

    const optimisticMessage = createOptimisticUserMessage(content)
    const pendingMessageId = optimisticMessage.id

    setInput('')
    setError(null)
    setMessages((previous) => [...previous, optimisticMessage])
    setIsLoading(true)

    try {
      const result = await startConversation(content, conversationId ?? undefined)

      if (!conversationId) {
        sessionStorage.setItem(CONVERSATION_STORAGE_KEY, result.conversationId)
        setConversationId(result.conversationId)
      }

      setMessages((previous) =>
        mergeIncomingMessages(previous, result.messages, pendingMessageId),
      )
    } catch (sendError) {
      setMessages((previous) =>
        previous.filter((message) => message.id !== pendingMessageId),
      )
      setError(sendError instanceof Error ? sendError.message : 'Failed to send message')
      setInput(content)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  const handleNewChat = () => {
    sessionStorage.removeItem(CONVERSATION_STORAGE_KEY)
    setConversationId(null)
    setMessages([])
    setError(null)
    setInput('')
  }

  return {
    messages,
    input,
    isLoading,
    isHydrating,
    error,
    messagesEndRef,
    showEmptyState: !isHydrating && messages.length === 0,
    setInput,
    handleSend,
    handleKeyDown,
    handleNewChat,
  }
}
