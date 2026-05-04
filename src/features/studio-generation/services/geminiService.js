/**
 * geminiService.js — Dhaga Co. Studio
 * Handles real Gemini API calls for AI-powered product image generation.
 *
 * Model: gemini-2.5-flash-image
 *   - Accepts an input image + text prompt
 *   - Returns a generated image (base64 PNG/JPEG) via responseModalities: ["IMAGE"]
 *
 * Docs: https://ai.google.dev/gemini-api/docs/image-generation
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
// const IMAGE_GEN_MODEL = 'gemini-2.5-flash-image';
const IMAGE_GEN_MODEL = 'gemini-3.1-flash-image-preview';

/**
 * Build the system context prefix that's added to every prompt.
 * Keeps the model focused on professional e-commerce photography.
 */
function buildSystemPrefix() {
  return (
    'You are a professional e-commerce product photographer for Dhaga Co., ' +
    'a small artisanal crochet brand. The user has provided a photo of one of their ' +
    'handmade crochet products. Your task is to generate a stunning, high-quality ' +
    'product photograph exactly as described below, featuring this specific product. ' +
    'Preserve the product\'s colours, texture, and craftsmanship accurately. ' +
    'Output: a single, clean, professional product photo suitable for an e-commerce listing. '
  )
}

/**
 * Call the Gemini image generation API for a single shot angle.
 *
 * @param {object} params
 * @param {string} params.apiKey        - Gemini API key
 * @param {string} params.base64Image   - Base64 encoded product image (no prefix)
 * @param {string} params.mimeType      - MIME type of the image (e.g. 'image/jpeg')
 * @param {string} params.prompt        - The angle-specific prompt
 * @returns {Promise<string>}           - data URL of the generated image
 */
export async function generateWithGemini({ apiKey, base64Image, mimeType, prompt }) {
  const url = `${GEMINI_API_BASE}/models/${IMAGE_GEN_MODEL}:generateContent?key=${apiKey}`

  const body = {
    contents: [
      {
        parts: [
          // 1. The product image from the user
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
          // 2. The generation instruction
          {
            text: buildSystemPrefix() + prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['IMAGE'],
    },
  }

  console.log('[geminiService] Request Body:', {
    ...body,
    contents: body.contents.map(c => ({
      parts: c.parts.map(p => p.inlineData ? { inlineData: { mimeType: p.inlineData.mimeType, data: '(base64 data truncated...)' } } : p)
    }))
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  console.log('[geminiService] Response Status:', response.status)

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const message = err?.error?.message || `HTTP ${response.status}`
    console.error('[geminiService] Generation Error:', message, err)
    throw new GeminiError(message, response.status, err)
  }

  const data = await response.json()

  // Extract the image from the response
  const candidates = data?.candidates || []
  for (const candidate of candidates) {
    for (const part of candidate?.content?.parts || []) {
      if (part.inlineData?.data) {
        const genMime = part.inlineData.mimeType || 'image/png'
        return `data:${genMime};base64,${part.inlineData.data}`
      }
    }
  }

  throw new GeminiError('No image returned in Gemini response', 200, data)
}

/**
 * Custom error class for Gemini API failures.
 */
export class GeminiError extends Error {
  constructor(message, status, raw) {
    super(message)
    this.name = 'GeminiError'
    this.status = status
    this.raw = raw
  }
}

/**
 * Quick connectivity/auth check — sends a minimal text request to verify the key.
 * @param {string} apiKey
 * @returns {Promise<boolean>}
 */
export async function verifyGeminiKey(apiKey) {
  const url = `${GEMINI_API_BASE}/models/${IMAGE_GEN_MODEL}?key=${apiKey}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new GeminiError(err?.error?.message || `HTTP ${response.status}`, response.status, err)
  }

  return true
}
