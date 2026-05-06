/**
 * Store Service
 * Handles communication with the crochet-store-backend [DEPLOYED TO DIGITAL OCEAN].
 */

export async function validateSecretKey(key) {
  const response = await fetch('/api/auth/validate-key', {
    method: 'GET',
    headers: {
      'X-API-KEY': key,
    },
  })
  return response.ok
}

export async function getCategories() {
  const response = await fetch('/api/categories')
  if (!response.ok) throw new Error('Failed to fetch categories')
  const result = await response.json()
  return result.data || result
}

export async function createProduct(productData, secretKey) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': secretKey,
    },
    body: JSON.stringify(productData),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create product')
  }
  return response.json()
}

export async function uploadProductImage(productId, file, secretKey, options = {}) {
  const formData = new FormData()
  formData.append('productId', productId)
  formData.append('image', file)
  if (options.altText) formData.append('altText', options.altText)
  if (options.isPrimary !== undefined) formData.append('isPrimary', String(options.isPrimary))
  if (options.sortOrder !== undefined) formData.append('sortOrder', String(options.sortOrder))

  const response = await fetch('/api/upload/product-image', {
    method: 'POST',
    headers: {
      'X-API-KEY': secretKey,
    },
    body: formData,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to upload image')
  }
  return response.json()
}
