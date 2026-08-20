'use client'
import { useEffect, useState } from 'react'
import { Newspaper, Church, Plus, Image as ImageIcon } from 'lucide-react'
import api from '@/lib/api'
import { uploadImagem } from '@/lib/storage'
import type { Ministerio, Noticia } from '@/types'
import Modal from '@/components/ui/Modal'
import { Input, Textarea, BotaoSalvar } from '@/components/ui/Input'

const formMinisterioVazio = { nome: '', tag: '', descricao: '', lider: '', quando: '', foto_url: '' }
const formNoticiaVazio = { categoria: '', titulo: '', resumo: '', corpo: '', foto_url: '' }

export default function ConteudoPage() {
  const [ministerios, setMinisterios] = useState<Ministerio[]>([])
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [modalMinisterio, setModalMinisterio] = useState(false)
  const [modalNoticia, setModalNoticia] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [erro, setErro] = useState('')
  const [formMinisterio, setFormMinisterio] = useState(formMinisterioVazio)
  const [formNoticia, setFormNoticia] = useState(formNoticiaVazio)

  function recarregar() {
    Promise.all([api.get('/conteudo/ministerios'), api.get('/conteudo/noticias')])
      .then(([m, n]) => { setMinisterios(m.data); setNoticias(n.data) })
  }

  useEffect(() => {
    Promise.all([api.get('/conteudo/ministerios'), api.get('/conteudo/noticias')])
      .then(([m, n]) => { setMinisterios(m.data); setNoticias(n.data) })
      .finally(() => setLoading(false))
  }, [])

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>, aplicar: (url: string) => void) {
    const file = e.target.files?.[0]
    if (!file) return
    setEnviandoFoto(true); setErro('')
    try {
      const url = await uploadImagem(file, 'conteudo')
      aplicar(url)
    } catch {
      setErro('Não foi possível enviar a imagem.')
    } finally { setEnviandoFoto(false) }
  }

  async function salvarMinisterio(e: { preventDefault(): void }) {
    e.preventDefault(); setSalvando(true); setErro('')
    try {
      const p = { ...formMinisterio, lider: formMinisterio.lider || undefined, quando: formMinisterio.quando || undefined, foto_url: formMinisterio.foto_url || undefined }
      await api.post('/conteudo/ministerios', p); setModalMinisterio(false); recarregar()
    } catch (err: unknown) {
      setErro((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro.')
    } finally { setSalvando(false) }
  }

  async function salvarNoticia(e: { preventDefault(): void }) {
    e.preventDefault(); setSalvando(true); setErro('')
    try {
      const p = { ...formNoticia, resumo: formNoticia.resumo || undefined, foto_url: formNoticia.foto_url || undefined }
      await api.post('/conteudo/noticias', p); setModalNoticia(false); recarregar()
    } catch (err: unknown) {
      setErro((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro.')
    } finally { setSalvando(false) }
  }

  return (
    <div className="p-8 min-h-screen" style={{ color: '#fff' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Conteúdo</h1>
        <div className="mt-3 h-px w-16" style={{ background: 'linear-gradient(90deg,#FB62A2,#0B5CAC)' }} />
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ── MINISTÉRIOS ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(11,92,172,0.2)' }}>
                  <Church size={14} style={{ color: '#4183C5' }} />
                </div>
                <h2 className="font-semibold text-white">Ministérios</h2>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(65,131,197,0.15)', color: '#4183C5' }}>
                  {ministerios.length}
                </span>
              </div>
              <button onClick={() => { setFormMinisterio(formMinisterioVazio); setErro(''); setModalMinisterio(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90"
                style={{ background: 'rgba(65,131,197,0.2)', border: '1px solid rgba(65,131,197,0.3)' }}>
                <Plus size={12} /> Novo
              </button>
            </div>

            <div className="space-y-3">
              {ministerios.length === 0 ? (
                <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Nenhum ministério cadastrado.</p>
                </div>
              ) : ministerios.map(m => (
                <div key={m.id} className="rounded-2xl p-5 relative overflow-hidden flex gap-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,rgba(65,131,197,0.6),transparent)' }} />
                  {m.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.foto_url} alt={m.nome} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <ImageIcon size={18} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{m.nome}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(65,131,197,0.15)', color: '#4183C5' }}>{m.tag}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{m.descricao}</p>
                    {(m.lider || m.quando) && (
                      <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {m.lider}{m.lider && m.quando && ' · '}{m.quando}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── NOTÍCIAS ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(251,98,162,0.15)' }}>
                  <Newspaper size={14} style={{ color: '#FB62A2' }} />
                </div>
                <h2 className="font-semibold text-white">Notícias</h2>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,98,162,0.12)', color: '#FB62A2' }}>
                  {noticias.length}
                </span>
              </div>
              <button onClick={() => { setFormNoticia(formNoticiaVazio); setErro(''); setModalNoticia(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90"
                style={{ background: 'rgba(251,98,162,0.15)', border: '1px solid rgba(251,98,162,0.25)' }}>
                <Plus size={12} /> Nova
              </button>
            </div>

            <div className="space-y-3">
              {noticias.length === 0 ? (
                <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Nenhuma notícia publicada.</p>
                </div>
              ) : noticias.map(n => (
                <div key={n.id} className="rounded-2xl p-5 relative overflow-hidden flex gap-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,rgba(251,98,162,0.6),transparent)' }} />
                  {n.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.foto_url} alt={n.titulo} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <ImageIcon size={18} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(251,98,162,0.15)', color: '#FB62A2' }}>{n.categoria}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{n.titulo}</h3>
                    {n.resumo && <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{n.resumo}</p>}
                    <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {new Date(n.publicado_em).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal titulo="Novo Ministério" aberto={modalMinisterio} onFechar={() => setModalMinisterio(false)}>
        <form onSubmit={salvarMinisterio} className="space-y-4">
          <Input label="Nome *" value={formMinisterio.nome} onChange={e => setFormMinisterio(f=>({...f,nome:e.target.value}))} required placeholder="Ex: Ministério de Louvor" />
          <Input label="Tag *" value={formMinisterio.tag} onChange={e => setFormMinisterio(f=>({...f,tag:e.target.value}))} required placeholder="Ex: Música" />
          <Textarea label="Descrição *" value={formMinisterio.descricao} onChange={e => setFormMinisterio(f=>({...f,descricao:e.target.value}))} required placeholder="Descreva o ministério..." />
          <Input label="Líder" value={formMinisterio.lider} onChange={e => setFormMinisterio(f=>({...f,lider:e.target.value}))} placeholder="Ex: João Silva" />
          <Input label="Quando" value={formMinisterio.quando} onChange={e => setFormMinisterio(f=>({...f,quando:e.target.value}))} placeholder="Ex: Domingos às 18h" />
          <Input label="Foto" type="file" accept="image/*" onChange={e => handleFoto(e, url => setFormMinisterio(f=>({...f,foto_url:url})))} />
          {enviandoFoto && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Enviando imagem...</p>}
          {erro && <p className="text-sm" style={{color:'#FB62A2'}}>{erro}</p>}
          <BotaoSalvar loading={salvando} />
        </form>
      </Modal>

      <Modal titulo="Nova Notícia" aberto={modalNoticia} onFechar={() => setModalNoticia(false)}>
        <form onSubmit={salvarNoticia} className="space-y-4">
          <Input label="Categoria *" value={formNoticia.categoria} onChange={e => setFormNoticia(f=>({...f,categoria:e.target.value}))} required placeholder="Ex: Evento" />
          <Input label="Título *" value={formNoticia.titulo} onChange={e => setFormNoticia(f=>({...f,titulo:e.target.value}))} required placeholder="Ex: Retiro de jovens 2026" />
          <Textarea label="Resumo" value={formNoticia.resumo} onChange={e => setFormNoticia(f=>({...f,resumo:e.target.value}))} placeholder="Resumo curto para a listagem..." />
          <Textarea label="Corpo *" value={formNoticia.corpo} onChange={e => setFormNoticia(f=>({...f,corpo:e.target.value}))} required placeholder="Texto completo da notícia..." />
          <Input label="Foto" type="file" accept="image/*" onChange={e => handleFoto(e, url => setFormNoticia(f=>({...f,foto_url:url})))} />
          {enviandoFoto && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Enviando imagem...</p>}
          {erro && <p className="text-sm" style={{color:'#FB62A2'}}>{erro}</p>}
          <BotaoSalvar loading={salvando} />
        </form>
      </Modal>
    </div>
  )
}
