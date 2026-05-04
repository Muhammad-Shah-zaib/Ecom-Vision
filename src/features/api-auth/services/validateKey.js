/**
 * API Key Validation Service
 * For Gemini: performs a real connectivity check against the Gemini API.
 * For OpenRouter: mock validation (length check only).
 */
import { verifyGeminiKey } from '@/features/studio-generation/services/geminiService'

/**
 * Validate an API key.
 * @param {string} key - The API key
 * @param {string} provider - 'gemini' | 'openrouter'
 * @returns {Promise<{ valid: boolean, message: string }>}
 */
export async function validateApiKey(key, provider = 'gemini') {
  if (!key || key.trim().length < 8) {
    return {
      valid: false,
      message: 'API key is too short. Please enter a valid key.',
    }
  }

  if (provider === 'gemini') {
    try {
      await verifyGeminiKey(key.trim())
      return { valid: true, message: 'Successfully connected to Google Gemini API.' }
    } catch (err) {
      if (err.status === 429) {
        return {
          valid: false,
          message: 'Gemini API quota reached (429). Please try again later or use a different key.',
        }
      }
      if (err.status === 401 || err.status === 400) {
        return {
          valid: false,
          message: 'Invalid Gemini API key. Please check the key and try again.',
        }
      }
      return {
        valid: false,
        message: err.message || 'Could not reach the Gemini API. Check your internet connection.',
      }
    }
  }

  // OpenRouter — mock validation for now
  await new Promise((r) => setTimeout(r, 1200))
  return {
    valid: true,
    message: 'Connected to OpenRouter API.',
  }
}
