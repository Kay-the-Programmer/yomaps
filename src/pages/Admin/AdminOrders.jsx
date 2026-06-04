import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { adminGetOrders, adminUpdateOrderStatus, invoiceUrl } from '../../lib/api'
import s from './admin.module.css'

const STATUSES = ['pending', 'paid', 'shipped', 'delivered']
const METHOD_LABELS = {
  airtel_money: 'Airtel Money',
  mtn_money: 'MTN MoMo',
  bank_transfer: 'Bank Transfer',
  cash_on_delivery: 'Cash on Delivery'
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState(null)

  const load = () => {
    setLoading(true)
    adminGetOrders({ limit: 200, ...(filter ? { status: filter } : {}) })
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [filter])

  const changeStatus = async (order, status) => {
    const { data } = await adminUpdateOrderStatus(order._id, status)
    setOrders((prev) => prev.map((o) => (o._id === data._id ? data : o)))
  }

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>Orders</h1>
          <p className={s.pageSub}>{orders.length} order(s)</p>
        </div>
        <select className={s.select} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
        </select>
      </div>

      {loading ? (
        <div className={s.loading}>Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className={s.empty}>No orders yet.</div>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Set status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <FragmentRow
                  key={o._id}
                  order={o}
                  expanded={expanded === o._id}
                  onToggle={() => setExpanded(expanded === o._id ? null : o._id)}
                  onStatus={changeStatus}
                  fmtDate={fmtDate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

function FragmentRow({ order, expanded, onToggle, onStatus, fmtDate }) {
  const cur = order.currency === 'USD' ? '$' : 'K'
  return (
    <>
      <tr className={s.rowClickable} onClick={onToggle}>
        <td className={s.mono}>{order.order_number || order._id.slice(-6)}</td>
        <td>{order.customer?.name}<br /><span className={s.muted}>{order.customer?.email}</span></td>
        <td className={s.muted}>{fmtDate(order.created_at)}</td>
        <td className={s.mono}>{cur}{(order.total || 0).toLocaleString()}</td>
        <td><span className={`${s.pill} ${s['pill_' + order.status]}`}>{order.status}</span></td>
        <td onClick={(e) => e.stopPropagation()}>
          <select className={s.select} value={order.status} onChange={(e) => onStatus(order, e.target.value)}>
            {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className={s.detail}>
          <td colSpan={6}>
            <div className={s.detailGrid}>
              <div>
                <div className={s.detailLabel}>Items</div>
                {order.items?.map((it, i) => (
                  <div key={i} className={s.lineItem}>
                    <span>{it.name}{it.size ? ` · ${it.size}` : ''} × {it.quantity}</span>
                    <span className={s.mono}>{cur}{((it.price || 0) * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className={s.lineItem}>
                  <span className={s.muted}>Shipping ({order.shipping_option})</span>
                  <span className={s.mono}>{cur}{(order.shipping_cost || 0).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className={s.detailLabel}>Ship to</div>
                <p style={{ fontSize: 13, lineHeight: 1.7 }}>
                  {order.customer?.name}<br />
                  {order.customer?.phone && <>{order.customer.phone}<br /></>}
                  {order.customer?.address?.line1}<br />
                  {order.customer?.address?.city}{order.customer?.address?.postal_code ? `, ${order.customer.address.postal_code}` : ''}<br />
                  {order.customer?.address?.country}
                </p>
                <div className={s.detailLabel} style={{ marginTop: 14 }}>Payment</div>
                <p style={{ fontSize: 13, lineHeight: 1.7 }}>
                  {METHOD_LABELS[order.payment_method] || order.payment_method || '—'}
                  {order.payment_provider ? <span className={s.muted}> · {order.payment_provider}</span> : null}<br />
                  <span className={s.muted}>Ref:</span> <span className={s.mono}>{order.payment_reference || order.order_number}</span>
                </p>
              </div>
            </div>
            <div className={s.detailActions}>
              <a
                className={s.invoiceLink}
                href={invoiceUrl(order._id)}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={14} strokeWidth={1.8} />
                Download invoice
              </a>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
