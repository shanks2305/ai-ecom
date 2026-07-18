import { useEffect, useState } from 'react'
import { checkHealth } from '../lib/api'
import { getStorefrontUrl } from '../lib/config'

export type BackendStatus = 'checking' | 'online' | 'offline'
export type AppView = 'home' | 'chat' | 'order'

const ORDER_QUERY_KEY = 'order'

function readOrderNumberFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const value = params.get(ORDER_QUERY_KEY)?.trim()
  return value ? value : null
}

function clearOrderFromUrl() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (!url.searchParams.has(ORDER_QUERY_KEY)) return
  url.searchParams.delete(ORDER_QUERY_KEY)
  window.history.replaceState({}, '', url.toString())
}

export function useApp() {
  const initialOrder = readOrderNumberFromUrl()
  const [view, setView] = useState<AppView>(initialOrder ? 'order' : 'home')
  const [orderNumber, setOrderNumber] = useState<string | null>(initialOrder)
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

  const goHome = () => {
    clearOrderFromUrl()
    setOrderNumber(null)
    setView('home')
  }

  return {
    view,
    orderNumber,
    backendStatus,
    showStorefrontModal,
    handleStartShopping,
    openChat: () => setView('chat'),
    goHome,
    closeStorefrontModal: () => setShowStorefrontModal(false),
  }
}
