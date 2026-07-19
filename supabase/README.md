# Supabase database scripts

## Migrations

1. `202607180001_initial_schema.sql`: tables, constraints, indexes, triggers, RLS and grants.
2. `202607180002_generation_credit_functions.sql`: server-only transactional generation and credit functions.

Apply locally with the Supabase CLI:

```bash
supabase init
supabase start
supabase db reset
```

Run `supabase init` only once. If `supabase/config.toml` already exists, skip it.

Apply to the linked remote project:

```bash
supabase init
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## Security model

- Browser clients use the publishable key and authenticated session under RLS.
- `profiles`, `brands`, `projects` and `slides` are readable only by their owner.
- Browser clients cannot mutate credits, generation runs or evidence records.
- Credit lifecycle RPCs are executable only by `service_role` and must be called from the backend.
- Never expose the secret/service-role key through `NEXT_PUBLIC_*` variables.

## Generation lifecycle

1. Backend calls `create_generation_and_reserve_credits` with an idempotency key.
2. Backend calls `mark_generation_running` before invoking the AI provider.
3. On success, persist project/slides and call `complete_generation`.
4. On technical failure, call `fail_generation_and_refund`.

The next integration step is to add Supabase SSR clients to Next.js and call these migrations/RPCs from repositories under `src/server/`.
