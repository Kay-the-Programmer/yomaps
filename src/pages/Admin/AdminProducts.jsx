import { useEffect, useRef, useState } from 'react'
import {
  adminGetProducts, adminCreateProduct, adminUpdateProduct,
  adminDeleteProduct, adminUploadImages, adminDeleteImage
} from '../../lib/api'
import { imageUrl } from '../../lib/utils'
import s from './admin.module.css'

const CATEGORIES = ['apparel', 'headwear', 'accessories', 'music', 'lifestyle', 'exclusive']

const blank = {
  name: '', slug: '', category: 'apparel', price_zmw: '', price_usd: '',
  description: '', sizes: '', tags: '', album: '', stock_count: 0, images: []
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // product object or 'new' or null

  const load = () => {
    setLoading(true)
    adminGetProducts({ limit: 200, sort: 'newest' })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    await adminDeleteProduct(p._id)
    load()
  }

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>Products</h1>
          <p className={s.pageSub}>{products.length} item(s)</p>
        </div>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setEditing('new')}>+ New Product</button>
      </div>

      {loading ? (
        <div className={s.loading}>Loading products…</div>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th></th><th>Name</th><th>Category</th><th>Price (K)</th><th>Stock</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className={s.rowClickable} onClick={() => setEditing(p)}>
                  <td>
                    {p.images?.[0]
                      ? <img className={s.thumb} src={imageUrl(p.images[0])} alt="" />
                      : <span className={s.thumbPlaceholder}>◳</span>}
                  </td>
                  <td>{p.name}</td>
                  <td className={s.muted}>{p.category}</td>
                  <td className={s.mono}>{p.price_zmw?.toLocaleString()}</td>
                  <td className={`${s.mono} ${(p.stock_count || 0) === 0 ? s.out : (p.stock_count <= 10 ? s.low : '')}`}>
                    {p.stock_count ?? 0}
                  </td>
                  <td>{p.in_stock ? <span className={`${s.pill} ${s.pill_paid}`}>In stock</span> : <span className={`${s.pill} ${s.pill_pending}`}>Out</span>}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ProductDrawer
          product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => { setEditing(saved); load() }}
        />
      )}
    </>
  )
}

function ProductDrawer({ product, onClose, onSaved }) {
  const fileRef = useRef(null)
  const [form, setForm] = useState(() => product ? {
    name: product.name || '', slug: product.slug || '', category: product.category || 'apparel',
    price_zmw: product.price_zmw ?? '', price_usd: product.price_usd ?? '',
    description: product.description || '', sizes: (product.sizes || []).join(', '),
    tags: (product.tags || []).join(', '), album: product.album || '',
    stock_count: product.stock_count ?? 0, images: product.images || []
  } : { ...blank })
  const [id, setId] = useState(product?._id || null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const toPayload = () => ({
    name: form.name.trim(),
    slug: form.slug.trim() || undefined,
    category: form.category,
    price_zmw: Number(form.price_zmw) || 0,
    price_usd: Number(form.price_usd) || 0,
    description: form.description.trim(),
    album: form.album.trim() || null,
    stock_count: Number(form.stock_count) || 0,
    sizes: form.sizes.split(',').map((x) => x.trim()).filter(Boolean),
    tags: form.tags.split(',').map((x) => x.trim()).filter(Boolean)
  })

  const save = async () => {
    if (!form.name.trim())   return setError('Name is required.')
    if (!form.description.trim()) return setError('Description is required.')
    setError(''); setSaving(true)
    try {
      const payload = toPayload()
      const { data } = id ? await adminUpdateProduct(id, payload) : await adminCreateProduct(payload)
      setId(data._id)
      setForm((f) => ({ ...f, images: data.images || [], slug: data.slug }))
      onSaved(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  const upload = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    if (!id) { setError('Save the product first, then add images.'); return }
    setUploading(true)
    try {
      const { data } = await adminUploadImages(id, files)
      setForm((f) => ({ ...f, images: data.images || [] }))
      onSaved(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeImage = async (img) => {
    const { data } = await adminDeleteImage(id, img)
    setForm((f) => ({ ...f, images: data.images || [] }))
    onSaved(data)
  }

  return (
    <div className={s.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={s.drawer}>
        <div className={s.drawerHead}>
          <h2 className={s.drawerTitle}>{id ? 'Edit Product' : 'New Product'}</h2>
          <button className={s.close} onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className={s.field}>
          <label className={s.label}>Name</label>
          <input className={s.input} value={form.name} onChange={set('name')} />
        </div>

        <div className={s.fieldRow}>
          <div className={s.field}>
            <label className={s.label}>Category</label>
            <select className={s.input} value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>Stock count</label>
            <input type="number" min="0" className={s.input} value={form.stock_count} onChange={set('stock_count')} />
          </div>
        </div>

        <div className={s.fieldRow}>
          <div className={s.field}>
            <label className={s.label}>Price (ZMW)</label>
            <input type="number" min="0" className={s.input} value={form.price_zmw} onChange={set('price_zmw')} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Price (USD)</label>
            <input type="number" min="0" className={s.input} value={form.price_usd} onChange={set('price_usd')} />
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label}>Description</label>
          <textarea className={s.textarea} value={form.description} onChange={set('description')} />
        </div>

        <div className={s.fieldRow}>
          <div className={s.field}>
            <label className={s.label}>Sizes (comma-sep)</label>
            <input className={s.input} value={form.sizes} onChange={set('sizes')} placeholder="S, M, L, XL" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Tags (comma-sep)</label>
            <input className={s.input} value={form.tags} onChange={set('tags')} placeholder="new, limited" />
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label}>Album (optional)</label>
          <input className={s.input} value={form.album} onChange={set('album')} />
        </div>

        <div className={s.field}>
          <label className={s.label}>Images</label>
          {form.images?.length > 0 && (
            <div className={s.imgGrid}>
              {form.images.map((img) => (
                <div key={img} className={s.imgCell}>
                  <img src={imageUrl(img)} alt="" />
                  <button className={s.imgRemove} onClick={() => removeImage(img)} aria-label="Remove image">×</button>
                </div>
              ))}
            </div>
          )}
          <div
            className={s.dropzone}
            onClick={() => id ? fileRef.current?.click() : setError('Save the product first, then add images.')}
            style={{ marginTop: form.images?.length ? 12 : 0 }}
          >
            {uploading ? 'Uploading…' : id ? 'Click to upload image(s) — JPG/PNG/WebP, max 5MB' : 'Save the product first to add images'}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={upload} />
        </div>

        {error && <p className={s.errorText}>{error}</p>}

        <div className={s.drawerActions}>
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={save} disabled={saving}>
            {saving ? 'Saving…' : id ? 'Save Changes' : 'Create Product'}
          </button>
          <button className={s.btn} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}
