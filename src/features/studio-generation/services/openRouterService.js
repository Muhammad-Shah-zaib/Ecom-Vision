/**
 * openRouterService.js — Dhaga Co. Studio
 * Handles generation routing when the user selects OpenRouter as the provider.
 * The user requested to use `google/gemini-2.5-flash` via OpenRouter.
 */

class OpenRouterError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'OpenRouterError'
    this.status = status
    this.details = details
  }
}

function buildSystemPrefix() {
  return (
    'You are a professional e-commerce product photographer. ' +
    'Your task is to generate a stunning, high-quality ' +
    'product photograph exactly as described below, featuring the provided product image. ' +
    'CRITICAL INSTRUCTION: You MUST output ONLY a valid Base64 encoded image string (or data URI starting with data:image/png;base64,...). ' +
    'Do not include any markdown, explanation, or conversational text. Just the raw base64 data.'
  )
}

export async function generateWithOpenRouter({ apiKey, base64Image, mimeType, prompt }) {
  const url = 'https://openrouter.ai/api/v1/chat/completions'
  
  const body = {
    model: 'google/gemini-2.5-flash',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: buildSystemPrefix() + '\\n\\nPrompt: ' + prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  }

  console.log('[openRouterService] Request Body sent to OpenRouter.')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin, // Recommended by OpenRouter
      'X-Title': 'AutoShot-AI Studio', // Recommended by OpenRouter
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  console.log('[openRouterService] Response Status:', response.status)

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const message = err?.error?.message || `HTTP ${response.status}`
    console.error('[openRouterService] Generation Error:', message, err)
    throw new OpenRouterError(message, response.status, err)
  }

  const data = await response.json()
  let outputText = data.choices?.[0]?.message?.content || ''

  // OpenRouter models often return markdown blocks. Let's clean it up.
  outputText = outputText.trim()
  if (outputText.startsWith('```')) {
    outputText = outputText.replace(/^```[a-z0-9-]*\n/i, '').replace(/\n```$/i, '')
  }
  
  if (!outputText.startsWith('data:image/')) {
    // If it's just raw base64, prepend the data URI header
    // But check if it actually looks like base64
    if (/^[A-Za-z0-9+/=]+$/.test(outputText.replace(/\s/g, ''))) {
      outputText = `data:image/png;base64,${outputText.replace(/\s/g, '')}`
    } else {
      console.warn('[openRouterService] Received text that does not look like an image:', outputText.substring(0, 100))
      throw new Error('The AI model returned text instead of an image. OpenRouter text models may not support native image generation.')
    }
  }

  return outputText
}
