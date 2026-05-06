/**
 * API Key Validation Service
 * For Gemini: performs a real connectivity check against the Gemini API.
 * For OpenRouter: validates via their /auth/key endpoint.
 * For Proxy: delegates to proxyService.validateProxyKey.
 */
import { verifyGeminiKey } from '@/features/studio-generation/services/geminiService'
import { validateProxyKey } from './proxyService'
import { PROVIDERS } from '../constants'

/**
 * Validate an API key or secret key.
 * @param {string} key         - The API key or proxy secret key
 * @param {string} provider    - 'gemini' | 'openrouter' | 'proxy'
 * @param {string} [proxyUrl]  - Required when provider === 'proxy'
 * @returns {Promise<{ valid: boolean, message: string }>}
 */
export async function validateApiKey(key, provider = PROVIDERS.GEMINI, proxyUrl = '') {
  if (!key || key.trim().length < 8) {
    return {
      valid: false,
      message: 'Key is too short. Please enter a valid key.',
    }
  }

  if (provider === PROVIDERS.PROXY) {
    if (!proxyUrl) {
      return { valid: false, message: 'Proxy URL is required.' }
    }
    return validateProxyKey(proxyUrl.trim(), key.trim())
  }

  if (provider === PROVIDERS.GEMINI) {
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

  // OpenRouter — real validation via /auth/key endpoint
  try {
    const url = 'https://openrouter.ai/api/v1/auth/key'
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key.trim()}`
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        return { valid: false, message: 'Invalid OpenRouter API key.' }
      }
      return { valid: false, message: `OpenRouter validation failed (HTTP ${response.status})` }
    }
    
    return {
      valid: true,
      message: 'Successfully connected to OpenRouter API.',
    }
  } catch (err) {
    return {
      valid: false,
      message: 'Could not reach the OpenRouter API. Check your internet connection.',
    }
  }
}
