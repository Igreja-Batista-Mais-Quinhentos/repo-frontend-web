'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import api from '@/lib/api'
import type { ResumoMensal } from '@/types'

const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function DashboardPage() {
  const [resumo, setResumo]       = useState<ResumoMensal | null>(null)
  const [totalMembros, setTotal]  = useState(0)
  const mesAtual = new Date().getMonth() + 1
  const anoAtual = new Date().getFullYear()

  useEffect(() => {
    api.get(`/financeiro/resumo?mes=${mesAtual}&ano=${anoAtual}`).then(r => setResumo(r.data)).catch(() => {})
    api.get('/membros/').then(r => setTotal(r.data.length)).catch(() => {})
  }, [mesAtual, anoAtual])

  const fmt = (v: string | number) =>
    `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  const cards = [
    { label: 'Membros ativos',  value: String(totalMembros), icon: Users,        color: '#FB62A2', glow: 'rgba(251,98,162,0.2)' },
    { label: 'Dízimos do mês',  value: resumo ? fmt(resumo.total_dizimos)  : '—', icon: DollarSign,  color: '#4183C5', glow: 'rgba(65,131,197,0.2)' },
    { label: 'Doações do mês',  value: resumo ? fmt(resumo.total_doacoes)  : '—', icon: TrendingUp,  color: '#FAAACB', glow: 'rgba(250,170,203,0.2)' },
    { label: 'Saldo do mês',    value: resumo ? fmt(resumo.saldo)          : '—', icon: TrendingDown, color: Number(resumo?.saldo) >= 0 ? '#0B5CAC' : '#FB62A2', glow: 'rgba(11,92,172,0.2)' },
  ]

  return (
    <div className="p-8 min-h-screen" style={{ color: '#fff' }}>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {meses[mesAtual - 1]} {anoAtual}
        </p>
        <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
        <div className="mt-3 h-px w-16" style={{
          background: 'linear-gradient(90deg, #FB62A2, #0B5CAC)',
        }} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, glow }) => (
          <div key={label} className="rounded-2xl p-5 relative overflow-hidden transition-transform hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
            {/* Glow de fundo */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
              background: `radial-gradient(circle at 80% 20%, ${glow} 0%, transparent 60%)`,
            }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}20` }}>
                  <Icon size={17} style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            </div>
            {/* Borda superior colorida */}
            <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `${color}60` }} />
          </div>
        ))}
      </div>

      {/* Banner Colorswaves */}
      <div className="rounded-2xl overflow-hidden relative" style={{ minHeight: 200 }}>
        <Image src="/colorswaves.png" alt="" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(15,17,18,0.55)' }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(15,17,18,0.2) 0%, rgba(15,17,18,0.8) 100%)',
        }} />
        <div className="relative z-10 p-8 flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Igreja Batista
            </p>
            <Image src="/logo-light.png" alt="†500" width={180} height={90}
              className="object-contain mb-4"
              style={{ filter: 'brightness(0) invert(1)' }} />
            <div className="h-px w-16 mb-4" style={{
              background: 'linear-gradient(90deg, #FB62A2, #0B5CAC)',
            }} />
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Eram águas em que se podia nadar, um rio pelo qual{' '}
              <strong className="text-white">não se podia passar andando.</strong>
            </p>
            <p className="text-xs mt-3 tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
              EZEQUIEL 47:5
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
