create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  category text,
  brand text,
  model text,
  condition text,
  color text,
  material text,
  description text,
  suggested_price numeric,
  price_min numeric,
  price_max numeric,
  confidence numeric,
  data jsonb not null default '{}'::jsonb
);
create index if not exists offers_created_at_idx on offers(created_at desc);