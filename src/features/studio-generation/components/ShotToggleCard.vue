<script setup>
/**
 * ShotToggleCard — A single shot-type card with toggle control.
 * Displays shot type info, description, and an ON/OFF toggle.
 */
import { computed } from 'vue'

const props = defineProps({
  shotKey: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, default: '' },
  prompt: { type: String, default: '' },
  active: { type: Boolean, default: false },
  icon: { type: String, default: '📷' },
})

const emit = defineEmits(['toggle'])

const statusText = computed(() => (props.active ? 'Active' : 'Inactive'))
</script>

<template>
  <div class="shot-card" :class="{ 'shot-card--active': active }" @click="emit('toggle', shotKey)">
    <!-- Card Header -->
    <div class="shot-card-header">
      <div class="shot-icon">{{ icon }}</div>
      <div class="shot-info">
        <span class="shot-label">{{ label }}</span>
        <span class="shot-desc">{{ description }}</span>
      </div>
      <!-- Toggle Switch -->
      <div class="toggle-switch" :class="{ 'toggle-switch--on': active }">
        <div class="toggle-knob"></div>
      </div>
    </div>

    <!-- Prompt Preview -->
    <div class="shot-prompt" v-if="active && prompt">
      <span class="typo-label">PROMPT</span>
      <p class="prompt-text">{{ prompt }}</p>
    </div>

    <!-- Status Badge -->
    <div class="shot-status">
      <span class="status-dot" :class="{ 'status-dot--active': active }"></span>
      <span class="status-text">{{ statusText }}</span>
    </div>
  </div>
</template>

<style scoped>
.shot-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
}

.shot-card:hover {
  border-color: var(--color-border-hover);
  background: rgba(255, 255, 255, 0.03);
}

.shot-card--active {
  border-color: rgba(0, 112, 243, 0.3);
  background: rgba(0, 112, 243, 0.04);
}

.shot-card--active:hover {
  border-color: rgba(0, 112, 243, 0.5);
}

.shot-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.shot-icon {
  font-size: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.shot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.shot-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.shot-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.4;
}

/* Toggle Switch */
.toggle-switch {
  width: 44px;
  height: 24px;
  background: var(--color-surface-high);
  border-radius: var(--radius-full);
  padding: 2px;
  cursor: pointer;
  transition: background 0.25s ease;
  flex-shrink: 0;
}

.toggle-switch--on {
  background: var(--color-electric);
}

.toggle-knob {
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.toggle-switch--on .toggle-knob {
  transform: translateX(20px);
}

/* Prompt Preview */
.shot-prompt {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prompt-text {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* Status */
.shot-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-muted);
  transition: background 0.2s ease;
}

.status-dot--active {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

.status-text {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
