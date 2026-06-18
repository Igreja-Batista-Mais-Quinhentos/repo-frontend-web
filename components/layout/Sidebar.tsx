'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, DollarSign, Bell, Home, LogOut, ChevronRight, Church } from 'lucide-react'

const nav = [
  { href: '/dashboard',   label: 'Início',       icon: Home },
  { href: '/membros',     label: 'Membros',      icon: Users },
  { href: '/financeiro',  label: 'Financeiro',   icon: DollarSign },
  { href: '/comunicacao', label: 'Comunicação',  icon: Bell },
  { href: '/grupos',      label: 'Grupos',       icon: Church },
]

export default function Sidebar() {
  const pathname = usePathname()

  function logout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#1D2023' }}>

      {/* Brilho rosa no topo */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% -10%, rgba(251,98,162,0.18) 0%, transparent 70%)',
      }} />

      {/* Logo */}
      <div className="px-6 pt-8 pb-6 relative z-10">
        <p className="text-[10px] tracking-[0.3em] uppercase mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>
          Igreja Batista
        </p>
        <Image
          src="/logo-light.png"
          alt="†500"
          width={130}
          height={65}
          className="object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        {/* Linha gradiente */}
        <div className="mt-4 h-px w-full" style={{
          background: 'linear-gradient(90deg, #FB62A2 0%, #FAAACB 40%, #4183C5 70%, #0B5CAC 100%)',
        }} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 relative z-10">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative"
              style={active
                ? { background: 'linear-gradient(90deg,rgba(251,98,162,0.15),rgba(11,92,172,0.15))', color: '#fff' }
                : { color: 'rgba(255,255,255,0.45)' }
              }
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #FB62A2, #0B5CAC)' }} />
              )}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                style={active
                  ? { background: 'linear-gradient(135deg, rgba(251,98,162,0.3), rgba(11,92,172,0.3))' }
                  : { background: 'rgba(255,255,255,0.04)' }
                }>
                <Icon size={16} style={{ color: active ? '#FB62A2' : 'rgba(255,255,255,0.4)' }} />
              </div>
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />}
            </Link>
          )
        })}
      </nav>

      {/* Brilho azul no rodapé */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 120%, rgba(11,92,172,0.15) 0%, transparent 70%)',
      }} />

      {/* Logout */}
      <div className="px-3 pb-6 pt-3 border-t relative z-10" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
          style={{ color: 'rgba(255,255,255,0.35)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <LogOut size={15} />
          </div>
          Sair
        </button>
      </div>
    </aside>
  )
}
