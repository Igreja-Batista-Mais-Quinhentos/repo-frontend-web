'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', data.access_token)
      router.push('/dashboard')
    } catch {
      setErro('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#1D2023' }}>
      {/* Lado esquerdo — identidade */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="gradient-brand-bg absolute inset-0 opacity-20" />
        <div className="relative z-10 text-center">
          <p className="text-xs tracking-widest text-white/40 uppercase mb-2">Igreja Batista</p>
          <h1 className="text-7xl font-bold text-white mb-4">†500</h1>
          <div className="brand-line w-48 mx-auto rounded-full mb-6" />
          <p className="text-white/60 text-sm max-w-xs leading-relaxed">
            Eram águas em que se podia nadar, um rio pelo qual <strong className="text-white">não se podia passar andando.</strong>
          </p>
          <p className="text-white/30 text-xs mt-3 tracking-widest">EZEQUIEL 47:5</p>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden text-center">
            <p className="text-xs tracking-widest text-white/40 uppercase mb-1">Igreja Batista</p>
            <h1 className="text-4xl font-bold text-white">†500</h1>
            <div className="brand-line w-24 mx-auto rounded-full mt-3" />
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">Bem-vindo de volta</h2>
          <p className="text-white/40 text-sm mb-8">Entre com sua conta para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 tracking-wide uppercase">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/20 border border-white/10 focus:outline-none focus:border-[#4183C5] transition-colors"
                style={{ background: '#2a2f33' }}
                placeholder="pastor@mais500.com"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5 tracking-wide uppercase">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/20 border border-white/10 focus:outline-none focus:border-[#4183C5] transition-colors"
                style={{ background: '#2a2f33' }}
                placeholder="••••••••"
              />
            </div>

            {erro && (
              <p className="text-sm text-[#FB62A2]">{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ background: '#0B5CAC' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
