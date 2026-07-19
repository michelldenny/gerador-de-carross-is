import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import fs from 'fs'
import path from 'path'

// Carrega as variáveis de ambiente manualmente do .env
try {
  const envPath = path.resolve(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8')
    envFile.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        const key = match[1]
        let value = (match[2] || '').trim()
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1)
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1)
        }
        process.env[key] = value
      }
    })
  }
} catch (e) {
  console.error('Erro ao ler .env:', e)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

describe('Testes de Isolamento de Dados (RLS) no Supabase', () => {
  beforeAll(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Variáveis de ambiente do Supabase não encontradas. Certifique-se de que o arquivo .env existe e contém NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      )
    }
  })

  it('não deve permitir que um usuário anônimo leia projetos', async () => {
    const anonClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!)
    const { error } = await anonClient.from('projects').select('*')
    
    // A role anon teve seus privilégios revogados nas migrations (revoke select), retornando erro de banco 42501
    expect(error).not.toBeNull()
    expect(error!.code).toBe('42501')
  })

  it('deve garantir isolamento entre dois usuários autenticados', async () => {
    const clientA = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: false },
    })
    const clientB = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: false },
    })

    const rKey = Math.random().toString(36).substring(2, 8)
    const emailA = `usera${Date.now()}${rKey}@gmail.com`
    const emailB = `userb${Date.now()}${rKey}@gmail.com`
    const password = 'TestPassword123!'

    // 1. Criar Usuário A
    const { data: authA, error: errA } = await clientA.auth.signUp({ email: emailA, password })
    if (errA) throw errA
    const userIdA = authA.user?.id
    expect(userIdA).toBeDefined()

    // 2. Criar Usuário B
    const { data: authB, error: errB } = await clientB.auth.signUp({ email: emailB, password })
    if (errB) throw errB
    const userIdB = authB.user?.id
    expect(userIdB).toBeDefined()

    try {
      // 3. Usuário A cria um projeto
      const { data: projectA, error: errProj } = await clientA
        .from('projects')
        .insert({
          user_id: userIdA!,
          title: 'Projeto Secreto do A',
          theme: 'Tema A',
          width: 1080,
          height: 1080,
        })
        .select()
        .single()

      if (errProj) throw errProj
      expect(projectA).toBeDefined()

      // 4. Usuário B tenta ler o projeto do Usuário A
      const { data: readByB, error: errReadByB } = await clientB
        .from('projects')
        .select('*')
        .eq('id', projectA.id)

      expect(errReadByB).toBeNull()
      // O RLS deve filtrar o registro, então o retorno deve ser um array vazio
      expect(readByB).toEqual([])

      // 5. Usuário B tenta atualizar o projeto do Usuário A
      const { data: updateByB, error: errUpdateByB } = await clientB
        .from('projects')
        .update({ title: 'Hackeado' })
        .eq('id', projectA.id)
        .select()

      expect(errUpdateByB).toBeNull()
      expect(updateByB).toEqual([]) // Nenhuma linha deve ser atualizada/retornada

      // 6. Usuário A consegue ler seu próprio projeto
      const { data: readByA, error: errReadByA } = await clientA
        .from('projects')
        .select('*')
        .eq('id', projectA.id)
        .single()

      expect(errReadByA).toBeNull()
      expect(readByA.title).toBe('Projeto Secreto do A')

      // Limpeza: Deletar o projeto criado
      await clientA.from('projects').delete().eq('id', projectA.id)
    } finally {
      // Como não temos a service_role_key, não conseguimos deletar os usuários de auth.users diretamente.
      // No entanto, limpamos o projeto inserido.
    }
  }, 30000) // Aumentando o timeout para 30s devido a chamadas de rede do Supabase
})
