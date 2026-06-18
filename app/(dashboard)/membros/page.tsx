'use client'
import { useEffect, useState } from 'react'
import { Search, UserPlus, Phone, Mail, User, Heart, MessageSquare } from 'lucide-react'
import api from '@/lib/api'
import type { Membro, Interessado } from '@/types'
import Modal from '@/components/ui/Modal'
import { Input, Select, BotaoSalvar } from '@/components/ui/Input'

export default function MembrosPage() {
  const [aba, setAba] = useState<'membros' | 'interessados'>('membros')
  const [membros, setMembros] = useState<Membro[]>([])
  const [interessados, setInteressados] = useState<Interessado[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({ nome:'', telefone:'', email:'', cpf:'', data_nascimento:'', estado_civil:'', endereco:'' })

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      api.get('/membros/', { params: busca ? { busca } : {} })
        .then(r => setMembros(r.data)).finally(() => setLoading(false))
    }, 400)
    return () => clearTimeout(t)
  }, [busca])

  useEffect(() => {
    api.get('/interessados').then(r => setInteressados(r.data)).catch(() => {})
  }, [])

  function abrirModal() {
    setForm({ nome:'', telefone:'', email:'', cpf:'', data_nascimento:'', estado_civil:'', endereco:'' })
    setErro('')
    setModal(true)
  }

  async function salvar(e: { preventDefault(): void }) {
    e.preventDefault()
    setSalvando(true); setErro('')
    try {
      const p = Object.fromEntries(Object.entries(form).filter(([,v]) => v !== ''))
      await api.post('/membros/', p)
      setModal(false)
      const r = await api.get('/membros/')
      setMembros(r.data)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setErro(msg || 'Erro ao salvar.')
    } finally { setSalvando(false) }
  }

  const avatarColors = ['#FB62A2','#4183C5','#0B5CAC','#FAAACB']

  return (
    <div className="p-8 min-h-screen" style={{ color: '#fff' }}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Membros</h1>
          <div className="mt-3 h-px w-16" style={{ background: 'linear-gradient(90deg,#FB62A2,#0B5CAC)' }} />
        </div>
        <button onClick={abrirModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(90deg,#FB62A2,#0B5CAC)' }}>
          <UserPlus size={15} /> Novo membro
        </button>
      </div>

      {/* Abas */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={() => setAba('membros')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={aba === 'membros'
            ? { background: 'linear-gradient(90deg,rgba(251,98,162,0.2),rgba(11,92,172,0.2))', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            : { color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }}>
          <User size={14} /> Membros
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(251,98,162,0.2)', color: '#FB62A2' }}>{membros.length}</span>
        </button>
        <button onClick={() => setAba('interessados')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={aba === 'interessados'
            ? { background: 'linear-gradient(90deg,rgba(251,98,162,0.2),rgba(11,92,172,0.2))', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            : { color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }}>
          <Heart size={14} /> Interessados
          {interessados.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(251,98,162,0.25)', color: '#FB62A2' }}>{interessados.length}</span>
          )}
        </button>
      </div>

      {aba === 'membros' ? (
        <>
          <div className="relative mb-6 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input value={busca} onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por nome ou telefone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
          </div>

          {loading ? (
            <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>Carregando...</div>
          ) : membros.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>Nenhum membro encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {membros.map((m, i) => {
                const cor = avatarColors[i % avatarColors.length]
                return (
                  <div key={m.id} className="rounded-2xl p-5 transition-all hover:-translate-y-0.5 relative overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,${cor}80,transparent)` }} />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${cor},${cor}80)` }}>
                        {m.nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{m.nome}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={m.status === 'ATIVO'
                            ? { background: 'rgba(251,98,162,0.15)', color: '#FB62A2' }
                            : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>
                          {m.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {m.telefone && <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}><Phone size={12}/>{m.telefone}</div>}
                      {m.email    && <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}><Mail size={12}/>{m.email}</div>}
                      {!m.telefone && !m.email && <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}><User size={12}/>Sem contato</div>}
                    </div>
                    <div className="mt-4 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Desde {new Date(m.data_ingresso).toLocaleDateString('pt-BR')}</p>
                  </div>
                )
              })}
            </div>
          )}
        </>
      ) : (
        /* ── ABA INTERESSADOS ── */
        interessados.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Heart size={40} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.1)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Nenhum interessado ainda.</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>Quando alguém preencher o formulário do site, aparecerá aqui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {interessados.map((p, i) => (
              <div key={p.id} className="rounded-2xl p-5 relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,rgba(251,98,162,0.5),transparent)' }} />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg,#FB62A2,#FAAACB)` }}>
                    {p.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{p.nome}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,98,162,0.12)', color: '#FB62A2' }}>
                      {p.frequenta === 'sim' ? 'Já frequenta' : 'Ainda não frequenta'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  {p.telefone && <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}><Phone size={12}/>{p.telefone}</div>}
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}><Mail size={12}/>{p.email}</div>
                </div>
                {p.mensagem && (
                  <div className="rounded-lg p-2.5 mb-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-start gap-1.5">
                      <MessageSquare size={11} className="mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.mensagem}</p>
                    </div>
                  </div>
                )}
                <div className="h-px mb-2" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {new Date(p.criado_em).toLocaleDateString('pt-BR')} às {new Date(p.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )
      )}

      <Modal titulo="Novo Membro" aberto={modal} onFechar={() => setModal(false)}>
        <form onSubmit={salvar} className="space-y-4">
          <Input label="Nome completo *" value={form.nome} onChange={e => setForm(f=>({...f,nome:e.target.value}))} required placeholder="Ex: João da Silva" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Telefone" value={form.telefone} onChange={e => setForm(f=>({...f,telefone:e.target.value}))} placeholder="(11) 99999-9999" />
            <Input label="CPF" value={form.cpf} onChange={e => setForm(f=>({...f,cpf:e.target.value}))} placeholder="000.000.000-00" />
          </div>
          <Input label="E-mail" type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="joao@email.com" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nascimento" type="date" value={form.data_nascimento} onChange={e => setForm(f=>({...f,data_nascimento:e.target.value}))} />
            <Select label="Estado civil" value={form.estado_civil} onChange={e => setForm(f=>({...f,estado_civil:e.target.value}))}>
              <option value="">Selecionar</option>
              <option value="SOLTEIRO">Solteiro(a)</option>
              <option value="CASADO">Casado(a)</option>
              <option value="DIVORCIADO">Divorciado(a)</option>
              <option value="VIUVO">Viúvo(a)</option>
            </Select>
          </div>
          <Input label="Endereço" value={form.endereco} onChange={e => setForm(f=>({...f,endereco:e.target.value}))} placeholder="Rua, número, bairro" />
          {erro && <p className="text-sm" style={{color:'#FB62A2'}}>{erro}</p>}
          <BotaoSalvar loading={salvando} />
        </form>
      </Modal>
    </div>
  )
}
