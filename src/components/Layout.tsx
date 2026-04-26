import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Props { children: ReactNode }

const navItems = [
    {
        path: '/dashboard', label: 'Dashboard', icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
        )
    },
    {
        path: '/fornecedores', label: 'Fornecedores', icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a3 3 0 100 6A3 3 0 008 1zM2 13c0-3.3 2.7-5 6-5s6 1.7 6 5H2z" />
            </svg>
        )
    },
    {
        path: '/consulta', label: 'Nova consulta', icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6.5" cy="6.5" r="4.5" />
                <line x1="10" y1="10" x2="14" y2="14" strokeLinecap="round" />
            </svg>
        )
    },
    {
        path: '/regras', label: 'Regras', icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3h12v1.5H2zm0 4h12v1.5H2zm0 4h8v1.5H2z" />
            </svg>
        )
    },
]

export default function Layout({ children }: Props) {
    const navigate = useNavigate()
    const location = useLocation()

    async function handleLogout() {
        await supabase.auth.signOut()
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">

            {/* barra lateral */}
            <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">

                {/* Logo */}
                <div className="px-4 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Orthos" className="w-7 h-7 object-contain flex-shrink-0" />
                        <div>
                            <div className="text-sm font-medium text-gray-900">ORTHOS</div>
                            <div className="text-xs text-gray-500">Agente de Compliance</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-2 py-3">
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors cursor-pointer
                ${location.pathname === item.path
                                    ? 'bg-blue-50 text-blue-800 font-medium'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-2 py-3 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Sair
                    </button>
                </div>

            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>

        </div>
    )
}