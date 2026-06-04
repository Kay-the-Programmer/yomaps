// DEMO mode API — no backend. Resolves products from static data and persists
// orders in localStorage, returning axios-shaped { data } responses so the rest
// of the app works unchanged. Toggled by VITE_DEMO=true (see lib/api.js).

import { PRODUCTS } from '../data/products.js'

const wait = (data, ms = 220) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms))

const ORDERS_KEY = 'yomaps-demo-orders'
const loadOrders = () => {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || {} } catch { return {} }
}
const saveOrders = (o) => localStorage.setItem(ORDERS_KEY, JSON.stringify(o))

/* ── Catalogue ─────────────────────────────────────────────── */

const sorters = {
  newest:      (a, b) => new Date(b.created_at) - new Date(a.created_at),
  best_seller: (a, b) => (b.tags.includes('best-seller') ? 1 : 0) - (a.tags.includes('best-seller') ? 1 : 0),
  price_asc:   (a, b) => a.price_zmw - b.price_zmw,
  price_desc:  (a, b) => b.price_zmw - a.price_zmw
}

export const getProducts = (params = {}) => {
  const { category, tag, sort = 'newest', limit = 100, page = 1 } = params
  let list = [...PRODUCTS]
  if (category) list = list.filter((p) => p.category === category)
  if (tag)      list = list.filter((p) => (p.tags || []).includes(tag))
  list.sort(sorters[sort] || sorters.newest)
  const total = list.length
  const start = (Number(page) - 1) * Number(limit)
  return wait({ products: list.slice(start, start + Number(limit)), total, page: Number(page), limit: Number(limit) })
}

export const getProduct = (slug) => {
  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) return Promise.reject({ response: { status: 404, data: { message: 'Product not found' } } })
  const related = PRODUCTS.filter((p) => p.category === product.category && p._id !== product._id).slice(0, 4)
  return wait({ product, related })
}

/* ── Payments (display only) ───────────────────────────────── */

export const getPaymentConfig = () => wait({
  methods: [
    { id: 'airtel_money', label: 'Airtel Money', type: 'mobile_money' },
    { id: 'mtn_money', label: 'MTN MoMo', type: 'mobile_money' },
    { id: 'bank_transfer', label: 'Bank Transfer', type: 'bank' },
    { id: 'cash_on_delivery', label: 'Cash on Delivery', type: 'cod' }
  ],
  merchant: {
    airtelNumber: '0970 000000',
    mtnNumber: '0960 000000',
    bank: { name: 'Zanaco', accountName: 'Olios Records Ltd', accountNumber: '0000000000000', branch: 'Lusaka Main' }
  },
  lencoEnabled: false
})

export const verifyPayment = (reference) => {
  const orders = loadOrders()
  const order = Object.values(orders).find((o) => o.payment_reference === reference)
  return wait({ status: order?.status || 'pending', payment_method: order?.payment_method })
}

/* ── Orders ────────────────────────────────────────────────── */

export const createOrder = (body) => {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  const order_number = `YM-${rand}`
  const _id = order_number
  const isMobile = ['airtel_money', 'mtn_money'].includes(body.payment_method)
  const order = {
    ...body,
    _id,
    order_number,
    payment_reference: order_number,
    payment_provider: body.payment_method === 'cash_on_delivery' ? 'cod' : 'manual',
    status: 'pending',
    created_at: new Date().toISOString()
  }
  const orders = loadOrders()
  orders[_id] = order
  saveOrders(orders)
  return wait({ ...order, paymentInit: { provider: order.payment_provider, status: 'pending', demo: isMobile } })
}

const getOrderById = (id) => {
  const orders = loadOrders()
  const order = orders[id] || Object.values(orders).find((o) => o.order_number === id)
  if (!order) return Promise.reject({ response: { status: 404, data: { message: 'Order not found' } } })
  return wait(order)
}

/* ── Misc storefront ───────────────────────────────────────── */

export const subscribeNewsletter = () => wait({ message: "You're in. New drops coming your way." })
export const sendContactForm = () => wait({ message: 'Message received.' })

// No server PDF in demo — checkout/confirmation hide the invoice link in demo.
export const invoiceUrl = () => '#'

/* ── Default client shim (handles api.get('/orders/:id')) ──── */

export const client = {
  get: (url) => {
    const m = url.match(/\/orders\/([^/]+)$/)
    if (m) return getOrderById(m[1])
    return wait({})
  },
  post: () => wait({}),
  patch: () => wait({}),
  delete: () => wait({}),
  defaults: { baseURL: '' }
}
