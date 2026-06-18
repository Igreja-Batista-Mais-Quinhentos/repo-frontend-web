'use client'
import { useEffect, useState } from 'react'
import { Users, DollarSign, TrendingUp, Bell } from 'lucide-react'
import api from '@/lib/api'
import type { ResumoMensal } from '@/types'

interface Card {
  label: string
  value: string
  icon: React.ElementType
  color: string
}

export default function DashboardPage() {
  const [resumo, setResumo] = useState<ResumoMensal | null>(null)
  const [totalMembros, setTotalMembros] = useState<number>(0)
  const mesAtual = new Date().getMonth() + 1
  const anoAtual = new Date().getFullYear()

  useEffect(() => {
    api.get(`/financeiro/resumo?mes=${mesAtual}&ano=${anoAtual}`)
      .then(r => setResumo(r.data)).catch(() => {})
    api.get('/membros/').then(r => setTotalMembros(r.data.length)).catch(() => {})
  }, [mesAtual, anoAtual])

  const cards: Card[] = [
    {
      label: 'Membros ativos',
      value: String(totalMembros),
      icon: Users,
      color: '#0B5CAC',
    },
    {
      label: 'Dízimos do mês',
      value: resumo ? `R$ ${Number(resumo.total_dizimos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—',
      icon: DollarSign,
      color: '#4183C5',
    },
    {
      label: 'Doações do mês',
      value: resumo ? `R$ ${Number(resumo.total_doacoes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—',
      icon: Bell,
      color: '#FB62A2',
    },
    {
      label: 'Saldo do mês',
      value: resumo ? `R$ ${Number(resumo.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—',
      icon: TrendingUp,
      color: Number(resumo?.saldo) >= 0 ? '#0B5CAC' : '#FB62A2',
    },
  ]

  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-[#4F5861] mb-1">{meses[mesAtual - 1]} {anoAtual}</p>
        <h1 className="text-3xl font-bold text-[#1D2023]">Visão Geral</h1>
        <div className="brand-line w-16 mt-3 rounded-full" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#4F5861]">{label}</p>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1D2023]">{value}</p>
          </div>
        ))}
      </div>

      {/* Boas vindas */}
      <div className="rounded-2xl overflow-hidden relative p-8" style={{ background: '#1D2023' }}>
        <div className="gradient-brand-bg absolute inset-0 opacity-10" />
        <div className="relative z-10">
          <p className="text-xs tracking-widest text-white/40 uppercase mb-2">Igreja Batista</p>
          <h2 className="text-2xl font-bold text-white mb-2">†500</h2>
          <div className="brand-line w-24 rounded-full mb-4" />
          <p className="text-white/60 text-sm max-w-md leading-relaxed">
            Eram águas em que se podia nadar, um rio pelo qual <strong className="text-white">não se podia passar andando.</strong>
          </p>
          <p className="text-white/30 text-xs mt-2 tracking-widest">EZEQUIEL 47:5</p>
        </div>
      </div>
    </div>
  )
}
