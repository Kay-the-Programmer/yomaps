import { Navigate, Outlet } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'

export default function ProtectedRoute() {
  const token = useAdminStore((s) => s.token)
  if (!token) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
