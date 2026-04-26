import { Supplier } from '@/types'

interface BrasilAPIResponse {
    cnpj: string
    razao_social?: string
    nome_fantasia?: string
    descricao_situacao_cadastral?: string
    data_inicio_atividade?: string
    natureza_juridica?: string
    cnae_fiscal_descricao?: string
    municipio?: string
    uf?: string
    logradouro?: string
    numero?: string
    bairro?: string
    cep?: string
    porte?: string
    capital_social?: number
}

export async function fetchCNPJData(cnpj: string): Promise<BrasilAPIResponse | null> {
    try {
    const clean = cnpj.replace(/\D/g, '')
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`)
    if (!res.ok) return null
    return await res.json()
    } catch {
    return null
}
}

export function classifySupplier(data: BrasilAPIResponse | null, cnpj: string): Supplier {
    if (!data) {
    return {
    cnpj,
    name: 'Não encontrado',
    status: 'Irregular',
    risk_level: 'Alto',
    justification: 'CNPJ não encontrado na Receita Federal ou inválido.',
    next_action: 'Verifique o CNPJ informado e tente novamente.',
    }
}

const situacao = data.descricao_situacao_cadastral?.toUpperCase() || ''
const isAtiva = situacao === 'ATIVA'
const isBaixa = situacao.includes('BAIXA')
const isSuspensa = situacao.includes('SUSPENSA') || situacao.includes('INAPTA')

const address = [
    data.logradouro,
    data.numero,
    data.bairro,
    data.cep
].filter(Boolean).join(', ')

const base: Partial<Supplier> = {
    cnpj,
    name: data.razao_social || 'Não informado',
    trade_name: data.nome_fantasia || undefined,
    situation: data.descricao_situacao_cadastral || 'Não informado',
    opening_date: data.data_inicio_atividade || undefined,
    legal_nature: data.natureza_juridica || undefined,
    main_cnae: data.cnae_fiscal_descricao || undefined,
    city: data.municipio || undefined,
    state: data.uf || undefined,
    address: address || undefined,
    raw_data: data as unknown as Record<string, unknown>,
}

    if (isBaixa) {
    return {
    ...base,
    cnpj,
    status: 'Irregular',
    risk_level: 'Alto',
    justification: `CNPJ com situação cadastral BAIXADA na Receita Federal. Empresa encerrada.`,
    next_action: 'Não contratar. Solicite documentação que justifique a situação ou substitua o fornecedor.',
    }
}

if (isSuspensa) {
    return {
    ...base,
    cnpj,
    status: 'Irregular',
    risk_level: 'Alto',
    justification: `CNPJ com situação ${data.descricao_situacao_cadastral}. Empresa com restrições cadastrais na Receita Federal.`,
    next_action: 'Não contratar até regularização. Solicite certidão atualizada ao fornecedor.',
    }
}

    if (isAtiva) {
    const hasFullData = data.natureza_juridica && data.cnae_fiscal_descricao && data.municipio
    if (hasFullData) {
    return {
        ...base,
        cnpj,
        status: 'Aprovado',
        risk_level: 'Baixo',
        justification: `CNPJ ativo na Receita Federal. Dados cadastrais completos. Situação: ${data.descricao_situacao_cadastral}.`,
        next_action: 'Fornecedor apto para contratação. Recomenda-se solicitar certidões negativas de débitos.',
    }
    } else {
    return {
        ...base,
        cnpj,
        status: 'Pendente',
        risk_level: 'Médio',
        justification: `CNPJ ativo mas com dados cadastrais incompletos na Receita Federal.`,
        next_action: 'Solicite documentação complementar ao fornecedor antes de contratar.',
    }
    }
}

return {
    ...base,
    cnpj,
    status: 'Pendente',
    risk_level: 'Médio',
    justification: `Situação cadastral: ${data.descricao_situacao_cadastral || 'Não identificada'}. Requer análise manual.`,
    next_action: 'Solicite certidões atualizadas e analise manualmente antes de contratar.',
}
}