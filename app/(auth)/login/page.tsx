'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
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

      {/* ── LADO ESQUERDO — identidade visual ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">

        {/* Textura oficial da marca (Colorswaves) */}
        <Image
          src="/colorswaves.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />

        {/* Overlay escuro para contraste */}
        <div className="absolute inset-0" style={{ background: 'rgba(29,32,35,0.45)' }} />

        {/* Gradiente extra nas bordas */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, transparent 60%, #1D2023 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #1D2023 0%, transparent 40%)',
        }} />

        {/* Conteúdo sobre a textura */}
        <div className="relative z-10 flex flex-col justify-between w-full p-14">

          {/* Logo real da identidade visual */}
          <div>
            <Image
              src="/logo-light.png"
              alt="Igreja Batista +500"
              width={320}
              height={160}
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>

          {/* Verso no rodapé */}
          <div>
            <div className="w-16 h-px mb-5" style={{
              background: 'linear-gradient(90deg, #FB62A2, #0B5CAC)',
            }} />
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Eram águas em que se podia nadar, um rio pelo qual{' '}
              <span className="text-white font-semibold">não se podia passar andando.</span>
            </p>
            <p className="text-white/30 text-xs mt-3 tracking-[0.3em] uppercase">
              Ezequiel 47:5
            </p>
          </div>
        </div>
      </div>

      {/* ── LADO DIREITO — formulário ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 relative">

        {/* Brilho rosa sutil no canto superior */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(251,98,162,0.12) 0%, transparent 70%)',
        }} />
        {/* Brilho azul sutil no canto inferior */}
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(11,92,172,0.15) 0%, transparent 70%)',
        }} />

        <div className="w-full max-w-[360px] relative z-10">

          {/* Logo mobile */}
          <div className="lg:hidden mb-10 flex flex-col items-center">
            <Image
              src="/logo-light.png"
              alt="Igreja Batista +500"
              width={200}
              height={100}
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div className="w-12 h-px mt-5" style={{
              background: 'linear-gradient(90deg, #FB62A2, #0B5CAC)',
            }} />
          </div>

          {/* Isotipo + título */}
          <div className="mb-8">
            <Image
              src="/isotipo-light.png"
              alt=""
              width={36}
              height={36}
              className="mb-5 opacity-60"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <h2 className="text-2xl font-bold text-white mb-1">
              Bem-vindo de volta
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Entre com sua conta para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="pastor@mais500.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#FB62A2'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#FB62A2'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {erro && (
              <p className="text-sm font-medium" style={{ color: '#FB62A2' }}>{erro}</p>
            )}

            {/* Botão com gradiente da marca */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white mt-2 transition-opacity disabled:opacity-50 hover:opacity-90"
              style={{
                background: 'linear-gradient(90deg, #FB62A2 0%, #FAAACB 40%, #4183C5 75%, #0B5CAC 100%)',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Rodapé */}
          <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Igreja Batista +500 · Plataforma interna
          </p>
        </div>
      </div>
    </div>
  )
}
