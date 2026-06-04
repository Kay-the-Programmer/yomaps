import axios from 'axios'
import { getAdminToken, clearAdminAuth } from '../store/adminStore'
import * as demo from './demoApi'

// DEMO mode: no backend. Storefront runs on static data + localStorage so the
// site can be deployed as a pure static build (set VITE_DEMO=true).
export const IS_DEMO = import.meta.env.VITE_DEMO === 'true'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach the admin JWT to every request when present
api.interceptors.request.use((config) => {
  const token = getAdminToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On auth failure, clear the session and bounce to the login screen
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    if ((status === 401 || status === 403) && !url.includes('/auth/login')) {
      clearAdminAuth()
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        window.location.assign('/admin/login')
      }
    }
    return Promise.reject(error)
  }
)

/* ───────────────────────── Storefront ───────────────────────── */
export const getProducts = IS_DEMO ? demo.getProducts : (params) => api.get('/products', { params })
export const getProduct  = IS_DEMO ? demo.getProduct  : (slug)   => api.get(`/products/${slug}`)
export const getPaymentConfig = IS_DEMO ? demo.getPaymentConfig : () => api.get('/payment/config')
export const verifyPayment = IS_DEMO ? demo.verifyPayment : (reference) => api.get(`/payment/verify/${reference}`)
export const createOrder = IS_DEMO ? demo.createOrder : (body) => api.post('/orders', body)
export const subscribeNewsletter = IS_DEMO ? demo.subscribeNewsletter : (email) => api.post('/newsletter/subscribe', { email })
export const sendContactForm = IS_DEMO ? demo.sendContactForm : (body) => api.post('/contact', body)

/* ─────────────────────────── Admin ──────────────────────────── */
export const adminLogin = (credentials) => api.post('/auth/login', credentials)

export const adminGetProducts = (params) => api.get('/products', { params })
export const adminGetProduct  = (id)     => api.get(`/products/admin/${id}`)
export const adminCreateProduct = (body) => api.post('/products', body)
export const adminUpdateProduct = (id, body) => api.put(`/products/${id}`, body)
export const adminDeleteProduct = (id) => api.delete(`/products/${id}`)

export const adminUploadImages = (id, files) => {
  const fd = new FormData()
  Array.from(files).forEach((f) => fd.append('images', f))
  return api.post(`/products/${id}/images`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const adminDeleteImage = (id, image) =>
  api.delete(`/products/${id}/images`, { data: { image } })

export const adminGetOrders = (params) => api.get('/orders', { params })
export const adminUpdateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status })

/* Absolute URL to an order's downloadable PDF invoice */
export const invoiceUrl = IS_DEMO ? demo.invoiceUrl : (id) => `${api.defaults.baseURL}/orders/${id}/invoice`

export default IS_DEMO ? demo.client : api
