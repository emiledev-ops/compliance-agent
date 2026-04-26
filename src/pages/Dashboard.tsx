import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadSuppliers } from '../lib/supabaseHelpers'
import { Supplier, KPIs } from '../types'

function calcKPIs(suppliers: Supplier[]): KPIs {
    return {
        total: suppliers.length,
        aprovados: suppliers.filter(s => s.status === 'Aprovado').length,
        pendentes: suppliers.filter(s => s.status === 'Pendente').length,
        irregulares: suppliers.filter(s => s.status === 'Irregular').length,
    }
}

function StatusBadge({ status }: { status?: string }) {
    const map: Record<string, string> = {
        'Aprovado': 'bg-green-100 text-green-800',
        'Pendente': 'bg-yellow-100 text-yellow-800',
        'Irregular': 'bg-red-100 text-red-800',
    }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status || ''] || 'bg-gray-100 text-gray-600'}`}>
            {status || '—'}
        </span>
    )
}

function RiskBadge({ risk }: { risk?: string }) {
    const map: Record<string, string> = {
        'Baixo': 'bg-blue-100 text-blue-800',
        'Médio': 'bg-yellow-100 text-yellow-800',
        'Alto': 'bg-red-100 text-red-800',
    }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[risk || ''] || 'bg-gray-100 text-gray-600'}`}>
            {risk || '—'}
        </span>
    )
}

export default function Dashboard() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        loadSuppliers().then(data => {
            setSuppliers(data)
            setLoading(false)
        })
    }, [])

    const kpis = calcKPIs(suppliers)
    const pct = kpis.total > 0 ? Math.round((kpis.aprovados / kpis.total) * 100) : 0
    const recent = suppliers.slice(0, 5)

    return (
        <div className="p-6">
            {/* Topbar */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Visão geral de conformidade dos fornecedores</p>
                </div>
                <button
                    onClick={() => navigate('/consulta')}
                    className="flex items-center gap-1.5 bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="8" y1="2" x2="8" y2="14" strokeLinecap="round" />
                        <line x1="2" y1="8" x2="14" y2="8" strokeLinecap="round" />
                    </svg>
                    Nova consulta
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Total de fornecedores</div>
                    <div className="text-2xl font-semibold text-gray-900">{kpis.total}</div>
                    <div className="text-xs text-gray-400 mt-1">cadastrados</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Fornecedores aptos</div>
                    <div className="text-2xl font-semibold text-green-700">{pct}%</div>
                    <div className="text-xs text-gray-400 mt-1">{kpis.aprovados} aprovados</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Pendentes</div>
                    <div className="text-2xl font-semibold text-yellow-600">{kpis.pendentes}</div>
                    <div className="text-xs text-gray-400 mt-1">requerem atenção</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Irregulares</div>
                    <div className="text-2xl font-semibold text-red-600">{kpis.irregulares}</div>
                    <div className="text-xs text-gray-400 mt-1">não aptos</div>
                </div>
            </div>

            {/* Tabela recentes */}
            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Consultas recentes</div>
                    <button onClick={() => navigate('/fornecedores')} className="text-xs text-blue-700 hover:underline cursor-pointer">
                        Ver todos →
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-400">Carregando...</div>
                ) : recent.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                        Nenhum fornecedor consultado ainda.{' '}
                        <button onClick={() => navigate('/consulta')} className="text-blue-700 hover:underline cursor-pointer">
                            Fazer primeira consulta
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Empresa</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">CNPJ</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Risco</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map(s => (
                                    <tr
                                        key={s.cnpj}
                                        onClick={() => navigate('/fornecedores')}
                                        className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900">{s.name || '—'}</td>
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.cnpj}</td>
                                        <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                                        <td className="px-4 py-3"><RiskBadge risk={s.risk_level} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}