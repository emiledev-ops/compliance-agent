export interface Supplier {
    id?: string
    user_id?: string
    cnpj: string
    name?: string
    trade_name?: string
    status?: 'Aprovado' | 'Pendente' | 'Irregular'
    risk_level?: 'Baixo' | 'Médio' | 'Alto'
    situation?: string
    opening_date?: string
    legal_nature?: string
    main_cnae?: string
    city?: string
    state?: string
    address?: string
    justification?: string
    next_action?: string
    raw_data?: Record<string, unknown>
    created_at?: string
}

export interface ComplianceLog {
    id?: string
    supplier_id?: string
    check_type?: string
    is_conform?: boolean
    justification?: string
    metadata?: Record<string, unknown>
    created_at?: string
}

export interface KPIs {
    total: number
    aprovados: number
    pendentes: number
    irregulares: number
}