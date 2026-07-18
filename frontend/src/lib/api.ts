const API_URL = import.meta.env.VITE_API_URL ?? ''

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/health`)

  if (!response.ok) {
    throw new Error('Backend is unavailable')
  }

  return response.json()
}

export type OrderPaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'

export type OrderPaymentMethod = 'PAYMENT_GATEWAY' | 'CASH_ON_DELIVERY'

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export type OrderPayment = {
  id: string
  amount: string | number
  currency: string
  status: OrderPaymentStatus
  method: OrderPaymentMethod
  provider: string | null
  transactionId: string | null
  paidAt: string | null
  createdAt: string
}

export type OrderItem = {
  id: string
  productId: string
  productName: string
  productSku: string
  quantity: number
  unitPrice: string | number
}

export type OrderDetails = {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: string | number
  currency: string
  createdAt: string
  items: OrderItem[]
  payments: OrderPayment[]
}

async function parseJsonError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string }
    return body.error ?? `Request failed with status ${response.status}`
  } catch {
    return `Request failed with status ${response.status}`
  }
}

export async function getOrder(orderNumber: string): Promise<OrderDetails> {
  const response = await fetch(
    `${API_URL}/api/v1/order/${encodeURIComponent(orderNumber)}`,
  )
  if (!response.ok) {
    throw new Error(await parseJsonError(response))
  }
  const body = (await response.json()) as { order: OrderDetails }
  return body.order
}

export async function completeOrderPayment(
  orderNumber: string,
): Promise<OrderDetails> {
  const response = await fetch(
    `${API_URL}/api/v1/order/${encodeURIComponent(orderNumber)}/pay`,
    { method: 'POST' },
  )
  if (!response.ok) {
    throw new Error(await parseJsonError(response))
  }
  const body = (await response.json()) as { order: OrderDetails }
  return body.order
}
