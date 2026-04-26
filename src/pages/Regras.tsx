export default function Regras() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-lg font-medium text-gray-900">Regras de compliance</h1>
                <p className="text-sm text-gray-500 mt-0.5">Configure os critérios de homologação de fornecedores</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-lg">
                <div className="space-y-4">

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <div className="text-sm font-medium text-gray-900">CNPJ ativo na Receita Federal</div>
                            <div className="text-xs Ftext-gray-500 mt-0.5">Situação cadastral deve ser ATIVA</div>
                        </div>
                        <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <div className="text-sm font-medium text-gray-900">Dados cadastrais completos</div>
                            <div className="text-xs text-gray-500 mt-0.5">CNAE, natureza jurídica e município preenchidos</div>
                        </div>
                        <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <div className="text-sm font-medium text-gray-900">Bloquear CNPJ baixado</div>
                            <div className="text-xs text-gray-500 mt-0.5">Classifica como Irregular se empresa estiver encerrada</div>
                        </div>
                        <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <div className="text-sm font-medium text-gray-900">Bloquear CNPJ suspenso/inapto</div>
                            <div className="text-xs text-gray-500 mt-0.5">Classifica como Irregular se empresa estiver suspensa</div>
                        </div>
                        <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
                        </div>
                    </div>

                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-400">
                        💡 Novas regras (ESG, débitos trabalhistas, certidões) serão adicionadas em versões futuras. Versão atual: 2.0
                    </div>
                </div>
            </div>
        </div>
    )
}