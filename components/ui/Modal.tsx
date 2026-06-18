'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  titulo: string
  aberto: boolean
  onFechar: () => void
  children: React.ReactNode
}

export default function Modal({ titulo, aberto, onFechar, children }: Props) {
  useEffect(() => {
    if (aberto) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [aberto])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onFechar} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h2 className="font-semibold text-[#1D2023]">{titulo}</h2>
          <button onClick={onFechar} className="text-[#4F5861] hover:text-[#1D2023] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
