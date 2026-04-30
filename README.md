             
Orthos

Agente de Compliance de Fornecedores

Documentação do Código-Fonte Versão 2.0

Êmile Ferreira de Oliveira

LINK SITE: https://orthos-compliance.vercel.app

Caieiras, SP
2026

Sobre este documento
Esse mini book documenta o código-fonte do Orthos, um Agente de compliance de fornecedores desenvolvido com React, TypeScript e Supabase. O objetivo é explicar de forma clara e direta, como cada parte do sistema funciona da consulta a API até a geração do relatório em PDF.

Palavras-chave
Primárias: Compliance de Fornecedores, Governança Corporativa, Homologação CNPJ, Automação Compliance, Supply Chain 4.0
Tecnológicas: React Vite, Supabase PostgreSQL, BrasilAPI, jsPDF, Tailwind CSS, TypeScript
Jurídico/Gestão: Diligência Administradores, Desjudicialização MPEs, Riscos Ultra Vires, ESG Cadeia Suprimentos, Row Level Security (RLS)

Sumário
Visão Geral e Embasamento
1.1 O porquê do projeto
1.2 Como o sistema funciona
1.2.1 Stack Tecnológica
1.3 Roteiro de desenvolvimento
1.4 Por que investir no Orthos
1.5 Referências Bibliográficas

lib/: A camada de lógica: compliance.ts,

generatePDF.ts, supabase.ts e supabaseHelpers.ts
2.1Interface BrasilAPIResponse

Layout.tsx: A estrutura visual e de navegação

Pages: Às telas da aplicação: Dashboard, Fornecedores, Nova Consulta e Regras

App.tsx: O ponto de entrada que conecta tudo

Visão Geral e Embasamento

O Orthos é uma solução tecnológica que atua na interseção entre o Direito Empresarial e a Gestão de Suprimentos. Seu objetivo é automatizar o diagnóstico de conformidade de CNPJ transformando dados brutos em decisões estratégicas.
1.1 O porquê do projeto
A necessidade deste projeto se embasa na Governança Corporativa, definida como o sistema que dirige e monitora as organizações através de princípios como transparência, equidade e prestação de contas (accountability). O compliance não é apenas seguir a lei, mas garantir que a empresa opere de forma ética e sustentável, protegendo seu valor de mercado e reputação.
Para as Micro e Pequenas Empresas (MPEs), o projeto resolve um gargalo crítico: a prevenção de conflitos e a desjudicialização. A implementação de uma consultoria jurídica preventiva e automatizada reduz custos operacionais e evita que falhas documentais se transformem em causas judiciais. Ao automatizar a consulta de licenças e certidões, o agente garante a “Diligência” necessária aos administradores (o zelo ativo na condução dos negócios). Além disso, o projeto se alinha a Supply Chain 4.0, que preza pela integração de dados e visibilidade de ponta a ponta para aumentar a transparência e reduzir custos de transação.
1.2 Como o sistema funciona

O Orthos funciona como um orquestrador de informações. O usuário insere os dados do fornecedor e o sistema realiza o processamento em tempo real, seguindo cinco etapas:
Input: cadastro de CNPJ via interface ou upload de lista (CSV)
Orquestração: consulta à BrasilAPI para coletar dados da Receita Federal
Motor de Decisão: regras locais analisam os dados contra critérios de compliance pré-definidos
Classificação: o fornecedor é rotulado como Aprovado, Pendente ou Irregular
Output: geração de relatório em PDF para fins de auditoria

Dados BrasilAPI
Decisão
ATIVA + dados completos
✅ Aprovado / Risco Baixo
ATIVA + dados incompletos
⚠️ Pendente / Risco Médio
BAIXADA
❌ Irregular / Risco Alto
SUSPENSA ou INAPTA
❌ Irregular / Risco Alto
CNPJ não encontrado
❌ Irregular / Risco Alto

- Limitações da versão atual (BrasilAPI gratuita): certidões negativas de débitos fiscais, regularidade trabalhista (FGTS/eSocial), licenças ambientais, dívida ativa e critérios ESG ainda não estão disponíveis.
  1.2.1 Stack Tecnológica

Camada
Tecnologia
Frontend
React com Vite 5 e TypeScript
Estilização
Tailwind CSS e componentes shadcn/ui
Backend/BaaS
Supabase (autenticação, PostgreSQL e armazenamento)
Integrações
BrasilAPI — dados públicos da Receita Federal
Relatórios
jsPDF — geração de PDF diretamente no navegador

1.3 Roteiro de desenvolvimento
O desenvolvimento foi dividido em sprints modulares para garantir entrega rápida de valor:
Setup: inicialização com React + Vite e configuração do design system (Tailwind)
Supabase: banco PostgreSQL com tabelas suppliers e compliance_logs, segurança via RLS
Rotas: navegação entre Dashboard, Lista, Consulta, Detalhes e Login
Frontend: tabelas com badges de status e dashboards com KPIs de conformidade
Integração API: conexão com BrasilAPI para automação da coleta de dados cadastrais
Motor de Compliance: regras locais que classificam riscos sem depender de APIs pagas
Gerador de PDF: relatório com selo de compliance para fins de auditoria

1.4 Por que investir no Orthos
No atual cenário empresarial, o compliance deixou de ser um custo para se tornar um ativo estratégico. Empresas com programas de integridade sólidos têm retornos sobre o patrimônio (Retorn On Equity) até 6,5 pontos percentuais maiores do que aquelas que negligenciam a governança.

Diferencial
Impacto
Segurança Jurídica
Protege contra atos ultra vires de fornecedores e riscos de corrupção
Eficiência Operacional
Reduz em até 40% o tempo de homologação, liberando o time de compras
ESG na Prática
Demonstra controle rigoroso sobre a cadeia de suprimentos para investidores

Referências Bibliográficas
LANA, Henrique Avelino. Governança corporativa e compliance: perspectivas brasileiras. 2025.
ALVES, Alexandre Eli; FERNANDES, Aline O. F. Guia Prático de Compliance para MPEs: Estruturação e Prevenção de Conflitos. 2021.
FRETE360. O uso do marketplace digital como solução para a intermediação e eficiência no transporte de cargas. 2025.
TOTVS. Empresas de Logística: as 33 maiores do Brasil e do mundo.

2. lib/compliance.ts
  Este é o coração da regra de negócio do Orthos. Ele é responsável por duas coisas: buscar os dados do CNPJ na BrasilAPI e classificar automaticamente o fornecedor com base nesses dados.

2.1 Interface BrasilAPIResponse
Antes de qualquer lógica, o arquivo define o formato exato dos dados que a API pode retornar, isso é feito através de uma interface TypeScript.

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
capital_social?: number
}

Todos os campos, exceto o CNPJ, são opcionais (indicados pelo ?). Isso reflete na realidade da API pública que nem todo CNPJ tem todos os campos preenchidos, e o sistema precisa lidar com isso sem quebrar.

2.2 fetchCNPJData - A consulta à API
Esta função é responsável por conectar o sistema ao mundo externo. Ela recebe o CNPJ digitado pelo usuário, limpa a formatação e faz a requisição HTTP.

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

O que acontece aqui: o CNPJ é sanitizado com .replace(/\D/g, '')removendo pontos, barras e traços. Em seguida, a função chama a BrasilAPI. Se a resposta não for válida (status HTTP diferente de 2xx) ou se ocorrer qualquer exceção de rede, ela retorna null ao invés de jogar um erro, mantendo o sistema estável.

2.3 classifySupplier - O motor de decisão
Esta é a função mais importante do sistema. Ela recebe os dados brutos da API (ou null, se o CNPJ não for encontrado) e devolve um objeto Supplier completo com status, nível de risco, justificativa e próxima ação recomendada.
A Lógica de classificação segue uma sequência de prioridade são elas:

Condição identificada
Classificação
CNPJ não encontrado (null)
Irregular · Risco Alto
Situação: BAIXADA
Irregular · Risco Alto
Situação: SUSPENSA ou INAPTA
Irregular · Risco Alto
ATIVA + dados completos
Aprovado · Risco Baixo
ATIVA + dados incompletos
Pendente · Risco Médio
Qualquer outra situação
Pendente · Risco Médio

O objeto base é construído antes de qualquer decisão, reunindo todos os dados cadastrais disponíveis. Depois, a função verifica cada caso em sequência com blocos if/return, garantindo que apenas um caminho seja executado.
const situacao = data.descricao_situacao_cadastral?.toUpperCase() || ''
const isAtiva = situacao === 'ATIVA'
const isBaixa = situacao.includes('BAIXA')
const isSuspensa = situacao.includes('SUSPENSA') || situacao.includes('INAPTA')

Para o caso aprovado, o sistema verifica se os três campos críticos estão preenchidos: natureza jurídica, CNAE e município. Se algum falhar, o fornecedor cai para Pendente, exigindo documentação complementar.

3. lib/generatePDF.ts
  Este arquivo é responsável por transformar os dados de um fornecedor em um relatório PDF, pronto para auditoria. A geração acontece inteiramente no navegador, sem servidor, usando a biblioteca jsPDF.
  3.1 Estrutura do relatório
  O PDF é construído de cima para baixo, em blocos sequenciais. Cada bloco usa a variável Y para controlar a posição vertical e avança conforme o conteúdo é adicionado.

Bloco
Descrição
Header azul
Faixa superior com logo Orthos, título e data/hora de geração
Badges de status e risco
Etiquetas coloridas: verde (Aprovado), amarelo (Pendente), vermelho (Irregular)
Identificação da empresa
Razão social, nome fantasia e CNPJ formatado
Dados cadastrais
Grid de 2 colunas com situação, data de abertura, natureza jurídica, CNAE, cidade e endereço
Justificativa
Caixa cinza com o texto explicativo da classificação
Próxima ação
Caixa azul com a recomendação de conduta
Footer
Rodapé com aviso de documento para auditoria interna

3.2 Cores dinâmicas por status
O sistema de cores é controlado por dois objetos que mapeiam cada status para sua cor de texto e cor de fundo:
const statusColor = {
'Aprovado': [59, 109, 17], // Verde escuro
'Pendente': [133, 79, 11], // Âmbar
'Irregular': [163, 45, 45], // Vermelho
}

const statusBg = {
'Aprovado': [234, 243, 222], // Verde claro
'Pendente': [250, 238, 218], // Âmbar claro
'Irregular': [252, 235, 235], // Vermelho claro
}

3.3 Tratamento de texto longo
A justificativa e a próxima ação podem ter textos de tamanhos variados. Para evitar que o conteúdo ultrapasse as margens, o jsPDF oferece o método splitTextToSize(), que divide automaticamente o texto em linhas respeitando a largura disponível. O número de linhas resultantes é usado para calcular a altura do bloco e ajustar oY corretamente.
const justText = doc.splitTextToSize(supplier.justification, pageW - margin _ 2 - 10)
doc.roundedRect(margin, y - 3, pageW - margin _ 2, justText.length _ 5 + 8, 2, 2, 'F')
doc.text(justText, margin + 5, y + 3)
y += justText.length _ 5 + 14

3.4 Nome do arquivo gerado
O nome do arquivo inclui o CNPJ limpo e a data de geração, garantindo que cada relatório seja identificável:
const filename = `compliance_${cnpjFormatted.replace(/\D/g, '')}_${new Date().toISOString().slice(0, 10)}.pdf`
// Exemplo: compliance_12345678000195_2026-04-15.pdf

4. lib/supabase.ts e supabaseHelpers.ts
  Esses dois arquivos formam a camada de persistência do Orthos. Enquanto supabase.ts configura a conexão, supabaseHelpers.ts expõe as operações de banco de dados utilizadas pelas páginas.
  4.1 supabase.ts — Configurando a conexão
  A conexão com o Supabase é criada uma única vez e exportada para reutilização em qualquer parte do sistema. As credenciais são lidas de variáveis de ambiente, seguindo a convenção do Vite:
  import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

As variáveis precisam do prefixo VITE\_ para que o Vite as exponha no contexto do navegador. A chave usada aqui é a anon key, pública por design e a segurança dos dados é garantida pelo RLS (Row Level Security) configurado no Supabase, que impede que um usuário acesse dados de outro.
4.2 supabaseHelpers.ts — As operações de dados
Este arquivo exporta três funções que encapsulam toda a comunicação com o banco de dados:
saveSupplier
Salva ou atualiza um fornecedor no banco. Usa upsert com conflito em user_id + cnpj, o que significa: se já existe um fornecedor com esse CNPJ para esse usuário, o registro é atualizado; caso contrário, um novo é criado.
const { data: { user } } = await supabase.auth.getUser()
if (!user) return null

const payload = { ...supplier, user_id: user.id }

const { data, error } = await supabase
.from('suppliers')
.upsert(payload, { onConflict: 'user_id,cnpj' })
.select()
.single()

O vínculo com user_id é fundamental: cada fornecedor pertence a um usuário específico, o que, combinado com o RLS do Supabase, garante que nenhum usuário veja dados de outro.
loadSuppliers
Busca todos os fornecedores do usuário logado, ordenados do mais recente para o mais antigo. O Supabase aplica o RLS automaticamente, filtrando pelo user_id sem que o frontend precise fazer isso manualmente.
const { data, error } = await supabase
.from('suppliers')
.select('\*')
.order('created_at', { ascending: false })

deleteSupplier
Remove um fornecedor pelo seu id. Retorna true se a operação foi bem-sucedida e false em caso de erro, permitindo que a interface trate cada caso de forma adequada.
const { error } = await supabase
.from('suppliers')
.delete()
.eq('id', id)

if (error) { console.error(error); return false }
return true

4. Layout.tsx
O Layout é o componente que envolve todas as páginas da aplicação. Ele define a estrutura visual padrão: uma barra lateral fixa à esquerda e uma área de conteúdo principal à direita.
4.1 Estrutura visual
O componente usa um flex container dividido em dois: o aside (sidebar de 224px de largura fixa) e o main (que ocupa o restante do espaço e permite rolagem independente).
<div className="flex h-screen bg-gray-100">
  <aside className="w-56 flex-shrink-0 bg-white border-r ...">
    {/* Logo, navegação e logout */}
  </aside>
  <main className="flex-1 overflow-y-auto">
    {children}
  </main>
</div>

4.2 Navegação dinâmica
Os itens de navegação são definidos em um array de objetos, cada um com path, label e um ícone SVG inline. Isso facilita adicionar ou remover rotas sem alterar o JSX principal.
const navItems = [
{ path: '/dashboard', label: 'Dashboard', icon: <svg .../> },
{ path: '/fornecedores',label: 'Fornecedores', icon: <svg .../> },
{ path: '/consulta', label: 'Nova consulta', icon: <svg .../> },
{ path: '/regras', label: 'Regras', icon: <svg .../> },
]

O item ativo é destacado visualmente usando useLocation() do React Router. Se o pathname atual coincidir com o path do item, ele recebe as classes bg-blue-50 text-blue-800 font-medium. Caso contrário, exibe o estilo padrão em cinza.
className={location.pathname === item.path
? 'bg-blue-50 text-blue-800 font-medium'
: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
}

4.3 Logout
O botão de logout chama supabase.auth.signOut() diretamente. Quando o Supabase encerra a sessão, o listener de autenticação em App.tsx detecta a mudança e retorna o usuário para a tela de Login automaticamente, sem necessidade de redirecionamento manual.

5. Pages
  O Orthos possui quatro páginas principais, cada uma com responsabilidade bem definida. Todas são componentes React que buscam dados de forma independente e se comunicam com a lib/ para operações de negócio.
5.1 Dashboard.tsx
  A página inicial da aplicação. Exibe um painel de controle com KPIs de conformidade e as consultas mais recentes.
  Cálculo de KPIs
  Os indicadores são calculados pela função calcKPIs, que recebe a lista completa de fornecedores e retorna contagens por status:
  function calcKPIs(suppliers: Supplier[]): KPIs {
  return {
  total: suppliers.length,
  aprovados: suppliers.filter(s => s.status === 'Aprovado').length,
  pendentes: suppliers.filter(s => s.status === 'Pendente').length,
  irregulares: suppliers.filter(s => s.status === 'Irregular').length,
  }
  }

O percentual de aprovação é calculado como Math.round((aprovados / total) \* 100), exibido em destaque no card central. A tabela mostra apenas os 5 fornecedores mais recentes (slice(0, 5)), com link para a lista completa.
5.2 Fornecedores.tsx
Lista completa de fornecedores com busca, painel de detalhes e ação de exclusão.
Filtro de busca
A busca é feita localmente, sem chamadas adicionais à API. O estado filter é aplicado sobre a lista já carregada:
const filtered = suppliers.filter(s =>
s.name?.toLowerCase().includes(filter.toLowerCase()) ||
s.cnpj.includes(filter)
)

Painel de detalhes
Ao clicar em qualquer linha da tabela, o estado selected é preenchido com os dados daquele fornecedor. Um painel expansível aparece abaixo da tabela com todas as informações detalhadas, justificativa, próxima ação e o botão para gerar o PDF.
Exclusão com otimismo
A exclusão atualiza o estado local imediatamente, antes mesmo de confirmar com o banco, evitando a sensação de lentidão. Se o fornecedor excluído estava selecionado no painel de detalhes, o painel é fechado automaticamente.
5.3 NovaConsulta.tsx
A página de consulta é onde o fluxo principal do Orthos acontece. O usuário digita um CNPJ e o sistema executa a análise completa de conformidade.
Formatação automática do CNPJ
Enquanto o usuário digita, a função formatCNPJ aplica a máscara em tempo real, tornando o campo mais legível e evitando erros de digitação:
function formatCNPJ(value: string) {
const clean = value.replace(/\D/g, '').slice(0, 14)
return clean
.replace(/^(\d{2})(\d)/, '$1.$2')
.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
.replace(/\.(\d{3})(\d)/, '.$1/$2')
.replace(/(\d{4})(\d)/, '$1-$2')
}

Pipeline de execução com feedback visual
O ponto mais sofisticado da página é o sistema de steps animados. Quatro etapas são exibidas com ícones que transitam entre: aguardando (círculo vazio), processando (spinner) e concluído (check verde).
const steps = [
'Consultando Receita Federal...',
'Extraindo dados cadastrais...',
'Aplicando regras de compliance...',
'Classificando fornecedor...',
]

As etapas são controladas por dois estados: currentStep (qual está em execução) e completedSteps (quais já terminaram). Delays artificiais de 400–600ms são inseridos entre as etapas para que o usuário perceba cada passo, mesmo quando a API responde muito rapidamente.
Fluxo completo de consulta
const raw = await fetchCNPJData(clean) // 1. Busca na API
const classified = classifySupplier(raw, clean) // 2. Classifica
const saved = await saveSupplier(classified) // 3. Persiste no Supabase
setResult(saved || classified) // 4. Exibe o resultado

5.4 Regras.tsx
Página informativa que exibe as quatro regras de compliance ativas no sistema. Cada regra é apresentada com nome, descrição e um toggle visual verde, comunicando ao analista quais critérios estão sendo aplicados nas classificações.
Na versão 2.0, as regras são fixas — refletindo as limitações da BrasilAPI gratuita. Regras futuras como ESG, débitos trabalhistas e certidões negativas estão sinalizadas como roadmap para versões posteriores.

6. App.tsx — O ponto de entrada
  O App.tsx é o componente raiz da aplicação. Ele gerencia a autenticação, controla qual tela é exibida e define o roteamento de todas as páginas.
6.1 Gerenciamento de sessão
  Ao ser montado, o componente verifica se existe uma sessão ativa com o Supabase. Esse processo é assíncrono, então um estado loading evita que a interface pisque durante a verificação:
  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
  setSession(session)
  setLoading(false)
  })

const { data: { subscription } } = supabase.auth.onAuthStateChange((\_event, session) => {
setSession(session)
})

return () => subscription.unsubscribe()
}, [])

O listener onAuthStateChange é o mecanismo central de reatividade: sempre que o usuário faz login ou logout, ele dispara e atualiza o estado session. Isso faz com que o App.tsx decida automaticamente o que renderizar sem qualquer lógica adicional de redirecionamento.
6.2 Controle de renderização
O componente usa três casos de renderização bem definidos:
// 1. Verificando sessão — exibe tela de loading
if (loading) return <div>Carregando...</div>

// 2. Sem sessão — exibe Login
if (!session) return <Login />

// 3. Com sessão — exibe Layout + rotas
return (
<Layout>
<Routes>
<Route path="/" element={<Navigate to="/dashboard" replace />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/fornecedores" element={<Fornecedores />} />
<Route path="/consulta" element={<NovaConsulta />} />
<Route path="/regras" element={<Regras />} />
</Routes>
</Layout>
)

A rota raiz / redireciona automaticamente para /dashboard com replace, garantindo que o usuário não acumule entradas no histórico de navegação ao acessar a URL base.
6.3 O papel do Layout no roteamento
O Layout envolve as Routes, o que significa que a sidebar e o header estão sempre presentes enquanto o usuário navega entre páginas. Apenas o conteúdo dentro do <main> muda — as páginas são renderizadas como filhos do Layout via props.children.

7. O fluxo completo — Do clique ao PDF
  Para fechar o minibook, aqui está o caminho completo que um CNPJ percorre dentro do Orthos, do momento em que o usuário pressiona 'Consultar' até o download do relatório:

Etapa
O que acontece

1. NovaConsulta.tsx
  Usuário digita o CNPJ e clica em Consultar
2. compliance.ts
  fetchCNPJData() faz a requisição à BrasilAPI e retorna os dados brutos
3. compliance.ts
  classifySupplier() analisa a situação cadastral e gera status, risco, justificativa e próxima ação
4. supabaseHelpers.ts
  saveSupplier() persiste o fornecedor no banco com vínculo ao user_id
5. NovaConsulta.tsx
  O resultado é exibido na interface com os badges e textos de análise
6. Fornecedores.tsx
  O fornecedor aparece na lista e pode ser selecionado para detalhes
7. generatePDF.ts
  generatePDF() constrói o PDF executivo e dispara o download no navegador

Orthos · Minibook Técnico v2.0 · 2026
Êmile Ferreira de Oliveira · emileferreira.dev@gmail.com
