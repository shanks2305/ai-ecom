import ChatComposer from '../components/chat/ChatComposer'
import ChatEmptyState from '../components/chat/ChatEmptyState'
import ChatHeader from '../components/chat/ChatHeader'
import ChatMessageList from '../components/chat/ChatMessageList'
import { useChatPage } from '../hooks/useChatPage'
import './ChatPage.css'

type ChatPageProps = {
  onBack: () => void
}

function ChatPage({ onBack }: ChatPageProps) {
  const {
    messages,
    input,
    isLoading,
    isHydrating,
    error,
    messagesEndRef,
    showEmptyState,
    setInput,
    handleSend,
    handleKeyDown,
    handleNewChat,
  } = useChatPage()

  return (
    <div className="chat-page">
      <div className="chat-shell">
        <ChatHeader onBack={onBack} onNewChat={handleNewChat} />

        <main className="chat-body">
          {(isHydrating || showEmptyState) ? (
            <div className="chat-messages">
              <ChatEmptyState
                isHydrating={isHydrating}
                isLoading={isLoading}
                onSelectPrompt={setInput}
              />
            </div>
          ) : (
            <ChatMessageList
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />
          )}
        </main>

        <ChatComposer
          input={input}
          error={error}
          isLoading={isLoading}
          onInputChange={setInput}
          onKeyDown={handleKeyDown}
          onSend={() => void handleSend()}
        />
      </div>
    </div>
  )
}

export default ChatPage
