'use client'
import { useEffect, useState } from 'react'
import { Bell, Calendar, Heart, Plus, MapPin } from 'lucide-react'
import api from '@/lib/api'
import type { Aviso, Evento } from '@/types'
import Modal from '@/components/ui/Modal'
import { Input, Textarea, BotaoSalvar } from '@/components/ui/Input'

export default function ComunicacaoPage() {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAviso, setModalAviso] = useState(false)
  const [modalEvento, setModalEvento] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [formAviso, setFormAviso] = useState({ titulo: '', conteudo: '' })
  const [formEvento, setFormEvento] = useState({ titulo: '', descricao: '', local: '', data_inicio: '', data_fim: '' })

  function recarregar() {
    Promise.all([api.get('/comunicacao/avisos'), api.get('/comunicacao/eventos')])
      .then(([a, e]) => { setAvisos(a.data); setEventos(e.data) })
  }

  useEffect(() => {
    Promise.all([api.get('/comunicacao/avisos'), api.get('/comunicacao/eventos')])
      .then(([a, e]) => { setAvisos(a.data); setEventos(e.data) })
      .finally(() => setLoading(false))
  }, [])

  async function salvarAviso(e: { preventDefault(): void }) {
    e.preventDefault(); setSalvando(true); setErro('')
    try { await api.post('/comunicacao/avisos', formAviso); setModalAviso(false); recarregar() }
    catch (err: unknown) {
      setErro((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro.')
    } finally { setSalvando(false) }
  }

  async function salvarEvento(e: { preventDefault(): void }) {
    e.preventDefault(); setSalvando(true); setErro('')
    try {
      const p = Object.fromEntries(Object.entries(formEvento).filter(([,v]) => v !== ''))
      await api.post('/comunicacao/eventos', p); setModalEvento(false); recarregar()
    } catch (err: unknown) {
      setErro((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro.')
    } finally { setSalvando(false) }
  }

  return (
    <div className="p-8 min-h-screen" style={{ color: '#fff' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Comunicação</h1>
        <div className="mt-3 h-px w-16" style={{ background: 'linear-gradient(90deg,#FB62A2,#0B5CAC)' }} />
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ── AVISOS ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(11,92,172,0.2)' }}>
                  <Bell size={14} style={{ color: '#4183C5' }} />
                </div>
                <h2 className="font-semibold text-white">Avisos</h2>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(65,131,197,0.15)', color: '#4183C5' }}>
                  {avisos.length}
                </span>
              </div>
              <button onClick={() => { setFormAviso({titulo:'',conteudo:''}); setErro(''); setModalAviso(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90"
                style={{ background: 'rgba(65,131,197,0.2)', border: '1px solid rgba(65,131,197,0.3)' }}>
                <Plus size={12} /> Novo
              </button>
            </div>

            <div className="space-y-3">
              {avisos.length === 0 ? (
                <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Nenhum aviso ativo.</p>
                </div>
              ) : avisos.map(a => (
                <div key={a.id} className="rounded-2xl p-5 relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,rgba(65,131,197,0.6),transparent)' }} />
                  <h3 className="font-semibold text-white text-sm mb-2">{a.titulo}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{a.conteudo}</p>
                  <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {new Date(a.publicado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── EVENTOS ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(251,98,162,0.15)' }}>
                  <Calendar size={14} style={{ color: '#FB62A2' }} />
                </div>
                <h2 className="font-semibold text-white">Eventos</h2>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,98,162,0.12)', color: '#FB62A2' }}>
                  {eventos.length}
                </span>
              </div>
              <button onClick={() => { setFormEvento({titulo:'',descricao:'',local:'',data_inicio:'',data_fim:''}); setErro(''); setModalEvento(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90"
                style={{ background: 'rgba(251,98,162,0.15)', border: '1px solid rgba(251,98,162,0.25)' }}>
                <Plus size={12} /> Novo
              </button>
            </div>

            <div className="space-y-3">
              {eventos.length === 0 ? (
                <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Nenhum evento agendado.</p>
                </div>
              ) : eventos.map(ev => (
                <div key={ev.id} className="rounded-2xl p-5 relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,rgba(251,98,162,0.6),transparent)' }} />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm mb-1">{ev.titulo}</h3>
                      {ev.descricao && <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{ev.descricao}</p>}
                      {ev.local && (
                        <p className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          <MapPin size={11} />{ev.local}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold" style={{ color: '#FB62A2' }}>
                        {new Date(ev.data_inicio).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(ev.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Heart size={11} style={{ color: '#FB62A2' }} />
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{ev.total_confirmacoes} confirmações</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal titulo="Novo Aviso" aberto={modalAviso} onFechar={() => setModalAviso(false)}>
        <form onSubmit={salvarAviso} className="space-y-4">
          <Input label="Título *" value={formAviso.titulo} onChange={e => setFormAviso(f=>({...f,titulo:e.target.value}))} required placeholder="Ex: Culto especial de domingo" />
          <Textarea label="Mensagem *" value={formAviso.conteudo} onChange={e => setFormAviso(f=>({...f,conteudo:e.target.value}))} required placeholder="Digite o aviso..." />
          {erro && <p className="text-sm" style={{color:'#FB62A2'}}>{erro}</p>}
          <BotaoSalvar loading={salvando} />
        </form>
      </Modal>

      <Modal titulo="Novo Evento" aberto={modalEvento} onFechar={() => setModalEvento(false)}>
        <form onSubmit={salvarEvento} className="space-y-4">
          <Input label="Título *" value={formEvento.titulo} onChange={e => setFormEvento(f=>({...f,titulo:e.target.value}))} required placeholder="Ex: Retiro de jovens" />
          <Textarea label="Descrição" value={formEvento.descricao} onChange={e => setFormEvento(f=>({...f,descricao:e.target.value}))} placeholder="Detalhes do evento..." />
          <Input label="Local" value={formEvento.local} onChange={e => setFormEvento(f=>({...f,local:e.target.value}))} placeholder="Ex: Salão principal" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Início *" type="datetime-local" value={formEvento.data_inicio} onChange={e => setFormEvento(f=>({...f,data_inicio:e.target.value}))} required />
            <Input label="Fim" type="datetime-local" value={formEvento.data_fim} onChange={e => setFormEvento(f=>({...f,data_fim:e.target.value}))} />
          </div>
          {erro && <p className="text-sm" style={{color:'#FB62A2'}}>{erro}</p>}
          <BotaoSalvar loading={salvando} />
        </form>
      </Modal>
    </div>
  )
}
