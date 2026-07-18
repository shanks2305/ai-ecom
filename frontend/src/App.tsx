import StorefrontConfigModal from './components/StorefrontConfigModal'
import { useApp } from './hooks/useApp'
import ChatPage from './pages/ChatPage'
import HomePage from './pages/HomePage'
import OrderPage from './pages/OrderPage'
import './App.css'

function App() {
  const {
    view,
    orderNumber,
    backendStatus,
    showStorefrontModal,
    handleStartShopping,
    openChat,
    goHome,
    closeStorefrontModal,
  } = useApp()

  if (view === 'chat') {
    return <ChatPage onBack={goHome} />
  }

  if (view === 'order' && orderNumber) {
    return <OrderPage orderNumber={orderNumber} onBackHome={goHome} />
  }

  return (
    <>
      <HomePage
        backendStatus={backendStatus}
        onStartShopping={handleStartShopping}
        onOpenChat={openChat}
      />
      {showStorefrontModal && (
        <StorefrontConfigModal onClose={closeStorefrontModal} />
      )}
    </>
  )
}

export default App
