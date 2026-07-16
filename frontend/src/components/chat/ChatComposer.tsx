import type { KeyboardEvent } from 'react'
import { AI_NAME } from '../../lib/chat'

type ChatComposerProps = {
  input: string
  error: string | null
  isLoading: boolean
  onInputChange: (value: string) => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onSend: () => void
}

function ChatComposer({
  input,
  error,
  isLoading,
  onInputChange,
  onKeyDown,
  onSend,
}: ChatComposerProps) {
  return (
    <footer className="chat-footer">
      {error && <p className="chat-error">{error}</p>}
      <form
        className="chat-composer"
        onSubmit={(event) => {
          event.preventDefault()
          onSend()
        }}
      >
        <textarea
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Message ${AI_NAME}...`}
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M3.105 8.558a1.5 1.5 0 0 1 1.894-1.894l9.447 3.774a1.5 1.5 0 0 1 0 2.79l-9.447 3.774A1.5 1.5 0 0 1 3.105 11.33l2.47-3.316-2.47-3.316Z" />
          </svg>
        </button>
      </form>
      <p className="chat-hint">Press Enter to send, Shift+Enter for a new line</p>
    </footer>
  )
}

export default ChatComposer
