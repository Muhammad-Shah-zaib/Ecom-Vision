/**
 * Global Application Store
 * Reactive state management using Vue 3 Composition API.
 * Shares pipeline data between the 3 steps: auth → studio → gallery.
 */
import { reactive, readonly } from 'vue'
import {
  DEFAULT_CATEGORY,
  getPromptsForCategory,
} from '@/features/studio-generation/services/generateImages'

// ── Persistence Helpers ───────────────────────
const STORAGE_KEY = 'dhaga-studio-state'

function saveState(data) {
  try {
    const toSave = {
      apiKey: data.apiKey,
      apiProvider: data.apiProvider,
      proxyUrl: data.proxyUrl,
      isAuthenticated: data.isAuthenticated,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch (e) {
    console.error('Failed to save state:', e)
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (e) {
    return {}
  }
}

const savedState = loadState()

const state = reactive({
  // ── Step 1: API Auth ──
  apiKey: savedState.apiKey || '',
  apiProvider: savedState.apiProvider || 'gemini',
  proxyUrl: savedState.proxyUrl || 'http://localhost:4000',
  isAuthenticated: savedState.isAuthenticated || false,

  // ── Step 2: Studio ──
  shotToggles: {
    topView: false,
    sideView: false,
    frontView: true,
  },
  isGenerating: false,
  selectedCategory: DEFAULT_CATEGORY,
  customPrompts: { ...getPromptsForCategory(DEFAULT_CATEGORY) },

  // ── Uploaded product image ──
  uploadedImage: null,

  // ── Step 3: Gallery ──
  generatedImages: [],
  batchId: null,
})

/**
 * Actions
 */
function setApiKey(key) {
  state.apiKey = key
  saveState(state)
}

function setApiProvider(provider) {
  state.apiProvider = provider
  saveState(state)
}

function setProxyUrl(url) {
  state.proxyUrl = url
  saveState(state)
}

function setAuthenticated(value) {
  state.isAuthenticated = value
  saveState(state)
}

function toggleShot(shotKey) {
  if (state.shotToggles[shotKey] !== undefined) {
    state.shotToggles[shotKey] = !state.shotToggles[shotKey]
  }
}

function setShotToggle(shotKey, value) {
  if (state.shotToggles[shotKey] !== undefined) {
    state.shotToggles[shotKey] = value
  }
}

function setGenerating(value) {
  state.isGenerating = value
}

function setGeneratedImages(images) {
  state.generatedImages = images
}

function setBatchId(id) {
  state.batchId = id
}

function getActiveShots() {
  return Object.entries(state.shotToggles)
    .filter(([, active]) => active)
    .map(([key]) => key)
}

function setSelectedCategory(categoryKey) {
  state.selectedCategory = categoryKey
  state.customPrompts = { ...getPromptsForCategory(categoryKey) }
}

function setCustomPrompt(shotKey, value) {
  state.customPrompts[shotKey] = value
}

function setUploadedImage(imageData) {
  state.uploadedImage = imageData
}

function clearUploadedImage() {
  state.uploadedImage = null
}

function resetPipeline() {
  state.shotToggles = {
    topView: false,
    sideView: false,
    frontView: true,
  }
  state.isGenerating = false
  state.generatedImages = []
  state.batchId = null
  state.selectedCategory = DEFAULT_CATEGORY
  state.customPrompts = { ...getPromptsForCategory(DEFAULT_CATEGORY) }
  state.uploadedImage = null
}

export function useAppStore() {
  return {
    state: readonly(state),
    setApiKey,
    setApiProvider,
    setProxyUrl,
    setAuthenticated,
    toggleShot,
    setShotToggle,
    setGenerating,
    setGeneratedImages,
    setBatchId,
    getActiveShots,
    setSelectedCategory,
    setCustomPrompt,
    setUploadedImage,
    clearUploadedImage,
    resetPipeline,
  }
}

