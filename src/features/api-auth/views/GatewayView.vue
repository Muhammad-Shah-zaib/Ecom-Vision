<script setup>
/**
 * GatewayView — Step 1: API Key Authentication
 * The user pastes their API key, selects a provider, and validates
 * before proceeding to the Studio.
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/core/store/appStore'
import { validateApiKey } from '../services/validateKey'

const router = useRouter()
const store = useAppStore()

const apiKey = ref('')
const provider = ref('gemini')
const isValidating = ref(false)
const validationError = ref('')
const showKey = ref(false)

const canSubmit = computed(() => apiKey.value.trim().length >= 8 && !isValidating.value)

async function handleValidate() {
  if (!canSubmit.value) return

  isValidating.value = true
  validationError.value = ''

  try {
    const result = await validateApiKey(apiKey.value, provider.value)

    if (result.valid) {
      store.setApiKey(apiKey.value)
      store.setApiProvider(provider.value)
      store.setAuthenticated(true)
      
      console.log('[GatewayView] Validation success. Store state:', {
        isAuthenticated: store.state.isAuthenticated,
        apiKeySet: !!store.state.apiKey
      })

      router.push({ name: 'studio' })
    } else {
      validationError.value = result.message
    }
  } catch {
    validationError.value = 'Connection failed. Please try again.'
  } finally {
    isValidating.value = false
  }
}
</script>

<template>
  <div class="gateway-container">
    <!-- Ambient Background Glow -->
    <div class="ambient-glow"></div>

    <!-- Gateway Card -->
    <div class="gateway-card animate-fade-in">
      <!-- Icon -->
      <div class="gateway-icon">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="19" stroke="var(--color-border)" stroke-width="1" />
          <circle
            cx="20"
            cy="20"
            r="12"
            stroke="var(--color-outline)"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <circle cx="20" cy="20" r="4" fill="var(--color-electric)" />
        </svg>
      </div>

      <!-- Header -->
      <div class="gateway-header">
        <h1 class="gateway-title">AutoShot-AI Studio</h1>
        <p class="gateway-subtitle">
          Securely connect your preferred AI engine<br />
          and start generating product shots instantly.
        </p>
      </div>

      <!-- Provider Toggle -->
      <div class="provider-toggle">
        <span class="typo-label">CHOOSE AI ENGINE</span>
        <div class="toggle-group">
          <button
            class="toggle-btn"
            :class="{ 'toggle-btn--active': provider === 'gemini' }"
            @click="provider = 'gemini'"
          >
            Gemini
          </button>
          <button
            class="toggle-btn"
            :class="{ 'toggle-btn--active': provider === 'openrouter' }"
            @click="provider = 'openrouter'"
          >
            OpenRouter
          </button>
        </div>
      </div>

      <!-- API Key Input -->
      <div class="key-input-group">
        <label class="typo-label" for="api-key-input">API KEY</label>
        <div class="input-wrapper">
          <input
            id="api-key-input"
            :type="showKey ? 'text' : 'password'"
            v-model="apiKey"
            placeholder="Paste your API key here..."
            class="input-field"
            @keydown.enter="handleValidate"
          />
          <button
            class="eye-btn"
            @click="showKey = !showKey"
            :title="showKey ? 'Hide key' : 'Show key'"
            type="button"
          >
            <svg
              v-if="!showKey"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
              />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="security-notice">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span>Your key is stored locally and never sent to our servers</span>
      </div>

      <!-- Error Message -->
      <Transition name="slide-fade">
        <div v-if="validationError" class="error-message">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {{ validationError }}
        </div>
      </Transition>

      <!-- Submit Button -->
      <button
        id="validate-key-btn"
        class="btn-primary validate-btn"
        :class="{ 'animate-pulse-glow': isValidating }"
        :disabled="!canSubmit"
        @click="handleValidate"
      >
        <svg
          v-if="isValidating"
          class="spinner"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20" />
        </svg>
        <span v-if="isValidating">Validating...</span>
        <span v-else>Connect &amp; Continue</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.gateway-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  position: relative;
}

.ambient-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 112, 243, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.gateway-card {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 36px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  position: relative;
  z-index: 1;
}

.gateway-icon {
  margin-bottom: 4px;
  opacity: 0.7;
}

.gateway-header {
  text-align: center;
}

.gateway-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.gateway-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.provider-toggle {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggle-group {
  display: flex;
  gap: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-DEFAULT);
  overflow: hidden;
}

.toggle-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn--active {
  background: rgba(0, 112, 243, 0.1);
  color: var(--color-electric);
}

.toggle-btn:hover:not(.toggle-btn--active) {
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.03);
}

.key-input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-wrapper {
  position: relative;
}

.input-wrapper .input-field {
  padding-right: 44px;
}

.eye-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.eye-btn:hover {
  color: var(--color-text-secondary);
}

.security-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-muted);
  width: 100%;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--color-error);
  background: rgba(147, 0, 10, 0.1);
  border: 1px solid rgba(255, 180, 171, 0.15);
  border-radius: var(--radius-DEFAULT);
}

.validate-btn {
  width: 100%;
  padding: 12px 24px;
  font-size: 15px;
  margin-top: 4px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Transition for error message */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
