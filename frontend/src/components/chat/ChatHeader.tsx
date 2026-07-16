import ThemeSelector from '../ThemeSelector'
import { AI_NAME } from '../../lib/chat'

type ChatHeaderProps = {
  onBack: () => void
  onNewChat: () => void
}

function ChatHeader({ onBack, onNewChat }: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <div className="chat-header__main">
        <button
          type="button"
          className="chat-icon-btn"
          onClick={onBack}
          aria-label="Go back"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="chat-avatar chat-avatar--assistant" aria-hidden="true">
          {AI_NAME.charAt(0).toUpperCase()}
        </div>
        <div className="chat-header__info">
          <h1>{AI_NAME}</h1>
          <p>Your shopping assistant</p>
        </div>
      </div>
      <div className="chat-header__actions">
        <button type="button" className="chat-action-btn" onClick={onNewChat}>
          New chat
        </button>
        <ThemeSelector />
      </div>
    </header>
  )
}

export default ChatHeader
