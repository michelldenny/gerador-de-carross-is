# BrandsDecoded Carousel

Aplicacao Next.js para gerar, revisar, persistir e editar carrosseis com regras editoriais versionadas.

## Configuracao

1. Copie `.env.example` para `.env.local`.
2. Configure as chaves publicas do Supabase e a `SUPABASE_SERVICE_ROLE_KEY` somente no servidor.
3. Use `AI_PROVIDER=mock` para desenvolvimento ou `AI_PROVIDER=gemini` com `GEMINI_API_KEY` para geracao real.
4. Execute `npm install` e `npm run dev`.

## Qualidade

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Os testes remotos de RLS ficam desabilitados por padrao. Use `RUN_SUPABASE_INTEGRATION=true` apenas em um ambiente de teste controlado.

## Seguranca

- O navegador acessa o Supabase somente com a chave publica e RLS.
- Geracao, reserva de creditos, persistencia e estorno passam pela rota server-side autenticada.
- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` ou `GEMINI_API_KEY` em variaveis `NEXT_PUBLIC_*`.
