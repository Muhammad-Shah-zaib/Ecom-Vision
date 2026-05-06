import imageCompression from 'browser-image-compression'

// Compression waterfall dimensions (px)
const RESIZE_WATERFALL = [
  { maxWidthOrHeight: 600, targetKB: 500 },
  { maxWidthOrHeight: 600, targetKB: 400 },
  { maxWidthOrHeight: 450, targetKB: Infinity },
]



/**
 * Compresses an image file according to the Dhaga Co. waterfall logic.
 * @param {File} rawFile 
 * @returns {Promise<File>}
 */
export async function compressImage(rawFile) {
  let result = rawFile

  for (const { maxWidthOrHeight, targetKB } of RESIZE_WATERFALL) {
    const compressed = await imageCompression(result, {
      maxWidthOrHeight,
      useWebWorker: true,
      fileType: 'image/webp',
    })

    const webpName = rawFile.name.replace(/\.[^/.]+$/, "") + ".webp"
    result = new File([compressed], webpName, { type: 'image/webp' })

    if (result.size / 1024 <= targetKB) break
  }

  return result
}

/**
 * Converts a dataURL to a File object.
 * @param {string} dataUrl 
 * @param {string} fileName 
 * @returns {File}
 */
export function dataURLtoFile(dataUrl, fileName) {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, { type: mime })
}
