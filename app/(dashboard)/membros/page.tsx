'use client'
import { useEffect, useState } from 'react'
import { Search, UserPlus, Phone, Mail, User } from 'lucide-react'
import api from '@/lib/api'
import type { Membro } from '@/types'
import Modal from '@/components/ui/Modal'
import { Input, Select, BotaoSalvar } from '@/components/ui/Input'

export default function MembrosPage() {
  const [membros, setMembros] = useState<Membro[]>([])
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
