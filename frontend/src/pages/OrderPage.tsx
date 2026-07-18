import { useCallback, useEffect, useState } from 'react'
import {
  completeOrderPayment,
  getOrder,
  type OrderDetails,
  type OrderPayment,
} from '../lib/api'
import ThemeSelector from '../components/ThemeSelector'
import './OrderPage.css'

type OrderPageProps = {
  orderNumber: string
  onBackHome: () => void
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; order: OrderDetails }

function formatMoney(amount: string | number, currency: string): string {
  const value = typeof amount === 'string' ? Number(amount) : amount
  if (!Number.isFinite(value)) return `${amount} ${currency}`
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${value.toFixed(2)} ${currency}`
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function findActionablePayment(payments: OrderPayment[]): OrderPayment | null {
  return (
    payments.find(
      (p) =>
        p.method === 'PAYMENT_GATEWAY' &&
        (p.status === 'PENDING' || p.status === 'PROCESSING'),
    ) ?? null
  )
}

function OrderPage({ orderNumber, onBackHome }: OrderPageProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [isPaying, setIsPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  const loadOrder = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const order = await getOrder(orderNumber)
      setState({ status: 'ready', order })
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to load order',
      })
    }
  }, [orderNumber])

  useEffect(() => {
    void loadOrder()
  }, [loadOrder])

  const handlePay = async () => {
    setPayError(null)
    setIsPaying(true)
    try {
      const updated = await completeOrderPayment(orderNumber)
      setState({ status: 'ready', order: updated })
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="order-page">
      <div className="order-shell">
        <header className="order-header">
          <button
            type="button"
            className="order-back-btn"
            onClick={onBackHome}
          >
            ← Home
          </button>
          <div className="order-header__title">
            <h1>Order details</h1>
            <p>Order #{orderNumber}</p>
          </div>
          <ThemeSelector />
        </header>

        <main className="order-body">
          {state.status === 'loading' && (
            <div className="order-empty">Loading order details...</div>
          )}

          {state.status === 'error' && (
            <div className="order-empty order-empty--error">
              <p>{state.message}</p>
              <button
                type="button"
                className="order-btn order-btn--secondary"
                onClick={() => void loadOrder()}
              >
                Try again
              </button>
            </div>
          )}

          {state.status === 'ready' && (
            <OrderView
              order={state.order}
              onPay={handlePay}
              isPaying={isPaying}
              payError={payError}
            />
          )}
        </main>
      </div>
    </div>
  )
}

type OrderViewProps = {
  order: OrderDetails
  onPay: () => void
  isPaying: boolean
  payError: string | null
}

function OrderView({ order, onPay, isPaying, payError }: OrderViewProps) {
  const actionable = findActionablePayment(order.payments)
  const completedPayment = order.payments.find(
    (p) => p.status === 'COMPLETED',
  )
  const codPending = order.payments.find(
    (p) =>
      p.method === 'CASH_ON_DELIVERY' &&
      (p.status === 'PENDING' || p.status === 'PROCESSING'),
  )

  return (
    <>
      <section className="order-section order-summary">
        <div className="order-summary__row">
          <span className="order-summary__label">Placed</span>
          <span className="order-summary__value">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <div className="order-summary__row">
          <span className="order-summary__label">Status</span>
          <span
            className={`order-badge order-badge--${order.status.toLowerCase()}`}
          >
            {order.status}
          </span>
        </div>
        <div className="order-summary__row">
          <span className="order-summary__label">Total</span>
          <span className="order-summary__total">
            {formatMoney(order.totalAmount, order.currency)}
          </span>
        </div>
      </section>

      <section className="order-section">
        <h2 className="order-section__title">Items</h2>
        {order.items.length === 0 ? (
          <p className="order-empty">No items in this order.</p>
        ) : (
          <ul className="order-items">
            {order.items.map((item) => (
              <li key={item.id} className="order-item">
                <div className="order-item__main">
                  <p className="order-item__name">{item.productName}</p>
                  <p className="order-item__meta">
                    SKU {item.productSku} · Qty {item.quantity}
                  </p>
                </div>
                <div className="order-item__price">
                  {formatMoney(item.unitPrice, order.currency)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="order-section">
        <h2 className="order-section__title">Payment</h2>
        {order.payments.length === 0 ? (
          <p className="order-empty">No payment recorded yet.</p>
        ) : (
          <ul className="order-payments">
            {order.payments.map((payment) => (
              <li key={payment.id} className="order-payment">
                <div>
                  <p className="order-payment__method">
                    {payment.method === 'PAYMENT_GATEWAY'
                      ? 'Online payment'
                      : 'Cash on delivery'}
                  </p>
                  <p className="order-payment__meta">
                    {formatMoney(payment.amount, payment.currency)}
                    {payment.paidAt ? ` · Paid ${formatDate(payment.paidAt)}` : ''}
                  </p>
                </div>
                <span
                  className={`order-badge order-badge--${payment.status.toLowerCase()}`}
                >
                  {payment.status}
                </span>
              </li>
            ))}
          </ul>
        )}

        {actionable && (
          <div className="order-pay">
            <div>
              <p className="order-pay__title">Complete your payment</p>
              <p className="order-pay__subtitle">
                Pay {formatMoney(actionable.amount, actionable.currency)} online to
                confirm this order.
              </p>
            </div>
            <button
              type="button"
              className="order-btn order-btn--primary"
              onClick={onPay}
              disabled={isPaying}
            >
              {isPaying ? 'Processing…' : 'Pay now'}
            </button>
          </div>
        )}

        {!actionable && codPending && (
          <p className="order-note">
            You have chosen cash on delivery. Please keep the exact amount
            ready when your order arrives.
          </p>
        )}

        {!actionable && !codPending && completedPayment && (
          <p className="order-note order-note--success">
            Payment received. Thank you for your order!
          </p>
        )}

        {payError && <p className="order-error">{payError}</p>}
      </section>
    </>
  )
}

export default OrderPage
