import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  ClipboardCheck,
  Sparkles,
  Users,
  LogOut,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const items = [
  { to: '/app/dashboard', label: 'Dashboard', mobileLabel: 'Dashboard', icon: LayoutGrid },
  { to: '/app/check-in', label: 'Check-In', mobileLabel: 'Check-In', icon: ClipboardCheck },
  { to: '/app/assistant', label: 'AI Assistant', mobileLabel: 'AI', icon: Sparkles },
  { to: '/app/community', label: 'Community', mobileLabel: 'Community', icon: Users },
  { to: '/app/learn', label: 'Learn', mobileLabel: 'Learn', icon: BookOpen },
]

export default function Sidebar() {
  const { user, signOut, demo } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-outline-variant/50 bg-white px-5 py-6 lg:flex">
        <Link
          to="/app/dashboard"
          className="flex items-center gap-2 px-2 text-2xl font-bold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ai-gradient text-white">
            N
          </span>
          NEXOVERSE PATH
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-secondary-soft text-secondary'
                    : 'text-on-surface-variant hover:bg-surface-low'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-outline-variant/50 pt-4">
          <div className="flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ai-gradient text-sm font-semibold text-white">
              {(user?.email?.[0] || 'U').toUpperCase()}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {demo ? 'Demo session' : user?.email}
              </p>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-error"
              >
                <LogOut size={12} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant/50 bg-white px-2 py-2 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {items.map(({ to, mobileLabel, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-[11px] font-semibold transition ${
                  isActive
                    ? 'bg-secondary-soft text-secondary'
                    : 'text-on-surface-variant hover:bg-surface-low'
                }`
              }
            >
              <Icon size={21} />
              <span className="mt-1 leading-none">{mobileLabel}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}