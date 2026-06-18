'use client'
import { useEffect, useState } from 'react'
import { Users, Plus } from 'lucide-react'
import api from '@/lib/api'
import type { Grupo } from '@/types'
import Modal from '@/components/ui/Modal'
import { Input, Textarea, BotaoSalvar } from '@/components/ui/Input'

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({ nome: '', descricao: '' })

  function recarregar() { api.get('/grupos').then(r => setGrupos(r.data)) }

  useEffect(() => {
    api.get('/grupos').then(r => setGrupos(r.data)).finally(() => setLoading(false))
  }, [])

  async function salvar(e: { preventDefault(): void }) {
    e.preventDefault(); setSalvando(true); setErro('')
    try {
      const p = Object.fromEntries(Object.entries(form).filter(([,v]) => v !== ''))
      await api.post('/grupos', p); setModal(false); recarregar()
    } catch (err: unknown) {
      setErro((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro.')
    } finally { setSalvando(false) }
  }

  const gradients = [
    'linear-gradient(135deg,#FB62A2,#FAAACB)',
    'linear-gradient(135deg,#0B5CAC,#4183C5)',
    'linear-gradient(135deg,#4183C5,#FB62A2)',
    'linear-gradient(135deg,#FAAACB,#0B5CAC)',
    'linear-gradient(135deg,#FB62A2,#0B5CAC)',
  ]
  const accentColors = ['#FB62A2','#4183C5','#4183C5','#FAAACB','#FB62A2']

  return (
    <div className="p-8 min-h-screen" style={{ color: '#fff' }}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Grupos</h1>
          <div className="mt-3 h-px w-16" style={{ background: 'linear-gradient(90deg,#FB62A2,#0B5CAC)' }} />
        </div>
        <button onClick={() => { setForm({nome:'',descricao:''}); setErro(''); setModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(90deg,#FB62A2,#0B5CAC)' }}>
          <Plus size={15} /> Novo grupo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>Carregando...</div>
      ) : grupos.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Users size={40} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.15)' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Nenhum grupo cadastrado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {grupos.map((g, i) => {
            const grad = gradients[i % gradients.length]
            const accent = accentColors[i % accentColors.length]
            return (
              <div key={g.id} className="rounded-2xl p-6 relative overflow-hidden transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

                {/* Glow de fundo */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{
                  background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
                  transform: 'translate(30%,-30%)',
                }} />

                {/* Borda superior gradiente */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: grad.replace('135deg','90deg') }} />

                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: grad }}>
                    <Users size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{g.nome}</h3>
                    <p className="text-xs mt-0.5" style={{ color: accent }}>
                      {g.total_membros} membro{g.total_membros !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {g.descricao && (
                  <p className="text-sm leading-relaxed mb-4 relative z-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {g.descricao}
                  </p>
                )}

                <div className="h-px mb-3 relative z-10" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Criado em {new Date(g.criado_em).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )
          })}
        </div>
      )}

      <Modal titulo="Novo Grupo" aberto={modal} onFechar={() => setModal(false)}>
        <form onSubmit={salvar} className="space-y-4">
          <Input label="Nome do grupo *" value={form.nome} onChange={e => setForm(f=>({...f,nome:e.target.value}))} required placeholder="Ex: Jovens +500, Células Norte..." />
          <Textarea label="Descrição" value={form.descricao} onChange={e => setForm(f=>({...f,descricao:e.target.value}))} placeholder="Breve descrição do grupo..." />
          {erro && <p className="text-sm" style={{color:'#FB62A2'}}>{erro}</p>}
          <BotaoSalvar loading={salvando} />
        </form>
      </Modal>
    </div>
  )
}
