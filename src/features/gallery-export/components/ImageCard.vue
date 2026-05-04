<script setup>
/**
 * ImageCard — Individual generated image card with download action.
 * Shows image preview, metadata, and download button.
 */
import { ref } from 'vue'
import { downloadImage } from '../services/downloadService'

const props = defineProps({
  image: { type: Object, required: true },
})

const isDownloading = ref(false)
const imageLoaded = ref(false)

async function handleDownload() {
  isDownloading.value = true
  try {
    const ext = props.image.format?.toLowerCase() || 'png'
    const safeName = props.image.name.replace(/[^a-zA-Z0-9_-]/g, '_')
    await downloadImage(props.image.url, `${safeName}.${ext}`)
  } finally {
    isDownloading.value = false
  }
}
</script>

<template>
  <div class="image-card" :id="`image-card-${image.id}`">
    <!-- Image Preview -->
    <div class="image-preview">
      <!-- Shimmer Loading State -->
      <div v-if="!imageLoaded" class="image-shimmer shimmer"></div>
      <img
        :src="image.url"
        :alt="image.name"
        class="preview-img"
        :class="{ 'preview-img--loaded': imageLoaded }"
        @load="imageLoaded = true"
        loading="lazy"
      />

      <!-- Overlay on hover -->
      <div class="image-overlay">
        <button
          class="overlay-download-btn"
          @click.stop="handleDownload"
          :disabled="isDownloading"
          :title="`Download ${image.name}`"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="image-meta">
      <div class="meta-header">
        <h4 class="image-name">{{ image.name }}</h4>
        <span class="image-shot-badge">{{ image.shotLabel }}</span>
      </div>
      <div class="meta-details">
        <span class="meta-item">Shot: {{ image.resolution }}</span>
        <span class="meta-sep">•</span>
        <span class="meta-item">{{ image.format }}</span>
      </div>

      <!-- Download Button -->
      <button class="btn-secondary download-btn" @click="handleDownload" :disabled="isDownloading">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>{{ isDownloading ? 'Downloading...' : 'Download' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.image-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.25s ease;
}

.image-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Image Preview */
.image-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--color-elevated);
}

.image-shimmer {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.preview-img--loaded {
  opacity: 1;
}

/* Hover overlay */
.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.overlay-download-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.overlay-download-btn:hover {
  background: var(--color-electric);
  border-color: var(--color-electric);
  transform: scale(1.1);
}

/* Meta */
.image-meta {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meta-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.image-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-shot-badge {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-electric);
  background: rgba(0, 112, 243, 0.1);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  flex-shrink: 0;
}

.meta-details {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.meta-sep {
  opacity: 0.4;
}

.download-btn {
  width: 100%;
  padding: 8px 16px;
  font-size: 13px;
  margin-top: 4px;
}
</style>
