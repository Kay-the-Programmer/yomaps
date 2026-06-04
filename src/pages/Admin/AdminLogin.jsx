import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../lib/api'
import { useAdminStore } from '../../store/adminStore'
import s from './admin.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const setAuth = useAdminStore((st) => st.setAuth)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await adminLogin(form)
      setAuth(data)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.loginPage}>
      <form className={s.loginCard} onSubmit={submit}>
        <div className={s.loginBrand}>YO <span>MAPS</span></div>
        <div className={s.loginSub}>Admin Panel</div>

        <div className={s.field}>
          <label className={s.label}>Username</label>
          <input
            className={s.input}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoFocus
          />
        </div>
        <div className={s.field}>
          <label className={s.label}>Password</label>
          <input
            type="password"
            className={s.input}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {error && <p className={s.errorText} style={{ marginBottom: 14 }}>{error}</p>}

        <button className={`${s.btn} ${s.btnPrimary}`} type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
