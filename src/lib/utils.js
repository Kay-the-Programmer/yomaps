const USD_RATE = 19.50

export const formatPrice = (amount, currency = 'ZMW') => {
  if (currency === 'USD') {
    return `$${(amount / USD_RATE).toFixed(2)}`
  }
  return `K${amount.toLocaleString()}`
}

export const zmwToUsd = (zmw) => +(zmw / USD_RATE).toFixed(2)
export const usdToZmw = (usd) => Math.round(usd * USD_RATE)

export const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

export const cn = (...classes) => classes.filter(Boolean).join(' ')

// Resolve a product image path to a full URL. Uploaded images are stored as
// "/uploads/<file>" (relative to the API origin); absolute URLs pass through.
export const imageUrl = (path) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const origin = apiBase.replace(/\/api\/?$/, '')
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
}

export const truncate = (str, n) =>
  str.length > n ? str.slice(0, n - 1) + '…' : str

export const getCategoryLabel = (slug) => {
  const map = {
    apparel:     'Apparel',
    headwear:    'Headwear',
    accessories: 'Accessories',
    music:       'Music & Collectibles',
    lifestyle:   'Lifestyle',
    exclusive:   'Exclusive Drops'
  }
  return map[slug] || slug
}
