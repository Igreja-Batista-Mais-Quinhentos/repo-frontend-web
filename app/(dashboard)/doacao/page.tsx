'use client'
import { useEffect, useState } from 'react'
import { HandCoins, Landmark, Plus } from 'lucide-react'
import api from '@/lib/api'
import type { FundoDoacao, ConfiguracaoDoacao } from '@/types'
import Modal from '@/components/ui/Modal'
import { Input, Textarea, BotaoSalvar } from '@/components/ui/Input'

const formFundoVazio = { key: '', nome: '', descricao: '' }

export default function DoacaoPage() {
  const [fundos, setFundos] = useState<FundoDoacao[]>([])
  const [loading, setLoading] = useState(true)
  const [modalFundo, setModalFundo] = useState(false)
  const [salvandoFundo, setSalvandoFundo] = useState(false)
  const [erroFundo, setErroFundo] = useState('')
  const [formFundo, setFormFundo] = useState(formFundoVazio)

  const [config, setConfig] = useState<ConfiguracaoDoacao>({ pix_key: '', dados_bancarios: '' })
  const [salvandoConfig, setSalvandoConfig] = useState(false)
  const [erroConfig, setErroConfig] = useState('')
  const [okConfig, setOkConfig] = useState(false)

  function recarregarFundos() {
    api.get('/doacao/fundos').then(r => setFundos(r.data))
  }

  useEffect(() => {
    Promise.all([api.get('/doacao/fundos'), api.get('/doacao/config')])
      .then(([f, c]) => { setFundos(f.data); setConfig({ pix_key: c.data.pix_key || '', dados_bancarios: c.data.dados_bancarios || '' }) })
      .finally(() => setLoading(false))
  }, [])

  async function salvarFundo(e: { preventDefault(): void }) {
    e.preventDefault(); setSalvandoFundo(true); setErroFundo('')
    try {
      const p = { ...formFundo, descricao: formFundo.descricao || undefined }
      await api.post('/doacao/fundos', p); setModalFundo(false); recarregarFundos()
    } catch (err: unknown) {
      setErroFundo((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro.')
    } finally { setSalvandoFundo(false) }
  }

  async function salvarConfig(e: { preventDefault(): void }) {
    e.preventDefault(); setSalvandoConfig(true); setErroConfig(''); setOkConfig(false)
    try {
      const p = { pix_key: config.pix_key || undefined, dados_bancarios: config.dados_bancarios || undefined }
      await api.put('/doacao/config', p)
      setOkConfig(true)
    } catch (err: unknown) {
      setErroConfig((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro.')
    } finally { setSalvandoConfig(false) }
  }

  return (
    <div className="p-8 min-h-screen" style={{ color: '#fff' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Doação</h1>
        <div className="mt-3 h-px w-16" style={{ background: 'linear-gradient(90deg,#FB62A2,#0B5CAC)' }} />
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ── FUNDOS ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(11,92,172,0.2)' }}>
                  <HandCoins size={14} style={{ color: '#4183C5' }} />
                </div>
                <h2 className="font-semibold text-white">Fundos</h2>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(65,131,197,0.15)', color: '#4183C5' }}>
                  {fundos.length}
                </span>
              </div>
              <button onClick={() => { setFormFundo(formFundoVazio); setErroFundo(''); setModalFundo(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90"
                style={{ background: 'rgba(65,131,197,0.2)', border: '1px solid rgba(65,131,197,0.3)' }}>
                <Plus size={12} /> Novo
              </button>
            </div>

            <div className="space-y-3">
              {fundos.length === 0 ? (
                <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Nenhum fundo cadastrado.</p>
                </div>
              ) : fundos.map(f => (
                <div key={f.id} className="rounded-2xl p-5 relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,rgba(65,131,197,0.6),transparent)' }} />
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm">{f.nome}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(65,131,197,0.15)', color: '#4183C5' }}>{f.key}</span>
                  </div>
                  {f.descricao && <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.descricao}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* ── CONFIGURAÇÃO PIX/BANCÁRIA ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(251,98,162,0.15)' }}>
                <Landmark size={14} style={{ color: '#FB62A2' }} />
              </div>
              <h2 className="font-semibold text-white">Chave Pix e dados bancários</h2>
            </div>

            <div className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,rgba(251,98,162,0.6),transparent)' }} />
              <form onSubmit={salvarConfig} className="space-y-4">
                <Input label="Chave Pix" value={config.pix_key} onChange={e => setConfig(c=>({...c,pix_key:e.target.value}))} placeholder="Ex: contato@igrejamais500.com.br" />
                <Textarea label="Dados bancários" value={config.dados_bancarios} onChange={e => setConfig(c=>({...c,dados_bancarios:e.target.value}))} placeholder="Banco, agência, conta..." />
                {erroConfig && <p className="text-sm" style={{color:'#FB62A2'}}>{erroConfig}</p>}
                {okConfig && <p className="text-sm" style={{color:'#4183C5'}}>Configuração salva.</p>}
                <BotaoSalvar loading={salvandoConfig} />
              </form>
            </div>
          </div>
        </div>
      )}

      <Modal titulo="Novo Fundo" aberto={modalFundo} onFechar={() => setModalFundo(false)}>
        <form onSubmit={salvarFundo} className="space-y-4">
          <Input label="Chave *" value={formFundo.key} onChange={e => setFormFundo(f=>({...f,key:e.target.value}))} required placeholder="Ex: missoes" />
          <Input label="Nome *" value={formFundo.nome} onChange={e => setFormFundo(f=>({...f,nome:e.target.value}))} required placeholder="Ex: Missões" />
          <Textarea label="Descrição" value={formFundo.descricao} onChange={e => setFormFundo(f=>({...f,descricao:e.target.value}))} placeholder="Descreva o fundo..." />
          {erroFundo && <p className="text-sm" style={{color:'#FB62A2'}}>{erroFundo}</p>}
          <BotaoSalvar loading={salvandoFundo} />
        </form>
      </Modal>
    </div>
  )
}
