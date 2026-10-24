-- Rider experience schema. Namespaced with ride_* prefixes so it can live
-- alongside other tables in the shared Supabase project.
-- Applied to project xmbkmdqaczlxkdarayyy as migration "antiuber_rider_experience".

create table if not exists public.ride_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  city text not null default 'Accra, GH',
  rating numeric(3,2) not null default 4.92,
  created_at timestamptz not null default now()
);

create table if not exists public.ride_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  address text not null,
  icon text not null default 'star',
  lat numeric(9,6),
  lng numeric(9,6),
  created_at timestamptz not null default now()
);

create table if not exists public.ride_rides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'completed',
  tier text not null default 'UberX',
  pickup text not null,
  dropoff text not null,
  distance_km numeric(6,2) not null default 0,
  duration_min integer not null default 0,
  fare numeric(10,2) not null default 0,
  currency text not null default 'GHS',
  driver_name text not null default '',
  driver_rating numeric(3,2) not null default 0,
  vehicle text not null default '',
  plate text not null default '',
  payment_method text not null default '',
  rating integer,
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ride_payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'card',
  brand text not null default 'Visa',
  last4 text not null default '',
  exp text not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.ride_fares (
  id text primary key,
  tier text not null,
  seats integer not null default 4,
  blurb text not null default '',
  base_fare numeric(8,2) not null default 0,
  per_km numeric(8,2) not null default 0,
  per_min numeric(8,2) not null default 0,
  sort_order integer not null default 0,
  active boolean not null default true
);

alter table public.ride_profiles enable row level security;
alter table public.ride_places enable row level security;
alter table public.ride_rides enable row level security;
alter table public.ride_payment_methods enable row level security;
alter table public.ride_fares enable row level security;

create policy ride_profiles_self on public.ride_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy ride_places_self on public.ride_places
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy ride_rides_self on public.ride_rides
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy ride_pay_self on public.ride_payment_methods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy ride_fares_read on public.ride_fares for select using (true);
