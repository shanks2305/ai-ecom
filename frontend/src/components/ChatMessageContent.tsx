import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { MessageRole } from '../lib/chat'

type ChatMessageContentProps = {
  role: MessageRole
  content: string
}

function ChatMessageContent({ role, content }: ChatMessageContentProps) {
  if (role === 'USER') {
    return <p className="chat-bubble__text">{content}</p>
  }

  return (
    <div className="chat-bubble__markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

export default ChatMessageContent
