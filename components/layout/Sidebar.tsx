'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users, DollarSign, Bell, Home, LogOut, ChevronRight, Church
} from 'lucide-react'

const nav = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/membros', label: 'Membros', icon: Users },
  { href: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/comunicacao', label: 'Comunicação', icon: Bell },
  { href: '/grupos', label: 'Grupos', icon: Church },
]

export default function Sidebar() {
  const pathname = usePathname()

  function logout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: '#1D2023' }}>
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/10">
        <p className="text-xs tracking-widest text-white/40 uppercase mb-1">Igreja Batista</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">†500</h1>
        <div className="brand-line mt-3 rounded-full" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active
                  ? 'text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              style={active ? { background: '#0B5CAC' } : {}}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
