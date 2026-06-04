import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ExternalLink, LogOut } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'
import s from './admin.module.css'

const LINKS = [
  { to: '/admin',          label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders',   label: 'Orders' }
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const username = useAdminStore((s) => s.username)
  const logout = useAdminStore((s) => s.logout)
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)

  // Close the drawer whenever the route changes
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Prevent body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLogout = () => {
    close()
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className={s.shell}>
      {/* Mobile top bar */}
      <header className={s.topbar}>
        <button
          className={`${s.menuBtn} ${menuOpen ? s.menuBtnOpen : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
        <span className={s.topbarBrand}>YO <span>MAPS</span></span>
      </header>

      {menuOpen && <div className={s.backdrop} onClick={close} aria-hidden="true" />}

      <aside className={`${s.sidebar} ${menuOpen ? s.sidebarOpen : ''}`}>
        <div className={s.brand}>
          YO <span>MAPS</span>
          <span className={s.brandTag}>Admin</span>
        </div>

        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={close}
            className={({ isActive }) => `${s.navLink} ${isActive ? s.navLinkActive : ''}`}
          >
            {label}
          </NavLink>
        ))}

        <div className={s.sidebarFoot}>
          <a href="/" className={s.viewLinkRow} target="_blank" rel="noreferrer">
            View store <ExternalLink size={13} strokeWidth={1.8} />
          </a>
          <span className={s.userLine}>Signed in as {username || 'admin'}</span>
          <button className={s.logoutBtn} onClick={handleLogout}>
            <LogOut size={14} strokeWidth={1.8} /> Log out
          </button>
        </div>
      </aside>

      <main className={s.main}>
        <Outlet />
      </main>
    </div>
  )
}
