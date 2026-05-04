<script setup>
/**
 * GalleryView — Step 3: Export Gallery
 * Displays generated images in a responsive grid.
 * Provides individual download buttons and a master "Download All" (ZIP).
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/core/store/appStore'
import { downloadAllAsZip } from '../services/downloadService'
import ImageCard from '../components/ImageCard.vue'

const router = useRouter()
const store = useAppStore()

const isDownloadingAll = ref(false)
const downloadProgress = ref(0)

const images = computed(() => store.state.generatedImages)
const batchId = computed(() => store.state.batchId || '#0000')
const imageCount = computed(() => images.value.length)

const hasImages = computed(() => images.value.length > 0)

async function handleDownloadAll() {
  if (isDownloadingAll.value || !hasImages.value) return

  isDownloadingAll.value = true
  downloadProgress.value = 0

  try {
    await downloadAllAsZip(
      images.value,
      `autoshot-batch-${batchId.value.replace('#', '')}`,
      (p) => {
        downloadProgress.value = p
      },
    )
  } catch (err) {
    console.error('Batch download failed:', err)
  } finally {
    isDownloadingAll.value = false
    downloadProgress.value = 0
  }
}

function handleNewBatch() {
  store.resetPipeline()
  router.push({ name: 'studio' })
}
</script>

<template>
  <div class="gallery-view animate-fade-in">
    <!-- Gallery Header -->
    <div class="gallery-header">
      <div class="header-left">
        <div class="header-title-row">
          <h1 class="gallery-title">Generation Batch {{ batchId }}</h1>
          <span class="image-count-badge">{{ imageCount }} Images</span>
        </div>
        <p class="gallery-subtitle">
          Review your AI-generated product shots below. Hover on any image to instantly compare the
          result with your original raw upload.
        </p>
      </div>
    </div>

    <!-- No Images State -->
    <div v-if="!hasImages" class="empty-state">
      <div class="empty-icon">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-outline-variant)"
          stroke-width="0.8"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <h3 class="empty-title">No images generated yet</h3>
      <p class="empty-desc">
        Head to the Studio to configure your shot types and generate imagery.
      </p>
      <button class="btn-primary" @click="router.push({ name: 'studio' })">Go to Studio</button>
    </div>

    <!-- Image Grid -->
    <div v-else class="gallery-content">
      <!-- Image Grid -->
      <div class="image-grid">
        <ImageCard
          v-for="(image, index) in images"
          :key="image.id"
          :image="image"
          class="animate-fade-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        />
      </div>

      <!-- Bottom Actions Bar -->
      <div class="gallery-actions">
        <div class="actions-info">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-electric)"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span class="actions-text">
            All {{ imageCount }} images successfully generated and saved to your workspace.
          </span>
        </div>
        <div class="actions-buttons">
          <button class="btn-secondary" @click="handleNewBatch">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            <span>New Batch</span>
          </button>
          <button
            id="download-all-btn"
            class="btn-primary"
            :disabled="isDownloadingAll"
            @click="handleDownloadAll"
          >
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
            <span v-if="isDownloadingAll">Downloading... {{ downloadProgress }}%</span>
            <span v-else>Download All (ZIP)</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-view {
  padding-bottom: 40px;
}

.gallery-header {
  margin-bottom: 32px;
}

.header-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.gallery-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.image-count-badge {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-electric);
  background: rgba(0, 112, 243, 0.1);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.gallery-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-top: 8px;
  max-width: 600px;
  line-height: 1.6;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  text-align: center;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.empty-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  max-width: 400px;
}

/* Image Grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: 1fr;
  }
}

/* Bottom Actions */
.gallery-actions {
  margin-top: 32px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.actions-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.actions-text {
  font-size: 13px;
  color: var(--color-text-muted);
}

.actions-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 640px) {
  .gallery-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .actions-buttons {
    flex-direction: column;
  }
  .actions-buttons .btn-primary,
  .actions-buttons .btn-secondary {
    width: 100%;
  }
}
</style>
