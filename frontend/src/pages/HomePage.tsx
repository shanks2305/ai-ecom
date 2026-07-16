import ThemeSelector from '../components/ThemeSelector'
import { getAiName } from '../lib/config'
import type { BackendStatus } from '../hooks/useApp'

type HomePageProps = {
  backendStatus: BackendStatus
  onStartShopping: () => void
  onOpenChat: () => void
}

function HomePage({ backendStatus, onStartShopping, onOpenChat }: HomePageProps) {
  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-mark">AI</span>
          <span className="brand-name">Ecom</span>
        </div>
        <div className="header-actions">
          <ThemeSelector />
          <span className={`status status--${backendStatus}`}>
            {backendStatus === 'checking' && 'Checking backend...'}
            {backendStatus === 'online' && 'Backend online'}
            {backendStatus === 'offline' && 'Backend offline'}
          </span>
        </div>
      </header>

      <main className="hero">
        <p className="eyebrow">AI-powered commerce</p>
        <h1>Shop smarter with conversational AI</h1>
        <p className="subtitle">
          A modern storefront frontend connected to your Express backend. Start
          building product discovery, chat, and checkout flows from here.
        </p>
        <div className="actions">
          <button
            type="button"
            className="button button--primary"
            onClick={onStartShopping}
          >
            Start shopping
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={onOpenChat}
          >
            Talk to {getAiName()}
          </button>
        </div>
      </main>

      <section className="features">
        <article className="feature-card">
          <h2>Product catalog</h2>
          <p>Browse categories, brands, and inventory from your backend API.</p>
        </article>
        <article className="feature-card">
          <h2>AI conversations</h2>
          <p>Connect shoppers to the conversation service for guided shopping.</p>
        </article>
        <article className="feature-card">
          <h2>Secure auth</h2>
          <p>Wire up OTP login and role-based access when you are ready.</p>
        </article>
      </section>
    </div>
  )
}

export default HomePage
