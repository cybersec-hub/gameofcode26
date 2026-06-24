import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, signOut, demo } = useAuth()
  const navigate = useNavigate()
  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
        {/* Mobile top bar (hidden on desktop where the sidebar takes over) */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-background/80 px-5 py-4 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-3">
            <Menu size={22} className="text-on-surface" />
            <Link to="/app/dashboard" className="text-xl font-bold tracking-tight text-on-surface">
              NEXOVERSE PATH
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-on-surface-variant" />
            <button
              onClick={handleSignOut}
              title={demo ? 'Demo session — tap to sign out' : user?.email}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ai-gradient text-sm font-semibold text-white"
            >
              {(user?.email?.[0] || 'U').toUpperCase()}
            </button>
          </div>
        </header>

        {/* Page content: roomy on desktop, comfortable on mobile */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-2 lg:px-10 lg:py-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  )
}