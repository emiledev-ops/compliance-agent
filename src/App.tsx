import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Session } from '@supabase/supabase-js'
import Layout from './components/Layout.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Fornecedores from './pages/Fornecedores.tsx'
import NovaConsulta from './pages/NovaConsulta.tsx'
import Regras from './pages/Regras.tsx'
import Login from './pages/login'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-sm text-gray-500">Carregando...</div>
    </div>
  )

  if (!session) return <Login />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/consulta" element={<NovaConsulta />} />
        <Route path="/regras" element={<Regras />} />
      </Routes>
    </Layout>
  )
}