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

const state = reactive({
  // ── Step 1: API Auth ──
  apiKey: '',
  apiProvider: 'gemini', // 'gemini' | 'openrouter'
  isAuthenticated: false,

  // ── Step 2: Studio ──
  shotToggles: {
    topView: true,
    sideView: true,
    frontView: false,
  },
  isGenerating: false,
  selectedCategory: DEFAULT_CATEGORY,
  customPrompts: { ...getPromptsForCategory(DEFAULT_CATEGORY) },

  // ── Uploaded product image ──
  uploadedImage: null, // { base64, mimeType, dataUrl, originalName, finalSize, wasCompressed }

  // ── Step 3: Gallery ──
  generatedImages: [],
  batchId: null,
})

/**
 * Actions
 */
function setApiKey(key) {
  state.apiKey = key
}

function setApiProvider(provider) {
  state.apiProvider = provider
}

function setAuthenticated(value) {
  state.isAuthenticated = value
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
  // Reset prompts to the category defaults
  state.customPrompts = { ...getPromptsForCategory(categoryKey) }
}

function setCustomPrompt(shotKey, value) {
  state.customPrompts[shotKey] = value
}

function setUploadedImage(imageData) {
  // imageData: { base64, mimeType, dataUrl, originalName, finalSize, wasCompressed }
  state.uploadedImage = imageData
}

function clearUploadedImage() {
  state.uploadedImage = null
}

function resetPipeline() {
  state.shotToggles = {
    topView: true,
    sideView: true,
    frontView: false,
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
