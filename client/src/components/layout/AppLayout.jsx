import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { navItems } from '../../data/navigation'
import { getActiveNavItem } from '../../utils/navigation'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const currentModule = useMemo(
    () => getActiveNavItem(location.pathname, navItems),
    [location.pathname],
  )

  const openSidebar = useCallback(() => setSidebarOpen(true), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login', { replace: true, state: { from: location.pathname } })
  }, [logout, navigate, location.pathname])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={currentModule.label}
          subtitle={currentModule.description}
          onMenuClick={openSidebar}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
