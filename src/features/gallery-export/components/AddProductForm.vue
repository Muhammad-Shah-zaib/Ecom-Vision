<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import BaseSelect from '@/core/components/BaseSelect.vue'
import { getCategories, createProduct, uploadProductImage } from '../services/storeService'
import { compressImage, dataURLtoFile } from '../services/imageCompression'

const props = defineProps({
  generatedImages: {
    type: Array,
    required: true
  },
  secretKey: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const categories = ref([])
const isLoadingCategories = ref(true)
const isSubmitting = ref(false)
const error = ref('')

const form = ref({
  name: '',
  categoryId: '',
  description: '',
  basePrice: '',
  discountPercentage: '0',
  stockQty: '10',
  isAvailable: true,
  isCustomizable: true
})

const selectedImageIds = ref(new Set())
const primaryImageId = ref(null)

onMounted(async () => {
  try {
    categories.value = await getCategories()
    if (categories.value.length > 0) {
      form.value.categoryId = categories.value[0].id
    }
  } catch (err) {
    error.value = 'Failed to load categories. Please check your connection.'
  } finally {
    isLoadingCategories.value = false
  }

  // Default select all images
  props.generatedImages.forEach(img => selectedImageIds.value.add(img.id))
  if (props.generatedImages.length > 0) {
    primaryImageId.value = props.generatedImages[0].id
  }
})

function toggleImage(id) {
  if (selectedImageIds.value.has(id)) {
    selectedImageIds.value.delete(id)
    if (primaryImageId.value === id) {
      primaryImageId.value = Array.from(selectedImageIds.value)[0] || null
    }
  } else {
    selectedImageIds.value.add(id)
    if (!primaryImageId.value) primaryImageId.value = id
  }
}

async function handleSubmit() {
  if (isSubmitting.value) return
  error.value = ''

  if (!form.value.name || !form.value.categoryId || !form.value.basePrice) {
    error.value = 'Please fill in all required fields.'
    return
  }

  isSubmitting.value = true

  try {
    // 1. Create Product
    const product = await createProduct({
      ...form.value,
      basePrice: String(form.value.basePrice),
      discountPercentage: String(form.value.discountPercentage),
      stockQty: parseInt(form.value.stockQty, 10)
    }, props.secretKey)

    // 2. Upload Images
    const uploadPromises = props.generatedImages
      .filter(img => selectedImageIds.value.has(img.id))
      .map(async (img, index) => {
        const file = dataURLtoFile(img.url, `${img.shotType}.png`)
        const compressed = await compressImage(file)
        return uploadProductImage(product.id, compressed, props.secretKey, {
          altText: `${form.value.name} - ${img.shotLabel}`,
          isPrimary: img.id === primaryImageId.value,
          sortOrder: index
        })
      })

    await Promise.all(uploadPromises)

    emit('success')
  } catch (err) {
    console.error('Submission failed:', err)
    error.value = err.message || 'Failed to save product. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="product-form-modal animate-slide-up">
      <div class="modal-header">
        <div class="header-icon">
          <Icon icon="mdi:package-variant-plus" width="24" height="24" />
        </div>
        <div class="header-text">
          <h2>Push to Store</h2>
          <p>Configure product details and archive to collection.</p>
        </div>
        <button class="close-btn" @click="emit('close')">
          <Icon icon="mdi:close" width="20" height="20" />
        </button>
      </div>

      <div class="modal-content custom-scrollbar">
        <div v-if="error" class="error-banner">
          <Icon icon="mdi:alert-circle" width="18" height="18" />
          <span>{{ error }}</span>
        </div>

        <div class="form-grid">
          <!-- Basic Info -->
          <div class="form-section span-2">
            <h3 class="section-title">Basic Information</h3>
            <div class="field-group">
              <label>Product Name <span class="required">*</span></label>
              <div class="input-wrapper">
                <Icon icon="mdi:format-title" class="field-icon" />
                <input v-model="form.name" type="text" placeholder="e.g. Handmade Crochet Scarf" />
              </div>
            </div>

            <div class="grid-2">
              <BaseSelect
                  v-model="form.categoryId"
                  :options="categories"
                  label="Category"
                  required
                  icon="mdi:layers-outline"
                  :disabled="isLoadingCategories"
                  :placeholder="isLoadingCategories ? 'Loading categories...' : 'Select a category'"
                />
              <div class="field-group">
                <label>Stock Quantity</label>
                <div class="input-wrapper">
                  <Icon icon="mdi:archive-outline" class="field-icon" />
                  <input v-model="form.stockQty" type="number" min="0" />
                </div>
              </div>
            </div>

            <div class="field-group">
              <label>Description</label>
              <textarea v-model="form.description" rows="4" placeholder="Describe the craftsmanship..."></textarea>
            </div>
          </div>

          <!-- Pricing -->
          <div class="form-section">
            <h3 class="section-title">Value & Visibility</h3>
            <div class="field-group">
              <label>Base Price (Rs) <span class="required">*</span></label>
              <div class="input-wrapper">
                <Icon icon="mdi:currency-usd" class="field-icon" />
                <input v-model="form.basePrice" type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
            <div class="field-group">
              <label>Discount (%)</label>
              <div class="input-wrapper">
                <Icon icon="mdi:percent" class="field-icon" />
                <input v-model="form.discountPercentage" type="number" min="0" max="100" />
              </div>
            </div>

            <div class="toggle-group">
              <div class="toggle-item">
                <div class="toggle-label">
                  <span class="main-label">Available</span>
                  <span class="sub-label">Public in catalog</span>
                </div>
                <input type="checkbox" v-model="form.isAvailable" class="ios-switch" />
              </div>
              <div class="toggle-item">
                <div class="toggle-label">
                  <span class="main-label">Bespoke</span>
                  <span class="sub-label">Customizable</span>
                </div>
                <input type="checkbox" v-model="form.isCustomizable" class="ios-switch" />
              </div>
            </div>
          </div>

          <!-- Image Selection -->
          <div class="form-section span-3">
            <h3 class="section-title">Select Images to Upload</h3>
            <div class="image-selector-grid">
              <div v-for="img in generatedImages" :key="img.id" class="image-select-card" :class="{
                'is-selected': selectedImageIds.has(img.id),
                'is-primary': primaryImageId === img.id
              }" @click="toggleImage(img.id)">
                <img :src="img.url" :alt="img.shotLabel" />
                <div class="image-overlay">
                  <div class="check-icon">
                    <Icon :icon="selectedImageIds.has(img.id) ? 'mdi:check-circle' : 'mdi:circle-outline'" />
                  </div>
                  <span class="shot-badge">{{ img.shotLabel }}</span>
                  <button v-if="selectedImageIds.has(img.id)" class="primary-toggle-btn"
                    :class="{ 'active': primaryImageId === img.id }" @click.stop="primaryImageId = img.id">
                    <Icon :icon="primaryImageId === img.id ? 'mdi:star' : 'mdi:star-outline'" />
                    {{ primaryImageId === img.id ? 'Primary' : 'Set Primary' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-ghost" @click="emit('close')" :disabled="isSubmitting">Cancel</button>
        <button class="btn-primary" @click="handleSubmit" :disabled="isSubmitting">
          <Icon v-if="isSubmitting" icon="mdi:loading" class="animate-spin" />
          <Icon v-else icon="mdi:cloud-upload" />
          <span>{{ isSubmitting ? 'Pushing to Store...' : 'Confirm & Push' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.product-form-modal {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-2xl);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(var(--color-electric-rgb), 0.1);
  color: var(--color-electric);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-text p {
  font-size: 14px;
  color: var(--color-text-muted);
}

.close-btn {
  margin-left: auto;
  padding: 8px;
  border-radius: 50%;
  color: var(--color-text-muted);
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.error-banner {
  background: rgba(var(--color-error-rgb), 0.1);
  border: 1px solid rgba(var(--color-error-rgb), 0.2);
  color: var(--color-error);
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  font-size: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.span-2 {
  grid-column: span 2;
}

.span-3 {
  grid-column: span 3;
}

.section-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  margin-bottom: 16px;
  font-weight: 600;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.required {
  color: var(--color-error);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 14px;
  color: var(--color-text-muted);
  pointer-events: none;
}

input,
select,
textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  padding-left: 42px;
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s;
}

textarea {
  padding-left: 16px;
  resize: none;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--color-electric);
  background: rgba(255, 255, 255, 0.05);
  outline: none;
  box-shadow: 0 0 0 4px rgba(var(--color-electric-rgb), 0.1);
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.toggle-group {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: var(--radius-lg);
  transition: background 0.2s;
}

.toggle-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.toggle-label {
  display: flex;
  flex-direction: column;
}

.main-label {
  font-size: 14px;
  font-weight: 500;
}

.sub-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

/* Custom iOS Style Switch */
.ios-switch {
  appearance: none;
  width: 40px;
  height: 22px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
  padding: 0;
  border: none;
}

.ios-switch:checked {
  background: var(--color-electric);
}

.ios-switch::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.ios-switch:checked::before {
  transform: translateX(18px);
}

/* Image Selector */
.image-selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.image-select-card {
  aspect-ratio: 1;
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.image-select-card.is-selected {
  border-color: var(--color-electric);
}

.image-select-card img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}

.image-select-card:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.image-select-card:hover .image-overlay,
.image-select-card.is-selected .image-overlay {
  opacity: 1;
}

.check-icon {
  align-self: flex-end;
  color: #fff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.is-selected .check-icon {
  color: var(--color-electric);
}

.shot-badge {
  font-size: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  align-self: flex-start;
  backdrop-filter: blur(4px);
}

.primary-toggle-btn {
  margin-top: 8px;
  width: 100%;
  padding: 6px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border-radius: var(--radius-md);
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
}

.primary-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.primary-toggle-btn.active {
  background: var(--color-electric);
  color: #fff;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

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
</style>
