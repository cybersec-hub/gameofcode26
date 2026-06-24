import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import CheckIn from './pages/CheckIn'
import Assistant from './pages/Assistant'
import Community from './pages/Community'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="py-20 text-center text-on-surface-variant">Loading…</div>
  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/app"
            element={
              <Protected>
                <Layout />
              </Protected>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="community" element={<Community />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
