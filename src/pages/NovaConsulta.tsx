import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCNPJData, classifySupplier } from '../lib/compliance'
import { saveSupplier } from '../lib/supabaseHelpers'
import { Supplier } from '../types'

const steps = [
    'Consultando Receita Federal...',
    'Extraindo dados cadastrais...',
    'Aplicando regras de compliance...',
    'Classificando fornecedor...',
]

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

export default function NovaConsulta() {
    const [cnpj, setCnpj] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(-1)
    const [completedSteps, setCompletedSteps] = useState<number[]>([])
    const [result, setResult] = useState<Supplier | null>(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    function formatCNPJ(value: string) {
        const clean = value.replace(/\D/g, '').slice(0, 14)
        return clean
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
    }

    async function handleConsult() {
        const clean = cnpj.replace(/\D/g, '')
        if (clean.length !== 14) {
            setError('CNPJ inválido. Informe 14 dígitos.')
            return
        }

        setLoading(true)
        setError('')
        setResult(null)
        setCompletedSteps([])
        setCurrentStep(0)

        const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

        const raw = await fetchCNPJData(clean)
        setCompletedSteps([0])
        setCurrentStep(1)
        await delay(600)

        setCompletedSteps([0, 1])
        setCurrentStep(2)
        await delay(600)

        const classified = classifySupplier(raw, clean)
        setCompletedSteps([0, 1, 2])
        setCurrentStep(3)
        await delay(400)

        const saved = await saveSupplier(classified)
        setCompletedSteps([0, 1, 2, 3])
        setCurrentStep(-1)

        setResult(saved || classified)
        setLoading(false)
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-lg font-medium text-gray-900">Nova consulta</h1>
                <p className="text-sm text-gray-500 mt-0.5">Consulte um CNPJ e classifique o fornecedor automaticamente</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-lg">
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">CNPJ do fornecedor</label>
                    <input
                        type="text"
                        value={cnpj}
                        onChange={e => setCnpj(formatCNPJ(e.target.value))}
                        placeholder="00.000.000/0000-00"
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-mono"
                    />
                </div>

                {error && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleConsult}
                    disabled={loading}
                    className="w-full bg-blue-800 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {loading ? 'Consultando...' : 'Consultar CNPJ'}
                </button>

                {/* Loading steps */}
                {loading && (
                    <div className="mt-4 space-y-2">
                        {steps.map((step, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-sm">
                                {completedSteps.includes(i) ? (
                                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <polyline points="1.5,5 4,7.5 8.5,2.5" />
                                        </svg>
                                    </div>
                                ) : currentStep === i ? (
                                    <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
                                ) : (
                                    <div className="w-4 h-4 border-2 border-gray-200 rounded-full flex-shrink-0" />
                                )}
                                <span className={
                                    completedSteps.includes(i) ? 'text-gray-900' :
                                        currentStep === i ? 'text-blue-700' : 'text-gray-400'
                                }>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Resultado */}
            {result && (
                <div className="mt-4 bg-white border border-gray-200 rounded-xl p-5 max-w-lg">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <div className="font-medium text-gray-900">{result.name || '—'}</div>
                            <div className="text-xs text-gray-500 mt-0.5">CNPJ {result.cnpj}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={result.status} />
                            <RiskBadge risk={result.risk_level} />
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 mb-3">
                        {result.justification}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-sm text-blue-800 mb-4">
                        {result.next_action}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => { setResult(null); setCnpj('') }}
                            className="flex-1 text-sm border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                            Nova consulta
                        </button>
                        <button
                            onClick={() => navigate('/fornecedores')}
                            className="flex-1 text-sm bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 cursor-pointer"
                        >
                            Ver fornecedores
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}