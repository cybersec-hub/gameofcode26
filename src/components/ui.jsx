export function GlassCard({ className = '', children, ...rest }) {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function Chip({ children, color = '#712ae2' }) {
  return (
    <span className="chip" style={{ background: `${color}1A`, color }}>
      {children}
    </span>
  )
}

export function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
      {children}
    </p>
  )
}

export function ProgressBar({ value, color = '#712ae2', track = '#e6e8ea' }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: track }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  )
}
