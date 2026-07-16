export const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL?.trim() ?? ''
const AI_NAME = import.meta.env.VITE_AI_NAME?.trim() || 'Nova'

export function getStorefrontUrl(): string | null {
  return STOREFRONT_URL || null
}

export function getAiName(): string {
  return AI_NAME
}
