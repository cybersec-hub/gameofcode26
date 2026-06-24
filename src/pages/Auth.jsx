import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const { signIn, signUp, enterDemo, demo } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (demo) {
      enterDemo()
      return navigate('/app/dashboard')
    }
    setLoading(true)
    setMsg('')
    const fn = mode === 'signin' ? signIn : signUp
    const { error } = await fn(email, password)
    setLoading(false)
    if (error) return setMsg(error.message)
    if (mode === 'signup') return setMsg('Check your email to confirm, then sign in.')
    navigate('/app/dashboard')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link to="/" className="mb-8 text-center text-2xl font-bold tracking-tight">
        Pulse
      </Link>
      <div className="card">
        <h1 className="text-2xl font-semibold">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Your space for reflection and support.
        </p>

        {demo && (
          <div className="mt-4 rounded-lg bg-secondary-soft px-4 py-3 text-sm text-secondary">
            Demo mode is on (Supabase not configured). Continue to explore everything locally.
          </div>
        )}

        <form onSubmit={submit} className="mt-5 space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-ai w-full" disabled={loading}>
            {loading ? 'Please wait…' : demo ? 'Continue to demo' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {msg && <p className="mt-3 text-sm text-error">{msg}</p>}

        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="mt-4 w-full text-sm text-on-surface-variant"
        >
          {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}