import ChatMessageContent from '../ChatMessageContent'
import { AI_NAME, type ChatMessage } from '../../lib/chat'

type ChatMessageItemProps = {
  message: ChatMessage
}

function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === 'USER'
  const author = isUser ? 'You' : AI_NAME
  const avatarLabel = isUser ? 'Y' : AI_NAME.charAt(0).toUpperCase()

  return (
    <article className={`chat-message chat-message--${message.role.toLowerCase()}`}>
      <div
        className={`chat-avatar chat-avatar--${isUser ? 'user' : 'assistant'}`}
        aria-hidden="true"
      >
        {avatarLabel}
      </div>
      <div className="chat-message__content">
        <span className="chat-message__author">{author}</span>
        <div className="chat-message__bubble">
          <ChatMessageContent role={message.role} content={message.content} />
        </div>
      </div>
    </article>
  )
}

export default ChatMessageItem
