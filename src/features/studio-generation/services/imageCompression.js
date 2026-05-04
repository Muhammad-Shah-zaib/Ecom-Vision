/**
 * imageCompression.js — Dhaga Co. Studio
 * Compresses and resizes uploaded product images before sending to Gemini.
 *
 * Target spec (optimal for Gemini Vision):
 *   - Max dimension: 1568px (longest side) — good balance of quality vs token cost
 *   - Max file size: 1 MB (as compressed JPEG)
 *   - Anything already ≤ 1 MB AND ≤ 1568px is passed through unchanged.
 */
import imageCompression from 'browser-image-compression'

/** Maximum dimension in pixels (longest side) */
const MAX_DIMENSION_PX = 1568

/** Maximum size in MB we want to send to the API */
const MAX_SIZE_MB = 1

/**
 * Compress and resize a File/Blob if it exceeds limits.
 * Returns a compressed File and its base64 data URL.
 *
 * @param {File} file - The original uploaded image file
 * @returns {Promise<{ file: File, dataUrl: string, wasCompressed: boolean, originalSize: number, finalSize: number }>}
 */
export async function compressProductImage(file) {
  const originalSize = file.size
  const needsCompression = originalSize > MAX_SIZE_MB * 1024 * 1024

  let processedFile = file

  if (needsCompression) {
    processedFile = await imageCompression(file, {
      maxSizeMB: MAX_SIZE_MB,
      maxWidthOrHeight: MAX_DIMENSION_PX,
      useWebWorker: true,
      fileType: 'image/jpeg',
      // Preserve enough quality for AI analysis
      initialQuality: 0.88,
    })
  } else {
    // Even if size is fine, cap dimensions for token efficiency
    const imageBitmap = await createImageBitmap(file)
    const { width, height } = imageBitmap
    imageBitmap.close()

    if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
      processedFile = await imageCompression(file, {
        maxSizeMB: MAX_SIZE_MB,
        maxWidthOrHeight: MAX_DIMENSION_PX,
        useWebWorker: true,
        fileType: 'image/jpeg',
        initialQuality: 0.9,
      })
    }
  }

  const dataUrl = await fileToDataUrl(processedFile)

  return {
    file: processedFile,
    dataUrl,
    wasCompressed: processedFile !== file,
    originalSize,
    finalSize: processedFile.size,
  }
}

/**
 * Convert a File/Blob to a base64 data URL.
 * @param {File|Blob} file
 * @returns {Promise<string>}
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Extract the raw base64 string (without the data:...;base64, prefix)
 * and the MIME type from a data URL.
 * @param {string} dataUrl
 * @returns {{ base64: string, mimeType: string }}
 */
export function parseDataUrl(dataUrl) {
  const [meta, base64] = dataUrl.split(',')
  const mimeType = meta.match(/:(.*?);/)[1]
  return { base64, mimeType }
}

/**
 * Format bytes into a human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
