import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

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
    const emailA = `usera${Date.now()}${rKey}@example.com`
    const emailB = `userb${Date.now()}${rKey}@example.com`
    const password = 'TestPassword123!'

    // 1. Criar Usuário A
    const { data: authA, error: errA } = await clientA.auth.signUp({ email: emailA, password })
    if (errA) {
      if (errA.message.includes('rate limit')) {
        console.warn('Ignorando teste RLS devido a limite de taxa do Supabase Auth Cloud');
        return;
      }
      throw errA
    }
    const userIdA = authA.user?.id
    expect(userIdA).toBeDefined()

    // 2. Criar Usuário B
    const { data: authB, error: errB } = await clientB.auth.signUp({ email: emailB, password })
    if (errB) {
      if (errB.message.includes('rate limit')) {
        console.warn('Ignorando teste RLS devido a limite de taxa do Supabase Auth Cloud');
        return;
      }
      throw errB
    }
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
      // Limpeza
    }
  }, 30000)
})
