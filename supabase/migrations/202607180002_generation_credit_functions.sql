-- Transactional server-only functions for generation lifecycle and credits.

create or replace function public.create_generation_and_reserve_credits(
  p_user_id uuid,
  p_idempotency_key text,
  p_credits integer,
  p_briefing jsonb,
  p_provider text default 'mock',
  p_model text default null
)
returns public.generation_runs
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_existing public.generation_runs;
  v_balance integer;
  v_run public.generation_runs;
begin
  if p_user_id is null then
    raise exception using errcode = '22004', message = 'user_id is required';
  end if;
  if p_idempotency_key is null or char_length(trim(p_idempotency_key)) < 8 then
    raise exception using errcode = '22023', message = 'invalid idempotency key';
  end if;
  if p_credits <= 0 then
    raise exception using errcode = '22023', message = 'credits must be positive';
  end if;

  select * into v_existing
  from public.generation_runs
  where user_id = p_user_id and idempotency_key = p_idempotency_key;
  if found then
    return v_existing;
  end if;

  select credit_balance into v_balance
  from public.profiles
  where id = p_user_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'profile not found';
  end if;

  -- Recheck after acquiring the profile lock to make concurrent retries idempotent.
  select * into v_existing
  from public.generation_runs
  where user_id = p_user_id and idempotency_key = p_idempotency_key;
  if found then
    return v_existing;
  end if;

  if v_balance < p_credits then
    raise exception using errcode = 'P0001', message = 'insufficient credits';
  end if;

  insert into public.generation_runs (
    user_id, idempotency_key, status, provider, model, briefing, reserved_credits
  ) values (
    p_user_id, p_idempotency_key, 'queued', p_provider, p_model, p_briefing, p_credits
  ) returning * into v_run;

  update public.profiles
  set credit_balance = credit_balance - p_credits
  where id = p_user_id
  returning credit_balance into v_balance;

  insert into public.credit_ledger (
    user_id, generation_id, entry_type, amount, balance_after, idempotency_key, description
  ) values (
    p_user_id, v_run.id, 'reservation', -p_credits, v_balance,
    'reserve:' || p_idempotency_key, 'Reserva para geração de carrossel'
  );

  return v_run;
end;
$$;

create or replace function public.mark_generation_running(p_generation_id uuid)
returns public.generation_runs
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.generation_runs;
begin
  if not exists (
    select 1
    from public.generation_runs g
    join public.projects p on p.id = p_project_id and p.user_id = g.user_id
    where g.id = p_generation_id
  ) then
    raise exception using errcode = '23514', message = 'project and generation owners must match';
  end if;

  update public.generation_runs
  set status = 'running', started_at = coalesce(started_at, timezone('utc', now()))
  where id = p_generation_id and status = 'queued'
  returning * into v_run;

  if not found then
    raise exception using errcode = 'P0002', message = 'queued generation not found';
  end if;
  return v_run;
end;
$$;

create or replace function public.complete_generation(
  p_generation_id uuid,
  p_project_id uuid,
  p_output jsonb,
  p_trace jsonb,
  p_validation jsonb,
  p_review jsonb,
  p_corrections jsonb default '[]'::jsonb,
  p_prompt_tokens integer default null,
  p_completion_tokens integer default null,
  p_estimated_cost_usd numeric default null
)
returns public.generation_runs
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.generation_runs;
begin
  update public.generation_runs
  set project_id = p_project_id,
      status = 'completed',
      output = p_output,
      trace = p_trace,
      validation = p_validation,
      review = p_review,
      corrections = coalesce(p_corrections, '[]'::jsonb),
      prompt_tokens = p_prompt_tokens,
      completion_tokens = p_completion_tokens,
      estimated_cost_usd = p_estimated_cost_usd,
      completed_at = timezone('utc', now()),
      error_code = null,
      error_message = null
  where id = p_generation_id and status in ('queued', 'running')
  returning * into v_run;

  if not found then
    raise exception using errcode = 'P0002', message = 'active generation not found';
  end if;
  return v_run;
end;
$$;

create or replace function public.fail_generation_and_refund(
  p_generation_id uuid,
  p_error_code text,
  p_error_message text
)
returns public.generation_runs
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.generation_runs;
  v_reservation public.credit_ledger;
  v_balance integer;
begin
  select * into v_run
  from public.generation_runs
  where id = p_generation_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'generation not found';
  end if;
  if v_run.status in ('completed', 'failed', 'cancelled') then
    return v_run;
  end if;

  select * into v_reservation
  from public.credit_ledger
  where generation_id = p_generation_id and entry_type = 'reservation';

  if found and not exists (
    select 1 from public.credit_ledger
    where generation_id = p_generation_id and entry_type = 'refund'
  ) then
    update public.profiles
    set credit_balance = credit_balance + abs(v_reservation.amount)
    where id = v_run.user_id
    returning credit_balance into v_balance;

    insert into public.credit_ledger (
      user_id, generation_id, entry_type, amount, balance_after, idempotency_key, description
    ) values (
      v_run.user_id, p_generation_id, 'refund', abs(v_reservation.amount), v_balance,
      'refund:' || v_run.idempotency_key, 'Reembolso por falha técnica'
    );
  end if;

  update public.generation_runs
  set status = 'failed',
      error_code = left(p_error_code, 120),
      error_message = left(p_error_message, 2000),
      completed_at = timezone('utc', now())
  where id = p_generation_id
  returning * into v_run;

  return v_run;
end;
$$;

revoke all on function public.create_generation_and_reserve_credits(uuid, text, integer, jsonb, text, text) from public, anon, authenticated;
revoke all on function public.mark_generation_running(uuid) from public, anon, authenticated;
revoke all on function public.complete_generation(uuid, uuid, jsonb, jsonb, jsonb, jsonb, jsonb, integer, integer, numeric) from public, anon, authenticated;
revoke all on function public.fail_generation_and_refund(uuid, text, text) from public, anon, authenticated;

grant execute on function public.create_generation_and_reserve_credits(uuid, text, integer, jsonb, text, text) to service_role;
grant execute on function public.mark_generation_running(uuid) to service_role;
grant execute on function public.complete_generation(uuid, uuid, jsonb, jsonb, jsonb, jsonb, jsonb, integer, integer, numeric) to service_role;
grant execute on function public.fail_generation_and_refund(uuid, text, text) to service_role;

comment on function public.create_generation_and_reserve_credits is 'Idempotently creates a generation and reserves credits in one transaction. Backend only.';
comment on function public.fail_generation_and_refund is 'Marks an active generation failed and refunds its reservation once. Backend only.';
