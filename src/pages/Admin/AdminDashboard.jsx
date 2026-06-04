import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Clock, Banknote, Package, ArrowRight } from 'lucide-react'
import { adminGetProducts, adminGetOrders } from '../../lib/api'
import s from './admin.module.css'

const LOW_STOCK = 10

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminGetProducts({ limit: 200 }),
      adminGetOrders({ limit: 200 })
    ])
      .then(([p, o]) => {
        setProducts(p.data.products || [])
        setOrders(o.data.orders || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const revenue = orders
    .filter((o) => ['paid', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + (o.total || 0), 0)

  const pending = orders.filter((o) => o.status === 'pending').length
  const lowStock = products.filter((p) => (p.stock_count || 0) <= LOW_STOCK)

  if (loading) return <div className={s.loading}>Loading dashboard…</div>

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>Dashboard</h1>
          <p className={s.pageSub}>Store overview</p>
        </div>
      </div>

      <div className={s.statGrid}>
        <div className={s.statCard}>
          <ShoppingCart className={s.statIcon} size={20} strokeWidth={1.6} />
          <div className={s.statValue}>{orders.length}</div>
          <div className={s.statLabel}>Total Orders</div>
        </div>
        <div className={s.statCard}>
          <Clock className={s.statIcon} size={20} strokeWidth={1.6} />
          <div className={s.statValue}>{pending}</div>
          <div className={s.statLabel}>Pending</div>
        </div>
        <div className={s.statCard}>
          <Banknote className={s.statIcon} size={20} strokeWidth={1.6} />
          <div className={s.statValue}>K{revenue.toLocaleString()}</div>
          <div className={s.statLabel}>Revenue (paid+)</div>
        </div>
        <div className={s.statCard}>
          <Package className={s.statIcon} size={20} strokeWidth={1.6} />
          <div className={s.statValue}>{products.length}</div>
          <div className={s.statLabel}>Products</div>
        </div>
      </div>

      <div className={s.panel}>
        <div className={s.panelTitle}>Low stock ({'≤'} {LOW_STOCK})</div>
        {lowStock.length === 0 ? (
          <p className={s.muted}>All products are well stocked.</p>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr><th>Product</th><th>Category</th><th>Stock</th></tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td className={s.muted}>{p.category}</td>
                    <td className={(p.stock_count || 0) === 0 ? s.out : s.low}>{p.stock_count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p style={{ marginTop: 14 }}>
          <Link to="/admin/products" className={s.viewLinkRow}>Manage products <ArrowRight size={14} strokeWidth={1.8} /></Link>
        </p>
      </div>
    </>
  )
}
