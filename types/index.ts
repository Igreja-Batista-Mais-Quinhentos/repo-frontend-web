export type Papel = 'PASTOR' | 'LIDER' | 'TESOUREIRO' | 'MEMBRO'

export interface Usuario {
  id: number
  nome: string
  email: string
  papel: Papel
}

export interface Membro {
  id: number
  nome: string
  cpf?: string
  telefone?: string
  email?: string
  data_nascimento?: string
  estado_civil?: string
  endereco?: string
  foto_url?: string
  data_ingresso: string
  status: 'ATIVO' | 'INATIVO'
}

export interface LancamentoFinanceiro {
  id: number
  tipo: 'DIZIMO' | 'OFERTA' | 'DOACAO' | 'DESPESA' | 'OUTROS'
  valor: string
  data: string
  descricao?: string
  membro_id?: number
  categoria_id?: number
  criado_em: string
}

export interface ResumoMensal {
  mes: number
  ano: number
  total_dizimos: string
  total_doacoes: string
  total_despesas: string
  saldo: string
}

export interface Aviso {
  id: number
  titulo: string
  conteudo: string
  ativo: boolean
  publicado_em: string
  autor_id: number
}

export interface Evento {
  id: number
  titulo: string
  descricao?: string
  local?: string
  data_inicio: string
  data_fim?: string
  cancelado: boolean
  criado_em: string
  total_confirmacoes: number
}

export interface Interessado {
  id: number
  nome: string
  email: string
  telefone?: string
  frequenta?: string
  mensagem?: string
  criado_em: string
}

export interface Grupo {
  id: number
  nome: string
  descricao?: string
  lider_id: number
  criado_em: string
  total_membros: number
}
