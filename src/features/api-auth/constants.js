// Provider identifiers — used across GatewayView, appStore, and generateImages
export const PROVIDERS = {
  GEMINI: 'gemini',
  OPENROUTER: 'openrouter',
  PROXY: 'proxy',
}

// Labels shown in the UI per provider
export const PROVIDER_LABELS = {
  [PROVIDERS.GEMINI]: 'Google Gemini',
  [PROVIDERS.OPENROUTER]: 'OpenRouter',
  [PROVIDERS.PROXY]: 'Vertex AI Proxy',
}

// Provider badge colors (CSS var names or raw values)
export const PROVIDER_COLORS = {
  [PROVIDERS.GEMINI]: { color: '#4285F4', bg: 'rgba(66, 133, 244, 0.1)', border: 'rgba(66, 133, 244, 0.25)' },
  [PROVIDERS.OPENROUTER]: { color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.25)' },
  [PROVIDERS.PROXY]: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)' },
}

// Default proxy base URL (can be overridden by the user in GatewayView)
export const DEFAULT_PROXY_URL = 'http://localhost:4000'

// Header name the proxy backend expects
export const PROXY_SECRET_HEADER = 'X-Secret-Key'
