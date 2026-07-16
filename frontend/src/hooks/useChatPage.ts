import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { CONVERSATION_STORAGE_KEY, sendChatMessage, startConversation } from '../lib/chat'
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

    setInput('')
    setError(null)
    setIsLoading(true)

    try {
      if (!conversationId) {
        const result = await startConversation(content)
        sessionStorage.setItem(CONVERSATION_STORAGE_KEY, result.conversationId)
        setConversationId(result.conversationId)
        setMessages(result.messages)
        return
      }

      const newMessages = await sendChatMessage(conversationId, content)
      setMessages((current) => [...current, ...newMessages])
    } catch (sendError) {
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
