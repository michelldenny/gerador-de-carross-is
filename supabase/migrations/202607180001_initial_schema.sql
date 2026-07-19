-- Core schema for the carousel generator.
-- Apply with `supabase db push` or through the Supabase SQL editor.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business', 'admin')),
  credit_balance integer not null default 150 check (credit_balance >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  slug text,
  logo_text text,
  logo_url text,
  instagram_handle text,
  website text,
  phone text,
  primary_color text not null default '#0f172a',
  secondary_color text not null default '#64748b',
  accent_color text not null default '#334155',
  background_color text not null default '#ffffff',
  text_color text not null default '#1e293b',
  font_family text not null default 'Plus Jakarta Sans',
  secondary_font_family text,
  default_cta text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, slug)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete set null,
  title text not null check (char_length(title) between 3 and 160),
  theme text not null,
  status text not null default 'draft' check (status in ('draft', 'generating', 'generated', 'published', 'archived', 'failed')),
  creation_mode text not null default 'custom' check (creation_mode in ('quick', 'custom', 'editorial')),
  format text not null default 'vertical' check (format in ('vertical', 'square', 'story')),
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  caption text not null default '',
  hashtags text[] not null default '{}'::text[],
  generation_metadata jsonb,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint editorial_projects_are_vertical
    check (creation_mode <> 'editorial' or (format = 'vertical' and width = 1080 and height = 1350))
);

create or replace function public.validate_project_brand_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.brand_id is not null and not exists (
    select 1 from public.brands b
    where b.id = new.brand_id and b.user_id = new.user_id
  ) then
    raise exception using errcode = '23514', message = 'brand must belong to project owner';
  end if;
  return new;
end;
$$;

create table public.slides (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  position integer not null check (position > 0),
  type text not null check (type in ('cover', 'content', 'comparison', 'quote', 'cta')),
  narrative_role text check (narrative_role in ('hook', 'mechanism', 'evidence', 'expansion', 'application', 'direction', 'closing', 'cta')),
  template_id text not null,
  title text,
  subtitle text,
  body text,
  highlight text,
  cta text,
  list_items text[],
  blocks jsonb not null default '[]'::jsonb,
  image jsonb,
  styles jsonb not null default '{}'::jsonb,
  evidence_ids uuid[] not null default '{}'::uuid[],
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (project_id, position)
);

create table public.generation_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  idempotency_key text not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'rejected', 'failed', 'cancelled')),
  provider text not null default 'mock',
  model text,
  schema_version text,
  ruleset_version text,
  validator_version text,
  briefing jsonb not null,
  output jsonb,
  trace jsonb,
  validation jsonb,
  review jsonb,
  corrections jsonb not null default '[]'::jsonb,
  prompt_tokens integer check (prompt_tokens is null or prompt_tokens >= 0),
  completion_tokens integer check (completion_tokens is null or completion_tokens >= 0),
  estimated_cost_usd numeric(12, 6) check (estimated_cost_usd is null or estimated_cost_usd >= 0),
  reserved_credits integer not null default 0 check (reserved_credits >= 0),
  error_code text,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, idempotency_key)
);

create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  generation_id uuid references public.generation_runs(id) on delete set null,
  entry_type text not null check (entry_type in ('grant', 'purchase', 'reservation', 'refund', 'adjustment')),
  amount integer not null check (amount <> 0),
  balance_after integer not null check (balance_after >= 0),
  idempotency_key text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.evidence_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  generation_id uuid references public.generation_runs(id) on delete cascade,
  claim text not null,
  status text not null default 'unverified' check (status in ('verified', 'unverified', 'rejected', 'user-provided')),
  source_title text,
  source_url text,
  publisher text,
  publication_date date,
  accessed_at timestamptz,
  supported_text text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (status <> 'verified' or (source_title is not null and source_url is not null and accessed_at is not null))
);

create index brands_user_id_idx on public.brands(user_id);
create index projects_user_updated_idx on public.projects(user_id, updated_at desc);
create index projects_brand_id_idx on public.projects(brand_id);
create index slides_project_position_idx on public.slides(project_id, position);
create index generation_runs_user_created_idx on public.generation_runs(user_id, created_at desc);
create index generation_runs_project_id_idx on public.generation_runs(project_id);
create index credit_ledger_user_created_idx on public.credit_ledger(user_id, created_at desc);
create unique index credit_ledger_idempotency_idx
  on public.credit_ledger(user_id, idempotency_key)
  where idempotency_key is not null;
create unique index credit_ledger_generation_reservation_idx
  on public.credit_ledger(generation_id, entry_type)
  where generation_id is not null and entry_type in ('reservation', 'refund');
create index evidence_sources_project_id_idx on public.evidence_sources(project_id);
create index evidence_sources_generation_id_idx on public.evidence_sources(generation_id);

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger brands_set_updated_at before update on public.brands
for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger projects_validate_brand_owner before insert or update of brand_id, user_id on public.projects
for each row execute function public.validate_project_brand_owner();
create trigger slides_set_updated_at before update on public.slides
for each row execute function public.set_updated_at();
create trigger generation_runs_set_updated_at before update on public.generation_runs
for each row execute function public.set_updated_at();
create trigger evidence_sources_set_updated_at before update on public.evidence_sources
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'));

  insert into public.credit_ledger (
    user_id, entry_type, amount, balance_after, idempotency_key, description
  ) values (
    new.id, 'grant', 150, 150, 'signup-grant', 'Créditos iniciais'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.projects enable row level security;
alter table public.slides enable row level security;
alter table public.generation_runs enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.evidence_sources enable row level security;

create policy profiles_select_own on public.profiles
for select to authenticated using ((select auth.uid()) = id);

create policy brands_select_own on public.brands
for select to authenticated using ((select auth.uid()) = user_id);
create policy brands_insert_own on public.brands
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy brands_update_own on public.brands
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy brands_delete_own on public.brands
for delete to authenticated using ((select auth.uid()) = user_id);

create policy projects_select_own on public.projects
for select to authenticated using ((select auth.uid()) = user_id);
create policy projects_insert_own on public.projects
for insert to authenticated with check (
  (select auth.uid()) = user_id
  and (brand_id is null or exists (
    select 1 from public.brands b where b.id = projects.brand_id and b.user_id = (select auth.uid())
  ))
);
create policy projects_update_own on public.projects
for update to authenticated using ((select auth.uid()) = user_id) with check (
  (select auth.uid()) = user_id
  and (brand_id is null or exists (
    select 1 from public.brands b where b.id = projects.brand_id and b.user_id = (select auth.uid())
  ))
);
create policy projects_delete_own on public.projects
for delete to authenticated using ((select auth.uid()) = user_id);

create policy slides_select_via_project on public.slides
for select to authenticated using (
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid()))
);
create policy slides_insert_via_project on public.slides
for insert to authenticated with check (
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid()))
);
create policy slides_update_via_project on public.slides
for update to authenticated using (
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid()))
) with check (
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid()))
);
create policy slides_delete_via_project on public.slides
for delete to authenticated using (
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid()))
);

create policy generation_runs_select_own on public.generation_runs
for select to authenticated using ((select auth.uid()) = user_id);
create policy credit_ledger_select_own on public.credit_ledger
for select to authenticated using ((select auth.uid()) = user_id);
create policy evidence_sources_select_own on public.evidence_sources
for select to authenticated using ((select auth.uid()) = user_id);

revoke all on public.profiles, public.brands, public.projects, public.slides,
  public.generation_runs, public.credit_ledger, public.evidence_sources from anon;

grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.brands, public.projects, public.slides to authenticated;
grant select on public.generation_runs, public.credit_ledger, public.evidence_sources to authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.validate_project_brand_owner() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

comment on table public.generation_runs is 'Auditable execution record for every AI generation attempt.';
comment on table public.credit_ledger is 'Append-oriented credit history. Balance mutations occur through server-only RPCs.';
comment on column public.projects.generation_metadata is 'Trace, validation, review and approval metadata for the latest generation.';
