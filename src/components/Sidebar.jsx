import { NavLink, Link, useNavigate } from 'react-router-dom'
import { LayoutGrid, ClipboardCheck, Sparkles, Users, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const items = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/app/check-in', label: 'Check-In', icon: ClipboardCheck },
  { to: '/app/assistant', label: 'AI Assistant', icon: Sparkles },
  { to: '/app/community', label: 'Community', icon: Users },
]

export default function Sidebar() {
  const { user, signOut, demo } = useAuth()
  const navigate = useNavigate()
  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-outline-variant/50 bg-white px-5 py-6 lg:flex">
      <Link to="/app/dashboard" className="flex items-center gap-2 px-2 text-2xl font-bold tracking-tight">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ai-gradient text-white">P</span>
        Pulse
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
            <p className="truncate text-sm font-medium">{demo ? 'Demo session' : user?.email}</p>
            <button onClick={handleSignOut} className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-error">
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}