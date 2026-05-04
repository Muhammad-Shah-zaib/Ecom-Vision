/**
 * Download Service
 * Handles individual image download and batch ZIP download.
 */
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/**
 * Download a single image from its URL.
 * @param {string} url - Image URL
 * @param {string} filename - Desired filename
 */
export async function downloadImage(url, filename = 'autoshot-image.png') {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    saveAs(blob, filename)
  } catch (err) {
    console.error('Failed to download image:', err)
    // Fallback: open in new tab
    window.open(url, '_blank')
  }
}

/**
 * Download all images as a ZIP archive.
 * @param {Array} images - Array of image objects { url, name, shotLabel, format }
 * @param {string} batchName - Name for the ZIP file
 * @param {Function} onProgress - Progress callback (0-100)
 */
export async function downloadAllAsZip(
  images,
  batchName = 'autoshot-batch',
  onProgress = () => {},
) {
  const zip = new JSZip()
  const folder = zip.folder(batchName)

  let completed = 0

  for (const img of images) {
    try {
      const response = await fetch(img.url)
      const blob = await response.blob()
      const ext = img.format?.toLowerCase() || 'png'
      const safeName = img.name.replace(/[^a-zA-Z0-9_-]/g, '_')
      folder.file(`${img.shotLabel}_${safeName}.${ext}`, blob)
    } catch (err) {
      console.error(`Failed to fetch ${img.name}:`, err)
    }

    completed++
    onProgress(Math.round((completed / images.length) * 100))
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, `${batchName}.zip`)
}
