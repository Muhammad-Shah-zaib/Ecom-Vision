<script setup>
/**
 * ImageUploader — Dhaga Co. Studio
 * Accepts a single product image via drag-and-drop or file picker.
 * Compresses images > 1 MB using browser-image-compression.
 * Emits { base64, mimeType, dataUrl, originalName, finalSize, wasCompressed }
 */
import { ref, computed } from 'vue'
import { compressProductImage, parseDataUrl, formatBytes } from '../services/imageCompression'

const emit = defineEmits(['uploaded', 'cleared'])

const isDragging = ref(false)
const isProcessing = ref(false)
const processingStatus = ref('')
const uploadError = ref('')
const previewDataUrl = ref(null)
const imageMeta = ref(null)

/** Accepted MIME types */
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ACCEPTED_EXT = '.jpg,.jpeg,.png,.webp'

const hasImage = computed(() => !!previewDataUrl.value)

// ── Drag events ──────────────────────────────
function onDragEnter(e) {
  e.preventDefault()
  isDragging.value = true
}
function onDragLeave(e) {
  // Only clear if leaving the drop zone entirely
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragging.value = false
  }
}
function onDragOver(e) {
  e.preventDefault()
}
async function onDrop(e) {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) await processFile(file)
}

// ── File picker ──────────────────────────────
function openFilePicker() {
  document.getElementById('product-image-input').click()
}
async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) await processFile(file)
  // Reset input so same file can be re-selected
  e.target.value = ''
}

// ── Core processing ──────────────────────────
async function processFile(file) {
  uploadError.value = ''

  // Validate type
  if (!ACCEPTED.includes(file.type)) {
    uploadError.value = 'Unsupported format. Please upload a JPG, PNG, or WebP image.'
    return
  }

  // Validate: not completely empty
  if (file.size === 0) {
    uploadError.value = 'The selected file appears to be empty.'
    return
  }

  isProcessing.value = true
  processingStatus.value = 'Reading image…'

  try {
    processingStatus.value =
      file.size > 1024 * 1024 ? 'Compressing image for AI…' : 'Preparing image…'

    const result = await compressProductImage(file)

    previewDataUrl.value = result.dataUrl
    imageMeta.value = {
      originalName: file.name,
      originalSize: result.originalSize,
      finalSize: result.finalSize,
      wasCompressed: result.wasCompressed,
    }

    const { base64, mimeType } = parseDataUrl(result.dataUrl)

    emit('uploaded', {
      base64,
      mimeType,
      dataUrl: result.dataUrl,
      originalName: file.name,
      finalSize: result.finalSize,
      wasCompressed: result.wasCompressed,
    })
  } catch (err) {
    console.error('Image processing failed:', err)
    uploadError.value = 'Failed to process the image. Please try a different file.'
  } finally {
    isProcessing.value = false
    processingStatus.value = ''
  }
}

// ── Clear ────────────────────────────────────
function clearImage() {
  previewDataUrl.value = null
  imageMeta.value = null
  uploadError.value = ''
  emit('cleared')
}
</script>

<template>
  <div class="uploader-root">
    <!-- Hidden file input -->
    <input
      id="product-image-input"
      type="file"
      :accept="ACCEPTED_EXT"
      style="display: none"
      @change="onFileChange"
    />

    <!-- ── Preview State ── -->
    <div v-if="hasImage" class="preview-state">
      <div class="preview-image-wrap">
        <img :src="previewDataUrl" alt="Uploaded product" class="preview-img" />

        <!-- Clear button -->
        <button class="clear-btn" @click="clearImage" title="Remove image">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <!-- Compression badge -->
        <div v-if="imageMeta?.wasCompressed" class="compressed-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Compressed
        </div>
      </div>

      <!-- Meta row -->
      <div class="preview-meta" v-if="imageMeta">
        <span class="meta-name">{{ imageMeta.originalName }}</span>
        <span class="meta-sep">·</span>
        <span class="meta-size">{{ formatBytes(imageMeta.finalSize) }}</span>
        <span v-if="imageMeta.wasCompressed" class="meta-saved">
          (from {{ formatBytes(imageMeta.originalSize) }})
        </span>
      </div>

      <!-- Re-upload link -->
      <button class="reupload-link" @click="openFilePicker">
        Change image
      </button>
    </div>

    <!-- ── Processing State ── -->
    <div v-else-if="isProcessing" class="processing-state">
      <div class="spinner-ring"></div>
      <p class="processing-label">{{ processingStatus }}</p>
    </div>

    <!-- ── Drop Zone ── -->
    <div
      v-else
      class="drop-zone"
      :class="{ 'drop-zone--active': isDragging }"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
      @click="openFilePicker"
    >
      <div class="drop-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <p class="drop-title">
        <span v-if="isDragging">Drop your product image here</span>
        <span v-else>Drag &amp; drop your product photo</span>
      </p>
      <p class="drop-subtitle">or click to browse · JPG, PNG, WebP</p>
      <button class="btn-secondary upload-browse-btn" type="button" @click.stop="openFilePicker">
        Browse Files
      </button>
      <p class="drop-limit">Supports up to any size · large images auto-compressed to ~1 MB</p>
    </div>

    <!-- Error -->
    <Transition name="slide-fade">
      <div v-if="uploadError" class="upload-error">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        {{ uploadError }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.uploader-root {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
}

/* ── Drop Zone ── */
.drop-zone {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 24px;
  border: 1.5px dashed var(--color-border);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
  min-height: 280px;
}

.drop-zone:hover {
  border-color: var(--color-electric);
  background: rgba(0, 112, 243, 0.03);
}

.drop-zone--active {
  border-color: var(--color-electric);
  background: rgba(0, 112, 243, 0.06);
  box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
}

.drop-icon {
  color: var(--color-outline);
  transition: color 0.2s ease;
}

.drop-zone:hover .drop-icon,
.drop-zone--active .drop-icon {
  color: var(--color-electric);
}

.drop-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.drop-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: -4px;
}

.upload-browse-btn {
  padding: 8px 20px;
  font-size: 13px;
  margin-top: 4px;
}

.drop-limit {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: -4px;
  opacity: 0.7;
}

/* ── Processing State ── */
.processing-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 280px;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 2.5px solid var(--color-border);
  border-top-color: var(--color-electric);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.processing-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* ── Preview State ── */
.preview-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.preview-image-wrap {
  position: relative;
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-elevated);
}

.preview-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  display: block;
  background: var(--color-elevated);
}

.clear-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(147, 0, 10, 0.6);
  border-color: rgba(255, 180, 171, 0.3);
}

.compressed-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #22c55e;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: var(--radius-full);
}

.preview-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
  flex-wrap: wrap;
  justify-content: center;
}

.meta-name {
  color: var(--color-text-secondary);
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta-sep {
  opacity: 0.4;
}

.meta-saved {
  color: #22c55e;
}

.reupload-link {
  background: none;
  border: none;
  font-size: 12px;
  color: var(--color-electric);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-family: var(--font-sans);
  transition: opacity 0.2s ease;
}

.reupload-link:hover {
  opacity: 0.7;
}

/* ── Error ── */
.upload-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--color-error);
  background: rgba(147, 0, 10, 0.08);
  border: 1px solid rgba(255, 180, 171, 0.12);
  border-radius: var(--radius-DEFAULT);
}

.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
