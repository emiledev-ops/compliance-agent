import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadSuppliers, deleteSupplier } from '../lib/supabaseHelpers'
import { Supplier } from '../types'
import { generatePDF } from '../lib/generatePDF'

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

export default function Fornecedores() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<Supplier | null>(null)
    const [filter, setFilter] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        loadSuppliers().then(data => {
            setSuppliers(data)
            setLoading(false)
        })
    }, [])

    async function handleDelete(id: string) {
        if (!confirm('Remover este fornecedor?')) return
        await deleteSupplier(id)
        setSuppliers(prev => prev.filter(s => s.id !== id))
        if (selected?.id === id) setSelected(null)
    }

    const filtered = suppliers.filter(s =>
        s.name?.toLowerCase().includes(filter.toLowerCase()) ||
        s.cnpj.includes(filter)
    )

    function formatCNPJ(cnpj: string) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-medium text-gray-900">Fornecedores</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{suppliers.length} fornecedor(es) cadastrado(s)</p>
                </div>
                <button
                    onClick={() => navigate('/consulta')}
                    className="flex items-center gap-1.5 bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                >
                    + Nova consulta
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="px-4 py-3 border-b border-gray-200">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou CNPJ..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="w-full max-w-xs px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-400">Carregando...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">Nenhum fornecedor encontrado.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Empresa</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">CNPJ</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Risco</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Cidade/UF</th>
                                    <th className="px-4 py-2.5"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(s => (
                                    <tr
                                        key={s.cnpj}
                                        onClick={() => setSelected(s)}
                                        className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900">{s.name || '—'}</td>
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{formatCNPJ(s.cnpj)}</td>
                                        <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                                        <td className="px-4 py-3"><RiskBadge risk={s.risk_level} /></td>
                                        <td className="px-4 py-3 text-gray-500">{s.city}{s.state ? `/${s.state}` : ''}</td>
                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleDelete(s.id!)}
                                                className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Painel de detalhe */}
            {selected && (
                <div className="mt-4 bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="text-base font-medium text-gray-900">{selected.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {selected.trade_name && `${selected.trade_name} · `}
                                CNPJ {formatCNPJ(selected.cnpj)}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={selected.status} />
                            <RiskBadge risk={selected.risk_level} />
                            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 ml-2 cursor-pointer">✕</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div><div className="text-xs text-gray-400">Situação cadastral</div><div className="text-sm font-medium">{selected.situation || '—'}</div></div>
                        <div><div className="text-xs text-gray-400">Data de abertura</div><div className="text-sm font-medium">{selected.opening_date || '—'}</div></div>
                        <div><div className="text-xs text-gray-400">Natureza jurídica</div><div className="text-sm font-medium">{selected.legal_nature || '—'}</div></div>
                        <div><div className="text-xs text-gray-400">CNAE principal</div><div className="text-sm font-medium">{selected.main_cnae || '—'}</div></div>
                        <div><div className="text-xs text-gray-400">Município/UF</div><div className="text-sm font-medium">{selected.city}{selected.state ? `/${selected.state}` : ''}</div></div>
                        <div><div className="text-xs text-gray-400">Endereço</div><div className="text-sm font-medium">{selected.address || '—'}</div></div>
                    </div>

                    <div className="mb-3">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Justificativa</div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700">{selected.justification || '—'}</div>
                    </div>

                    <div className="mb-4">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Próxima ação recomendada</div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-sm text-blue-800">{selected.next_action || '—'}</div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={() => generatePDF(selected)}
                            className="flex items-center gap-2 bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M8 2v8M5 7l3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Baixar relatório PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}