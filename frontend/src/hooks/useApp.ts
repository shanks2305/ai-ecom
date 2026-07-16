import { useEffect, useState } from 'react'
import { checkHealth } from '../lib/api'
import { getStorefrontUrl } from '../lib/config'

export type BackendStatus = 'checking' | 'online' | 'offline'
export type AppView = 'home' | 'chat'

export function useApp() {
  const [view, setView] = useState<AppView>('home')
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking')
  const [showStorefrontModal, setShowStorefrontModal] = useState(false)

  useEffect(() => {
    checkHealth()
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'))
  }, [])

  const handleStartShopping = () => {
    const storefrontUrl = getStorefrontUrl()

    if (storefrontUrl) {
      window.location.href = storefrontUrl
      return
    }

    setShowStorefrontModal(true)
  }

  return {
    view,
    backendStatus,
    showStorefrontModal,
    handleStartShopping,
    openChat: () => setView('chat'),
    goHome: () => setView('home'),
    closeStorefrontModal: () => setShowStorefrontModal(false),
  }
}
