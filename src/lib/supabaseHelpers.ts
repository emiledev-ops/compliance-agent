import { supabase } from './supabase.ts'
import { Supplier } from '../types/index.ts'

export async function saveSupplier(supplier: Supplier): Promise<Supplier | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const payload = { ...supplier, user_id: user.id }

    const { data, error } = await supabase
        .from('suppliers')
        .upsert(payload, { onConflict: 'user_id,cnpj' })
        .select()
        .single()

    if (error) { console.error(error); return null }
    return data
}

export async function loadSuppliers(): Promise<Supplier[]> {
    const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) { console.error(error); return [] }
    return data || []
}

export async function deleteSupplier(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)

    if (error) { console.error(error); return false }
    return true
}