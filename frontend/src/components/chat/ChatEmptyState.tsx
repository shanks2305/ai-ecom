import { AI_NAME, STARTER_PROMPTS } from '../../lib/chat'

type ChatEmptyStateProps = {
  isHydrating: boolean
  isLoading: boolean
  onSelectPrompt: (prompt: string) => void
}

function ChatEmptyState({ isHydrating, isLoading, onSelectPrompt }: ChatEmptyStateProps) {
  if (isHydrating) {
    return (
      <div className="chat-empty">
        <div className="chat-empty__icon" aria-hidden="true">
          <span className="chat-typing-dots">
            <span />
            <span />
            <span />
          </span>
        </div>
        <p>Loading conversation...</p>
      </div>
    )
  }

  return (
    <div className="chat-empty">
      <div className="chat-empty__icon chat-avatar chat-avatar--assistant chat-avatar--large">
        {AI_NAME.charAt(0).toUpperCase()}
      </div>
      <h2>How can I help you shop today?</h2>
      <p>Ask about products, orders, or get personalized recommendations.</p>
      <div className="chat-prompts">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="chat-prompt"
            onClick={() => onSelectPrompt(prompt)}
            disabled={isLoading}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChatEmptyState
