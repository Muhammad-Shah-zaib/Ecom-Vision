/**
 * Image Generation Service — Dhaga Co. Crochet Studio
 * Category-aware prompt system for artisanal handmade product photography.
 * Each category carries per-angle prompts crafted for small-batch crochet items.
 */
import { PROVIDERS } from '@/features/api-auth/constants'

// ─────────────────────────────────────────────
// PRODUCT CATEGORIES — Dhaga Co.
// Each category defines: label, icon, and per-angle prompts (top / side / front)
// ─────────────────────────────────────────────
export const PRODUCT_CATEGORIES = {
  jerseys: {
    label: 'Jerseys & Jackets',
    icon: 'mdi:tshirt-crew',
    description: 'Crochet tops, cardigans, and outerwear',
    prompts: {
      topView:
        'Flat-lay of a handmade crochet jersey laid on a light wooden floor, soft diffused indoor light with no harsh brightness, a small crochet bunny tucked beside it, a crochet flower motif and a spool of yarn scattered naturally around, shot from directly above, warm and cozy room feel, looks like a real candid home photo.',
      sideView:
        'A handmade crochet jersey hanging on a simple wooden hanger on a wall hook, soft warm ambient indoor lighting with no direct sunlight, a small crochet bunny sitting on a nearby wooden ledge, a tiny crochet flower hanging loosely from the hanger, the wall behind has a natural matte texture, feels like a real lived-in room, photographed from a gentle side angle.',
      frontView:
        'A handmade crochet jersey hanging on a wooden hanger fixed to a hook on a soft matte white indoor wall, warm and even ambient room lighting, no harsh sunlight, a small potted indoor plant on a tiny wooden wall shelf in the upper left, a handmade crochet bunny sitting on a small wooden stool at the lower right, a few crochet flowers resting near the base, the scene feels like a real cozy room and not a studio setup.',
    },
  },
  keychains: {
    label: 'Keychains',
    icon: 'mdi:key',
    description: 'Crochet keychains and bag charms',
    prompts: {
      topView:
        'Top-down flat-lay on a light wooden table indoors, a fabric tote bag lying flat with a handmade crochet keychain attached to its zipper, a few yarn threads and a crochet hook placed casually around it, soft natural daylight from a window above, real home surface, unposed and warm.',
      sideView:
        'A fabric tote bag hanging on a light wooden wall hook indoors, a handmade crochet keychain clipped to the zipper and hanging freely, soft warm indoor light from a nearby window, the wall texture slightly visible in the background, the keychain sharp and in focus, natural and real-looking.',
      frontView:
        'Front-facing close-up of a handmade crochet keychain attached to a fabric bag placed on a wooden table, a warm indoor room softly blurred behind, natural light from the front, the keychain centred and in crisp detail, looks like a real lifestyle photo taken at home.',
    },
  },
  shoes: {
    label: 'Shoes',
    icon: 'mdi:shoe-sneaker',
    description: 'Crochet footwear and slippers',
    prompts: {
      topView:
        'Top-down view of a pair of handmade crochet shoes placed on a light wooden floor indoors, soft warm daylight falling across them from a nearby window, the floor grain visible, a small crochet flower tucked beside one shoe, no person, natural and clean indoor floor shot.',
      sideView:
        'Side profile of a pair of crochet shoes resting on a light wooden indoor floor, a softly blurred white room wall behind them, warm natural window light from the side, no model or mannequin, positioned as if naturally set down, real and clean indoor atmosphere.',
      frontView:
        'Front-facing shot of a pair of handmade crochet shoes on a wooden indoor floor, a warm blurred room interior behind them, bright natural light from the front, no person or mannequin, the shoes slightly angled for depth, the crochet texture sharp and clear, feels like a real home setting.',
    },
  },
  decor: {
    label: 'Décor Pieces',
    icon: 'mdi:flower',
    description: 'Flower pots, wall hangings, home décor',
    prompts: {
      topView:
        'Top-down shot of a handmade crochet décor piece on a light wooden shelf in a real indoor room, a small dried flower and another tiny crochet item beside it, soft warm light from a room lamp or window, the shelf and wall texture faintly visible, cozy home atmosphere.',
      sideView:
        'A handmade crochet décor piece displayed in its actual indoor home setting, side angle, resting on a wooden shelf or side table with a softly blurred living room behind it, warm natural light from a window, feels like a real home interior, not a studio.',
      frontView:
        'Front-facing shot of a handmade crochet décor item placed on a wooden shelf against a soft white indoor wall, warm ambient room light, a small plant or dried stem beside it for natural styling, looks like a real home shelf, bright and inviting.',
    },
  },
  toys: {
    label: 'Toys & Dolls',
    icon: 'mdi:teddy-bear',
    description: 'Amigurumi bears, dolls, and plushies',
    prompts: {
      topView:
        'Top-down shot of a handmade crochet amigurumi toy sitting on a light oak wooden table indoors, a crochet hook and a small ball of yarn placed beside it, soft daylight coming from a nearby window, warm and cozy home setting, the table grain visible, unposed and natural.',
      sideView:
        'A crochet plush toy sitting on a small wooden table in a bright indoor room, soft white wall in the background slightly out of focus, a crochet hook and a folded piece of fabric beside it, warm natural window light from the side, the toy the clear focus, homey and genuine atmosphere.',
      frontView:
        'Front-facing shot of a handmade crochet stuffed toy placed on a light wooden table in a cozy indoor setting, a softly blurred warm room in the background, a crochet hook resting beside it, gentle natural light from the front, the toy sharp and centred, feels genuinely handmade and real.',
    },
  },
  bookCovers: {
    label: 'Book Covers',
    icon: 'mdi:book-open-page-variant',
    description: 'Crochet-wrapped journals and notebooks',
    prompts: {
      topView:
        'Top-down flat-lay of a crochet-covered journal closed on a wooden desk indoors, a pen, a dried flower, and a small crochet bookmark beside it, warm natural daylight from a window, the desk surface texture visible, cozy and real study or bedroom setting.',
      sideView:
        'Side profile of a crochet-covered journal propped upright on a wooden desk, showing the spine and the handmade texture of the cover, soft warm indoor light from the side, a blurred cozy room behind it, a pen resting beside it, real desk environment.',
      frontView:
        'Front-facing shot of a crochet-covered notebook propped slightly on a wooden desk in a warm indoor room, soft natural light from a side window, a pen and dried flower beside it, the room softly blurred behind, the crochet cover in clear sharp focus, warm and real.',
    },
  },
  gajray: {
    label: 'Gajray',
    icon: 'mdi:flower-poppy',
    description: 'Crochet floral garlands — hair & wrist',
    prompts: {
      topView:
        'Top-down flat-lay of a handmade crochet floral garland arranged in a gentle arc on a light wooden surface indoors, a few loose dried petals and small crochet flowers placed around it, soft warm daylight from a nearby window, natural and delicate indoor setting.',
      sideView:
        'A handmade crochet floral garland draped over a small wooden jewellery stand or decorative hook on a dressing table indoors, warm soft light from a nearby lamp or window, a mirror or soft blurred room behind it, the crochet flowers in clear detail, feminine and real vanity setting.',
      frontView:
        'Front-facing shot of a handmade crochet floral garland laid flat and centred on a light wooden dressing table, warm indoor room light, a softly blurred feminine room interior behind it, the individual crochet flower details sharp and clear, natural and graceful.',
    },
  },
}

// ─────────────────────────────────────────────
// SHOT TYPE METADATA (labels & descriptions — category-agnostic)
// ─────────────────────────────────────────────
export const SHOT_ANGLES = {
  topView: {
    label: 'Top View',
    description: "Bird's-eye perspective — great for flat-lays and layouts",
  },
  sideView: {
    label: 'Side View',
    description: 'Side angle — highlights depth, texture, and silhouette',
  },
  frontView: {
    label: 'Front View',
    description: 'Hero shot — direct front angle, ideal for listing thumbnails',
  },
}

// ─────────────────────────────────────────────
// DEFAULT CATEGORY
// ─────────────────────────────────────────────
export const DEFAULT_CATEGORY = 'jerseys'

/**
 * Get the prompts for a given category.
 * Falls back to jerseys if category is unknown.
 * @param {string} categoryKey
 * @returns {{ topView: string, sideView: string, frontView: string }}
 */
export function getPromptsForCategory(categoryKey) {
  return (PRODUCT_CATEGORIES[categoryKey] || PRODUCT_CATEGORIES[DEFAULT_CATEGORY]).prompts
}

/**
 * Returns all shot type definitions enriched with the active category prompts.
 * @param {string} categoryKey
 * @returns {Array<{ key, label, description, prompt }>}
 */
export function getAllShotTypes(categoryKey = DEFAULT_CATEGORY) {
  const prompts = getPromptsForCategory(categoryKey)
  return Object.entries(SHOT_ANGLES).map(([key, meta]) => ({
    key,
    label: meta.label,
    description: meta.description,
    prompt: prompts[key] || '',
  }))
}

// ─────────────────────────────────────────────
// MOCK IMAGE DATA (picsum seeds per angle — used when no API key/image)
// ─────────────────────────────────────────────
const MOCK_IMAGES = {
  topView: [
    { url: 'https://picsum.photos/seed/dhaga-top1/600/600', name: 'Top-View A' },
    { url: 'https://picsum.photos/seed/dhaga-top2/600/600', name: 'Top-View B' },
  ],
  sideView: [
    { url: 'https://picsum.photos/seed/dhaga-side1/600/600', name: 'Side-View A' },
    { url: 'https://picsum.photos/seed/dhaga-side2/600/600', name: 'Side-View B' },
  ],
  frontView: [
    { url: 'https://picsum.photos/seed/dhaga-front1/600/600', name: 'Front-View A' },
    { url: 'https://picsum.photos/seed/dhaga-front2/600/600', name: 'Front-View B' },
  ],
}

/**
 * Generate product images for active shot types.
 *
 * When apiKey + uploadedImage are provided → calls the real Gemini API.
 * Otherwise → falls back to picsum placeholder images (dev / no-key mode).
 *
 * @param {string[]} activeShots    - Shot keys to generate (e.g. ['topView', 'sideView'])
 * @param {Object}  customPrompts   - Per-shot prompt overrides
 * @param {Function} onProgress     - Progress callback (0–100)
 * @param {Object}  apiContext      - Optional { apiKey, uploadedImage: { base64, mimeType } }
 * @returns {Promise<Array>}        - Generated image objects
 */
export async function generateImages(
  activeShots,
  customPrompts = {},
  onProgress = () => {},
  apiContext = null,
) {
  const useRealApi =
    apiContext?.apiKey &&
    apiContext?.uploadedImage?.base64 &&
    apiContext?.uploadedImage?.mimeType

  if (useRealApi) {
    const provider = apiContext.apiProvider || PROVIDERS.GEMINI
    console.log(`[generateImages] Using Real API (${provider}) for`, activeShots)

    if (provider === PROVIDERS.OPENROUTER) {
      const rawResults = await generateWithOpenRouterApi(activeShots, customPrompts, onProgress, apiContext)
      return postProcessImages(rawResults)
    }
    if (provider === PROVIDERS.PROXY) {
      const rawResults = await generateWithProxyApi(activeShots, customPrompts, onProgress, apiContext)
      return postProcessImages(rawResults)
    }
    const rawResults = await generateWithGeminiApi(activeShots, customPrompts, onProgress, apiContext)
    return postProcessImages(rawResults)
  }

  console.warn('[generateImages] Falling back to MOCK images. Reason:',
    !apiContext?.apiKey ? 'Missing API Key' :
    !apiContext?.uploadedImage ? 'Missing Uploaded Image' : 'Incomplete apiContext'
  )
  const mockResults = await generateMock(activeShots, customPrompts, onProgress)
  return postProcessImages(mockResults)
}

/**
 * Post-processes generated images: resizes to 600px and converts to WebP.
 * This ensures "high resolution" images are never stored on the frontend.
 */
async function postProcessImages(images) {
  const { compressImage, dataURLtoFile } = await import('@/features/gallery-export/services/imageCompression')
  
  const processed = await Promise.all(images.map(async (img) => {
    // If it's a proxy result or gemini result, it's a dataUrl
    // If it's a mock result, it might be a picsum URL (handle both)
    let file
    if (img.url.startsWith('data:')) {
      file = dataURLtoFile(img.url, `${img.shotType}.png`)
    } else {
      // For mock URLs, we fetch them first
      const res = await fetch(img.url)
      const blob = await res.blob()
      file = new File([blob], `${img.shotType}.png`, { type: blob.type })
    }

    const compressedFile = await compressImage(file)
    
    // Convert compressed file back to dataURL
    const reader = new FileReader()
    const compressedUrl = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(compressedFile)
    })

    return {
      ...img,
      url: compressedUrl,
      resolution: '600 × 600 (Optimized)',
      format: 'WebP',
      size: `${(compressedFile.size / 1024).toFixed(1)} KB`
    }
  }))

  return processed
}


// ─────────────────────────────────────────────
// REAL GEMINI GENERATION
// ─────────────────────────────────────────────
async function generateWithGeminiApi(activeShots, customPrompts, onProgress, apiContext) {
  const { generateWithGemini } = await import('./geminiService.js')
  const results = []
  const total = activeShots.length

  for (let i = 0; i < total; i++) {
    const shotKey = activeShots[i]
    const angleMeta = SHOT_ANGLES[shotKey]
    const prompt = customPrompts[shotKey] || ''

    // Report progress at the start of each shot
    onProgress(Math.round((i / total) * 90))

    const generatedDataUrl = await generateWithGemini({
      apiKey: apiContext.apiKey,
      base64Image: apiContext.uploadedImage.base64,
      mimeType: apiContext.uploadedImage.mimeType,
      prompt,
    })

    results.push({
      id: `${shotKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      shotType: shotKey,
      shotLabel: angleMeta.label,
      name: `${angleMeta.label} — AI Generated`,
      prompt,
      url: generatedDataUrl,
      size: 'AI Generated',
      resolution: 'Gemini Output',
      format: 'PNG',
      createdAt: new Date().toISOString(),
    })

    onProgress(Math.round(((i + 1) / total) * 95))
  }

  onProgress(100)
  return results
}

// ─────────────────────────────────────────────
// REAL OPENROUTER GENERATION
// ─────────────────────────────────────────────
async function generateWithOpenRouterApi(activeShots, customPrompts, onProgress, apiContext) {
  const { generateWithOpenRouter } = await import('./openRouterService.js')
  const results = []
  const total = activeShots.length

  for (let i = 0; i < total; i++) {
    const shotKey = activeShots[i]
    const angleMeta = SHOT_ANGLES[shotKey]
    const prompt = customPrompts[shotKey] || ''

    onProgress(Math.round((i / total) * 90))

    const generatedDataUrl = await generateWithOpenRouter({
      apiKey: apiContext.apiKey,
      base64Image: apiContext.uploadedImage.base64,
      mimeType: apiContext.uploadedImage.mimeType,
      prompt,
    })

    results.push({
      id: `${shotKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      shotType: shotKey,
      shotLabel: angleMeta.label,
      name: `${angleMeta.label} — AI Generated (OpenRouter)`,
      prompt,
      url: generatedDataUrl,
      size: 'AI Generated',
      resolution: 'OpenRouter Output',
      format: 'PNG',
      createdAt: new Date().toISOString(),
    })

    onProgress(Math.round(((i + 1) / total) * 95))
  }

  onProgress(100)
  return results
}

// ─────────────────────────────────────────────
// VERTEX AI PROXY GENERATION
// ─────────────────────────────────────────────
async function generateWithProxyApi(activeShots, customPrompts, onProgress, apiContext) {
  const { generateViaProxy } = await import('@/features/api-auth/services/proxyService.js')
  const results = []
  const total = activeShots.length

  for (let i = 0; i < total; i++) {
    const shotKey = activeShots[i]
    const angleMeta = SHOT_ANGLES[shotKey]
    const prompt = customPrompts[shotKey] || ''

    onProgress(Math.round((i / total) * 90))

    const images = await generateViaProxy({
      proxyUrl: apiContext.proxyUrl,
      secretKey: apiContext.apiKey,
      prompt,
      base64Image: apiContext.uploadedImage.base64,
      mimeType: apiContext.uploadedImage.mimeType,
    })

    const first = images[0]
    if (!first) throw new Error(`Proxy returned no image for shot: ${shotKey}`)

    results.push({
      id: `${shotKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      shotType: shotKey,
      shotLabel: angleMeta.label,
      name: `${angleMeta.label} — Vertex AI (Imagen)`,
      prompt,
      url: first.dataUrl,
      size: 'AI Generated',
      resolution: 'Imagen Output',
      format: 'PNG',
      createdAt: new Date().toISOString(),
    })

    onProgress(Math.round(((i + 1) / total) * 95))
  }

  onProgress(100)
  return results
}

// ─────────────────────────────────────────────
// MOCK / FALLBACK GENERATION
// ─────────────────────────────────────────────
async function generateMock(activeShots, customPrompts, onProgress) {
  const totalSteps = activeShots.length * 10
  let currentStep = 0
  const results = []

  for (const shotKey of activeShots) {
    const angleMeta = SHOT_ANGLES[shotKey]
    const mockImages = MOCK_IMAGES[shotKey] || []
    const usedPrompt = customPrompts[shotKey] || ''

    for (const img of mockImages) {
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 200))
        currentStep++
        onProgress(Math.min(Math.round((currentStep / totalSteps) * 100), 99))
      }

      results.push({
        id: `${shotKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        shotType: shotKey,
        shotLabel: angleMeta.label,
        name: img.name,
        prompt: usedPrompt,
        url: img.url,
        size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
        resolution: '4096 × 4096',
        format: 'PNG',
        createdAt: new Date().toISOString(),
      })
    }
  }

  onProgress(100)
  return results
}
