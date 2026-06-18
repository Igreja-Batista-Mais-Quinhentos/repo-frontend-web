'use client'
import { useEffect, useState } from 'react'
import { Search, UserPlus, User, Phone, Mail } from 'lucide-react'
import api from '@/lib/api'
import type { Membro } from '@/types'

export default function MembrosPage() {
  const [membros, setMembros] = useState<Membro[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      api.get('/membros/', { params: busca ? { busca } : {} })
        .then(r => setMembros(r.data))
        .finally(() => setLoading(false))
    }, 400)
    return () => clearTimeout(timer)
  }, [busca])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1D2023]">Membros</h1>
          <div className="brand-line w-16 mt-3 rounded-full" />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: '#0B5CAC' }}
        >
          <UserPlus size={16} />
          Novo membro
        </button>
      </div>

      {/* Busca */}
      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F5861]" />
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-black/10 bg-white text-[#1D2023] placeholder-[#4F5861]/50 focus:outline-none focus:border-[#4183C5] transition-colors"
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-16 text-[#4F5861]">Carregando...</div>
      ) : membros.length === 0 ? (
        <div className="text-center py-16 text-[#4F5861]">Nenhum membro encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {membros.map(m => (
            <div key={m.id} className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: '#0B5CAC' }}>
                  {m.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1D2023] text-sm truncate">{m.nome}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    m.status === 'ATIVO'
                      ? 'bg-[#0B5CAC]/10 text-[#0B5CAC]'
                      : 'bg-[#4F5861]/10 text-[#4F5861]'
                  }`}>
                    {m.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                {m.telefone && (
                  <div className="flex items-center gap-2 text-xs text-[#4F5861]">
                    <Phone size={12} />
                    {m.telefone}
                  </div>
                )}
                {m.email && (
                  <div className="flex items-center gap-2 text-xs text-[#4F5861]">
                    <Mail size={12} />
                    {m.email}
                  </div>
                )}
                {!m.telefone && !m.email && (
                  <div className="flex items-center gap-2 text-xs text-[#4F5861]/50">
                    <User size={12} />
                    Sem contato cadastrado
                  </div>
                )}
              </div>

              <div className="brand-line mt-4 rounded-full opacity-30" />
              <p className="text-xs text-[#4F5861]/50 mt-2">
                Desde {new Date(m.data_ingresso).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
