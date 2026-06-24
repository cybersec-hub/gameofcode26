import { NavLink } from 'react-router-dom'
import { LayoutGrid, ClipboardCheck, Sparkles, Users } from 'lucide-react'

const items = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/app/check-in', label: 'Check-In', icon: ClipboardCheck },
  { to: '/app/assistant', label: 'AI', icon: Sparkles },
  { to: '/app/community', label: 'Community', icon: Users },
   { to: '/app/learn', label: 'Learn', icon: Users },
    { to: '/app/journal', label: 'Journal', icon: Users },
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-outline-variant/60 bg-white/90 backdrop-blur-md">
      <div className="flex items-stretch justify-around px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition ${
                isActive ? 'text-secondary' : 'text-on-surface-variant'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition ${
                    isActive ? 'bg-secondary-soft' : ''
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
