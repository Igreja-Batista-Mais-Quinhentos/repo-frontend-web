const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const BUCKET = 'conteudo'

export async function uploadImagem(file: File, pasta: string): Promise<string> {
  const nome = `${pasta}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${nome}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': file.type,
    },
    body: file,
  })

  if (!res.ok) throw new Error('Falha ao enviar imagem.')

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${nome}`
}
