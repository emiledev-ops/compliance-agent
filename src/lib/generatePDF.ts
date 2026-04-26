import jsPDF from 'jspdf'
import { Supplier } from '../types'

export function generatePDF(supplier: Supplier) {
    const doc = new jsPDF()
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 20
    let y = 20

    // Header azul
    doc.setFillColor(12, 68, 124)
    doc.rect(0, 0, pageW, 40, 'F')

    // Logo texto
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Ortho', margin, 18)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Relatório de Homologação de Fornecedor', margin, 26)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, margin, 33)

    y = 55

    // Status badge
    const statusColor: Record<string, [number, number, number]> = {
        'Aprovado': [59, 109, 17],
        'Pendente': [133, 79, 11],
        'Irregular': [163, 45, 45],
    }
    const statusBg: Record<string, [number, number, number]> = {
        'Aprovado': [234, 243, 222],
        'Pendente': [250, 238, 218],
        'Irregular': [252, 235, 235],
    }
    const status = supplier.status || 'Pendente'
    const [r, g, b] = statusColor[status] || [100, 100, 100]
    const [br, bg, bb] = statusBg[status] || [240, 240, 240]

    doc.setFillColor(br, bg, bb)
    doc.roundedRect(margin, y - 6, 40, 10, 3, 3, 'F')
    doc.setTextColor(r, g, b)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(status.toUpperCase(), margin + 4, y + 0.5)

    // Risco
    doc.setFillColor(230, 241, 251)
    doc.roundedRect(margin + 44, y - 6, 35, 10, 3, 3, 'F')
    doc.setTextColor(24, 95, 165)
    doc.text(`RISCO ${(supplier.risk_level || '—').toUpperCase()}`, margin + 48, y + 0.5)

    y += 14

    // Nome da empresa
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(supplier.name || 'Não informado', margin, y)
    y += 7

    if (supplier.trade_name) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(107, 114, 128)
        doc.text(supplier.trade_name, margin, y)
        y += 6
    }

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(107, 114, 128)
    const cnpjFormatted = supplier.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    doc.text(`CNPJ: ${cnpjFormatted}`, margin, y)
    y += 12

    // Divisor
    doc.setDrawColor(229, 231, 235)
    doc.line(margin, y, pageW - margin, y)
    y += 10

    // Dados cadastrais
    doc.setTextColor(107, 114, 128)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('DADOS CADASTRAIS', margin, y)
    y += 7

    const fields = [
        ['Situação cadastral', supplier.situation],
        ['Data de abertura', supplier.opening_date],
        ['Natureza jurídica', supplier.legal_nature],
        ['CNAE principal', supplier.main_cnae],
        ['Município/UF', `${supplier.city || '—'}${supplier.state ? '/' + supplier.state : ''}`],
        ['Endereço', supplier.address],
    ]

    doc.setFont('helvetica', 'normal')
    const colW = (pageW - margin * 2) / 2

    fields.forEach(([label, value], i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        const x = margin + col * colW
        const fy = y + row * 14

        doc.setTextColor(156, 163, 175)
        doc.setFontSize(8)
        doc.text(label || '', x, fy)

        doc.setTextColor(17, 24, 39)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        const val = value || 'Não informado'
        const wrapped = doc.splitTextToSize(val, colW - 5)
        doc.text(wrapped[0], x, fy + 5)
        doc.setFont('helvetica', 'normal')
    })

    y += Math.ceil(fields.length / 2) * 14 + 6

    // Divisor
    doc.setDrawColor(229, 231, 235)
    doc.line(margin, y, pageW - margin, y)
    y += 10

    // Justificativa
    doc.setTextColor(107, 114, 128)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('JUSTIFICATIVA DA CLASSIFICAÇÃO', margin, y)
    y += 7

    doc.setFillColor(249, 250, 251)
    const justText = doc.splitTextToSize(supplier.justification || '—', pageW - margin * 2 - 10)
    doc.roundedRect(margin, y - 3, pageW - margin * 2, justText.length * 5 + 8, 2, 2, 'F')
    doc.setTextColor(55, 65, 81)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(justText, margin + 5, y + 3)
    y += justText.length * 5 + 14

    // Próxima ação
    doc.setTextColor(107, 114, 128)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('PRÓXIMA AÇÃO RECOMENDADA', margin, y)
    y += 7

    doc.setFillColor(230, 241, 251)
    const actionText = doc.splitTextToSize(supplier.next_action || '—', pageW - margin * 2 - 10)
    doc.roundedRect(margin, y - 3, pageW - margin * 2, actionText.length * 5 + 8, 2, 2, 'F')
    doc.setTextColor(12, 68, 124)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(actionText, margin + 5, y + 3)
    y += actionText.length * 5 + 14

    // Footer
    const pageH = doc.internal.pageSize.getHeight()
    doc.setFillColor(243, 244, 246)
    doc.rect(0, pageH - 20, pageW, 20, 'F')
    doc.setTextColor(156, 163, 175)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Ortho — Relatório gerado automaticamente. Documento válido para fins de auditoria interna.', margin, pageH - 8)

    // Download
    const filename = `compliance_${cnpjFormatted.replace(/\D/g, '')}_${new Date().toISOString().slice(0, 10)}.pdf`
    doc.save(filename)
}