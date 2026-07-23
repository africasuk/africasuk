create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),

  base_currency text not null,
  target_currency text not null,

  rate numeric(12,2) not null,

  effective_date timestamptz not null default now(),

  notes text,

  updated_by uuid,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index exchange_rates_pair_idx
on public.exchange_rates (
  base_currency,
  target_currency
);

create index exchange_rates_effective_idx
on public.exchange_rates (
  effective_date desc
);