'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Plus, Wallet } from 'lucide-react'
import api from '@/lib/api'
import type { ResumoMensal, LancamentoFinanceiro } from '@/types'
import Modal from '@/components/ui/Modal'
import { Input, Select, Textarea, BotaoSalvar } from '@/components/ui/Input'

const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const tipoMeta: Record<string, { label: string; color: string }> = {
  DIZIMO:  { label: 'Dízimo',  color: '#FB62A2' },
  DOACAO:  { label: 'Doação',  color: '#4183C5' },
  DESPESA: { label: 'Despesa', color: '#FAAACB' },
}

export default function FinanceiroPage() {
  const hoje = new Date()
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [ano, setAno] = useState(hoje.getFullYear())
  const [resumo, setResumo] = useState<ResumoMensal | null>(null)
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({ tipo: 'DIZIMO', valor: '', data: '', descricao: '' })

  function recarregar(m: number, a: number) {
    setLoading(true)
    Promise.all([
      api.get('/financeiro/resumo', { params: { mes: m, ano: a } }),
      api.get('/financeiro/lancamentos', { params: { mes: m, ano: a } }),
    ]).then(([r1, r2]) => { setResumo(r1.data); setLancamentos(r2.data) })
     .finally(() => setLoading(false))
  }

  useEffect(() => { recarregar(mes, ano) }, [mes, ano])

  async function salvar(e: { preventDefault(): void }) {
    e.preventDefault(); setSalvando(true); setErro('')
    try {
      await api.post('/financeiro/lancamentos', { ...form, valor: parseFloat(form.valor) })
      setModal(false); recarregar(mes, ano)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setErro(msg || 'Erro ao salvar.')
    } finally { setSalvando(false) }
  }

  const fmt = (v: string | number) =>
    `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  const cards = [
    { label: 'Dízimos',  value: resumo ? fmt(resumo.total_dizimos)  : '—', icon: DollarSign,  color: '#FB62A2' },
    { label: 'Doações',  value: resumo ? fmt(resumo.total_doacoes)  : '—', icon: TrendingUp,  color: '#4183C5' },
    { label: 'Despesas', value: resumo ? fmt(resumo.total_despesas) : '—', icon: TrendingDown, color: '#FAAACB' },
    { label: 'Saldo',    value: resumo ? fmt(resumo.saldo)          : '—', icon: Wallet,       color: Number(resumo?.saldo) >= 0 ? '#0B5CAC' : '#FB62A2' },
  ]

  return (
    <div className="p-8 min-h-screen" style={{ color: '#fff' }}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Financeiro</h1>
          <div className="mt-3 h-px w-16" style={{ background: 'linear-gradient(90deg,#FB62A2,#0B5CAC)' }} />
        </div>
        <button onClick={() => { setForm({tipo:'DIZIMO',valor:'',data:'',descricao:''}); setErro(''); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(90deg,#FB62A2,#0B5CAC)' }}>
          <Plus size={15} /> Novo lançamento
        </button>
      </div>

      {/* Filtro */}
      <div className="flex gap-3 mb-8">
        {[
          <select key="mes" value={mes} onChange={e => setMes(Number(e.target.value))}
            className="px-4 py-2 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
            {meses.map((m,i) => <option key={i} value={i+1} style={{ background: '#1D2023' }}>{m}</option>)}
          </select>,
          <select key="ano" value={ano} onChange={e => setAno(Number(e.target.value))}
            className="px-4 py-2 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
            {[2024,2025,2026,2027].map(a => <option key={a} value={a} style={{ background: '#1D2023' }}>{a}</option>)}
          </select>
        ]}
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,${color}80,transparent)` }} />
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Lista lançamentos */}
      {loading ? (
        <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>Carregando...</div>
      ) : lancamentos.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>Nenhum lançamento neste período.</div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm font-semibold text-white">{meses[mes-1]} {ano}</p>
          </div>
          {lancamentos.map((l, i) => {
            const meta = tipoMeta[l.tipo] || { label: l.tipo, color: '#fff' }
            return (
              <div key={l.id} className="flex items-center gap-4 px-6 py-4"
                style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{l.descricao || meta.label}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{new Date(l.data+'T12:00:00').toLocaleDateString('pt-BR')}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${meta.color}18`, color: meta.color }}>{meta.label}</span>
                <p className="text-sm font-bold" style={{ color: meta.color }}>{fmt(l.valor)}</p>
              </div>
            )
          })}
        </div>
      )}

      <Modal titulo="Novo Lançamento" aberto={modal} onFechar={() => setModal(false)}>
        <form onSubmit={salvar} className="space-y-4">
          <Select label="Tipo *" value={form.tipo} onChange={e => setForm(f=>({...f,tipo:e.target.value}))}>
            <option value="DIZIMO">Dízimo</option>
            <option value="DOACAO">Doação</option>
            <option value="DESPESA">Despesa</option>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Valor (R$) *" type="number" step="0.01" min="0.01" value={form.valor} onChange={e => setForm(f=>({...f,valor:e.target.value}))} required placeholder="0,00" />
            <Input label="Data *" type="date" value={form.data} onChange={e => setForm(f=>({...f,data:e.target.value}))} required />
          </div>
          <Textarea label="Descrição" value={form.descricao} onChange={e => setForm(f=>({...f,descricao:e.target.value}))} placeholder="Detalhes..." />
          {erro && <p className="text-sm" style={{color:'#FB62A2'}}>{erro}</p>}
          <BotaoSalvar loading={salvando} />
        </form>
      </Modal>
    </div>
  )
}
