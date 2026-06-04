import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar/Navbar'
import Footer from './components/layout/Footer/Footer'
import PageTransition from './components/layout/PageTransition/PageTransition'
import ToastRegion from './components/ui/Toast/Toast'
import { useCursor } from './hooks/useCursor'
import { IS_DEMO } from './lib/api'

import Home from './pages/Home/Home'
import Shop from './pages/Shop/Shop'
import Category from './pages/Category/Category'
import Product from './pages/Product/Product'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import OrderConfirmed from './pages/OrderConfirmed/OrderConfirmed'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import FAQ from './pages/FAQ/FAQ'

const AdminApp = lazy(() => import('./pages/Admin/AdminApp'))

function StorefrontLayout() {
  useCursor()

  return (
    <>
      <div className="cursor" aria-hidden="true" />
      <Navbar />
      <PageTransition>
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/shop"                element={<Shop />} />
          <Route path="/shop/:category"      element={<Category />} />
          <Route path="/product/:slug"       element={<Product />} />
          <Route path="/cart"                element={<Cart />} />
          <Route path="/checkout"            element={<Checkout />} />
          <Route path="/order-confirmed/:id" element={<OrderConfirmed />} />
          <Route path="/about"               element={<About />} />
          <Route path="/contact"             element={<Contact />} />
          <Route path="/faq"                 element={<FAQ />} />
        </Routes>
      </PageTransition>
      <Footer />
      <ToastRegion />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Admin is backend-powered — excluded from the static DEMO build */}
      {!IS_DEMO && (
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
      )}
      <Route path="/*" element={<StorefrontLayout />} />
    </Routes>
  )
}
