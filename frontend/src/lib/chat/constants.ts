import { getAiName } from '../config'

export const CONVERSATION_STORAGE_KEY = 'ai-ecom-conversation-id'

export const AI_NAME = getAiName()

export const STARTER_PROMPTS = [
  'What products do you recommend?',
  'Help me find a gift',
  'I need help with my order',
]
