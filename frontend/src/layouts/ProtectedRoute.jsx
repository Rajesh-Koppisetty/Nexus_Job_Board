import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth()

  // A token exists in localStorage but React state hasn't been updated yet
  // (race condition right after login/register before re-render). Show loading
  // instead of bouncing to /login.
  const hasToken = !!localStorage.getItem('token')

  if (loading || (hasToken && !user)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
