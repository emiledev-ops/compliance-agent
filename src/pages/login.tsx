import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)

    async function handleSubmit() {
        setLoading(true)
        setError('')

        const { error } = isSignUp
            ? await supabase.auth.signUp({ email, password })
            : await supabase.auth.signInWithPassword({ email, password })

        if (error) setError(error.message)
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm shadow-sm">

                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 16 16">
                            <path d="M8 1L2 4v4c0 3.3 2.5 6.4 6 7.2C11.5 14.4 14 11.3 14 8V4L8 1z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">ComplianceAgent</div>
                        <div className="text-xs text-gray-500">Fornecedores MVP</div>
                    </div>
                </div>

                <h1 className="text-lg font-medium text-gray-900 mb-1">
                    {isSignUp ? 'Criar conta' : 'Entrar'}
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    {isSignUp ? 'Crie sua conta para começar' : 'Acesse sua conta para continuar'}
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                        />
                    </div>

                    {error && (
                        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-800 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
                    </button>
                </div>

                <p className="text-xs text-center text-gray-500 mt-4">
                    {isSignUp ? 'Já tem conta?' : 'Não tem conta?'}{' '}
                    <button
                        onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                        className="text-blue-700 hover:underline cursor-pointer"
                    >
                        {isSignUp ? 'Entrar' : 'Criar conta'}
                    </button>
                </p>
            </div>
        </div>
    )
}