import { AI_NAME } from '../../lib/chat'
import ChatMessageItem from './ChatMessageItem'
import type { ChatMessage } from '../../lib/chat'

type ChatMessageListProps = {
  messages: ChatMessage[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

function ChatMessageList({ messages, isLoading, messagesEndRef }: ChatMessageListProps) {
  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}

      {isLoading && (
        <article className="chat-message chat-message--assistant chat-message--typing">
          <div className="chat-avatar chat-avatar--assistant" aria-hidden="true">
            {AI_NAME.charAt(0).toUpperCase()}
          </div>
          <div className="chat-message__content">
            <span className="chat-message__author">{AI_NAME}</span>
            <div className="chat-message__bubble chat-message__bubble--typing">
              <span className="chat-typing-dots" aria-label="Thinking">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        </article>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessageList
