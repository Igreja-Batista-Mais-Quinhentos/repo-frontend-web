interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  children: React.ReactNode
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div>
      <label className="block text-xs text-[#4F5861] mb-1.5 font-medium uppercase tracking-wide">
        {label}
      </label>
      <input
        className="w-full px-3 py-2.5 rounded-xl text-sm border border-black/10 text-[#1D2023] placeholder-[#4F5861]/40 focus:outline-none focus:border-[#4183C5] transition-colors bg-[#FFFBE5]/50"
        {...props}
      />
    </div>
  )
}

export function Select({ label, children, ...props }: SelectProps) {
  return (
    <div>
      <label className="block text-xs text-[#4F5861] mb-1.5 font-medium uppercase tracking-wide">
        {label}
      </label>
      <select
        className="w-full px-3 py-2.5 rounded-xl text-sm border border-black/10 text-[#1D2023] focus:outline-none focus:border-[#4183C5] transition-colors bg-[#FFFBE5]/50"
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export function Textarea({ label, ...props }: TextareaProps) {
  return (
    <div>
      <label className="block text-xs text-[#4F5861] mb-1.5 font-medium uppercase tracking-wide">
        {label}
      </label>
      <textarea
        rows={3}
        className="w-full px-3 py-2.5 rounded-xl text-sm border border-black/10 text-[#1D2023] placeholder-[#4F5861]/40 focus:outline-none focus:border-[#4183C5] transition-colors bg-[#FFFBE5]/50 resize-none"
        {...props}
      />
    </div>
  )
}

export function BotaoSalvar({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50 hover:opacity-90"
      style={{ background: '#0B5CAC' }}
    >
      {loading ? 'Salvando...' : 'Salvar'}
    </button>
  )
}
