<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  icon: {
    type: String,
    default: 'mdi:layers-outline'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref(null)

const selectedOption = computed(() => {
  return props.options.find(opt => opt.id === props.modelValue || opt.value === props.modelValue)
})

const displayValue = computed(() => {
  return selectedOption.value ? (selectedOption.value.name || selectedOption.value.label) : props.placeholder
})

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function selectOption(option) {
  const value = option.id !== undefined ? option.id : option.value
  emit('update:modelValue', value)
  isOpen.value = false
}

function handleClickOutside(event) {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="base-select" :class="{ 'is-open': isOpen, 'is-disabled': disabled }" ref="selectRef">
    <label v-if="label" class="select-label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>
    
    <div class="select-container" @click="toggleDropdown">
      <Icon :icon="icon" class="field-icon" />
      
      <div class="selected-value" :class="{ 'is-placeholder': !selectedOption }">
        {{ displayValue }}
      </div>
      
      <Icon icon="mdi:chevron-down" class="chevron-icon" />
    </div>

    <Transition name="fade-slide">
      <div v-if="isOpen" class="options-dropdown custom-scrollbar">
        <div 
          v-for="option in options" 
          :key="option.id || option.value"
          class="option-item"
          :class="{ 'is-active': (option.id === modelValue || option.value === modelValue) }"
          @click="selectOption(option)"
        >
          <span class="option-label">{{ option.name || option.label }}</span>
          <Icon v-if="option.id === modelValue || option.value === modelValue" icon="mdi:check" class="check-icon" />
        </div>
        <div v-if="options.length === 0" class="no-options">
          No options available
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.base-select {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.select-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.required {
  color: var(--color-error);
}

.select-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  padding-left: 42px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.select-container:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--color-border-hover);
}

.is-open .select-container {
  border-color: var(--color-electric);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 0 4px rgba(var(--color-electric-rgb), 0.1);
}

.field-icon {
  position: absolute;
  left: 14px;
  color: var(--color-text-muted);
  pointer-events: none;
  font-size: 18px;
}

.selected-value {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.is-placeholder {
  color: var(--color-text-muted);
}

.chevron-icon {
  color: var(--color-text-muted);
  font-size: 20px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.is-open .chevron-icon {
  transform: rotate(180deg);
  color: var(--color-electric);
}

.options-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: var(--shadow-2xl);
  padding: 8px;
  backdrop-filter: blur(12px);
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.option-item:last-child {
  margin-bottom: 0;
}

.option-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.option-item.is-active {
  background: rgba(var(--color-electric-rgb), 0.1);
  color: var(--color-electric);
}

.option-label {
  font-size: 14px;
}

.check-icon {
  font-size: 16px;
}

.no-options {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted);
}

.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.is-disabled .select-container {
  pointer-events: none;
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
