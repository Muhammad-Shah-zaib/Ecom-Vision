/**
 * Image Generation Service — Dhaga Co. Crochet Studio
 * Category-aware prompt system for artisanal handmade product photography.
 * Each category carries per-angle prompts crafted for small-batch crochet items.
 */

// ─────────────────────────────────────────────
// PRODUCT CATEGORIES — Dhaga Co.
// Each category defines: label, icon, and per-angle prompts (top / side / front)
// ─────────────────────────────────────────────
export const PRODUCT_CATEGORIES = {
  jerseys: {
    label: 'Jerseys & Jackets',
    icon: '🧥',
    description: 'Crochet tops, cardigans, and outerwear',
    prompts: {
      topView:
        'Top-down flat-lay of a handmade crochet jersey draped neatly on a warm cream linen surface, surrounded by small crochet accessories like tiny flowers and yarn spools, soft natural window light, bright and airy lifestyle photography, product photography for Dhaga Co.',
      sideView:
        'A dressed mannequin or plaster statue wearing a beautifully crafted crochet jacket displayed against a textured white-washed wall, small crochet wall hangings and macramé in the background, warm soft studio lighting, editorial product photography for Dhaga Co.',
      frontView:
        'Front hero shot of a crochet jersey worn by an elegant white plaster statue on a pedestal, warm cream and sage green background, soft diffused lighting from the front, a few crochet flowers placed around the base for styling, clean e-commerce product photography for Dhaga Co.',
    },
  },
  keychains: {
    label: 'Keychains',
    icon: '🔑',
    description: 'Crochet keychains and bag charms',
    prompts: {
      topView:
        'Top-down flat-lay of an assortment of handmade crochet keychains arranged on a textured blush pink or warm white surface, surrounded by colourful yarn threads, tiny crochet motifs, and a wooden spool, bright natural lighting, e-commerce product photography for Dhaga Co.',
      sideView:
        'Side-angle shot of a cute crochet keychain hanging from the zipper of a handmade crochet tote bag, bright pastel background (sage green or soft peach), shallow depth of field, warm lifestyle photography for Dhaga Co.',
      frontView:
        'Front-facing studio shot of a handmade crochet keychain displayed on a small rustic wooden table, crochet miniatures and yarn bits scattered casually around, softly lit from above, pastel background, clean e-commerce product photography for Dhaga Co.',
    },
  },
  shoes: {
    label: 'Shoes',
    icon: '👟',
    description: 'Crochet footwear and slippers',
    prompts: {
      topView:
        'Top-down view of a pair of handmade crochet shoes placed symmetrically on a natural jute mat, surrounded by crochet flowers and colourful yarn, bright airy lighting, product photography for Dhaga Co.',
      sideView:
        'Side profile of a crochet shoe or slipper worn by a white plaster statue foot/leg prop, displayed against a warm cream textured backdrop, soft natural studio lighting, lifestyle product photography for Dhaga Co.',
      frontView:
        'Front-facing shot of crochet shoes worn by a white mannequin statue, warmly lit cream or sage background, crochet accessories placed beside for context, sharp and polished e-commerce product photography for Dhaga Co.',
    },
  },
  decor: {
    label: 'Décor Pieces',
    icon: '🌸',
    description: 'Flower pots, wall hangings, home décor',
    prompts: {
      topView:
        'Top-down flat-lay of a handmade crochet flower pot with a small blooming flower, placed on a white wooden surface alongside small crochet items like mini coasters, yarn spools, and dried flowers, bright natural daylight, product photography for Dhaga Co.',
      sideView:
        'Side-angle lifestyle shot of a crochet decorative piece (flower pot or wall hanging) displayed on a minimal shelf or table, warm background with soft bokeh, other small crochet décor items nearby, e-commerce product photography for Dhaga Co.',
      frontView:
        'Front-facing display of a crochet décor item on a small round wooden table, pastel wall behind, crochet blooms and woven accents styled around it, clean warm studio lighting, premium artisanal product photography for Dhaga Co.',
    },
  },
  toys: {
    label: 'Toys & Dolls',
    icon: '🧸',
    description: 'Amigurumi bears, dolls, and plushies',
    prompts: {
      topView:
        'Top-down flat-lay of a handmade crochet amigurumi bear or doll, arranged on a soft cream knit blanket with colourful yarn balls and tiny crochet stars around it, bright playful lighting, product photography for Dhaga Co.',
      sideView:
        'Side-angle shot of a cute crochet plush bear or doll sitting on a small wooden stool, soft pastel background, warm lifestyle lighting, small crochet accessories beside it, artisanal product photography for Dhaga Co.',
      frontView:
        'Front-facing hero shot of a handmade crochet toy (bear, bunny, or character doll) sitting upright on a clean surface, warm pastel background, soft even lighting, product photography that conveys handmade warmth and quality for Dhaga Co.',
    },
  },
  bookCovers: {
    label: 'Book Covers',
    icon: '📖',
    description: 'Crochet-wrapped journals and notebooks',
    prompts: {
      topView:
        'Top-down flat-lay of a crochet-covered journal or notebook on a warm linen surface, surrounded by dried flowers, crochet bookmarks, a pencil, and small motifs, bright natural overhead lighting, product photography for Dhaga Co.',
      sideView:
        'Side profile of a handmade crochet book cover displayed open or closed on a rustic wooden surface, soft warm background, warm natural light from the side, other stationery and crochet items styled beside it, artisanal product photography for Dhaga Co.',
      frontView:
        'Front-facing display of a crochet journal cover propped up at a slight angle, warm cream background, small flowers and crochet details visible in the styling, soft front studio lighting, e-commerce product photography for Dhaga Co.',
    },
  },
  gajray: {
    label: 'Gajray',
    icon: '💐',
    description: 'Crochet floral hair garlands',
    prompts: {
      topView:
        'Top-down flat-lay of a handmade crochet gajray (floral hair garland) arranged in a gentle curve on a marble or cream surface, surrounded by fresh-looking petals and small crochet flower motifs, bright clean lighting, product photography for Dhaga Co.',
      sideView:
        'Side-angle shot of a crochet gajray worn in the hair of a model or placed draped around a small statue, bright warm background, natural soft lighting, lifestyle product photography for Dhaga Co.',
      frontView:
        'Front-facing display of a crochet gajray laid flat and centred on a soft floral surface, delicate lighting highlighting the handmade flower details, pastel or white background, e-commerce product photography for Dhaga Co.',
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
    const provider = apiContext.apiProvider || 'gemini'
    console.log(`[generateImages] Using Real API (${provider}) for`, activeShots)
    
    if (provider === 'openrouter') {
      return generateWithOpenRouterApi(activeShots, customPrompts, onProgress, apiContext)
    }
    return generateWithGeminiApi(activeShots, customPrompts, onProgress, apiContext)
  }
  
  console.warn('[generateImages] Falling back to MOCK images. Reason:', 
    !apiContext?.apiKey ? 'Missing API Key' : 
    !apiContext?.uploadedImage ? 'Missing Uploaded Image' : 'Incomplete apiContext'
  )
  return generateMock(activeShots, customPrompts, onProgress)
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
