-- ============================================================
-- SonicEar — Supabase Schema
-- Chạy toàn bộ file này trong Supabase SQL Editor
-- ============================================================

-- 1. UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 2. Profiles (public — 1 row per user)
-- ============================================================
create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  username    text        unique,
  total_xp    integer     not null default 0,
  level       integer     not null default 1,
  correct     integer     not null default 0,
  wrong       integer     not null default 0,
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 3. Game sessions (private — one row per practice round)
-- ============================================================
create table if not exists public.game_sessions (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  stage       text        not null,   -- interval | chord | scale | note | piano
  correct     integer     not null default 0,
  wrong       integer     not null default 0,
  xp_earned   integer     not null default 0,
  duration_ms integer     not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists game_sessions_user_id_idx on public.game_sessions(user_id, created_at desc);

-- ============================================================
-- 4. Leaderboard view (public — top 200 players by XP)
-- ============================================================
create or replace view public.leaderboard as
select
  p.id,
  coalesce(p.username, 'Người chơi ẩn') as username,
  p.total_xp,
  p.level,
  p.correct,
  p.wrong,
  p.updated_at,
  rank() over (order by p.total_xp desc)::integer as rank
from public.profiles p
order by p.total_xp desc
limit 200;

-- ============================================================
-- 5. Row Level Security
-- ============================================================
alter table public.profiles     enable row level security;
alter table public.game_sessions enable row level security;

-- Profiles: all can read; only owner can write
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select using (true);

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Sessions: only owner can read/write
drop policy if exists "sessions_select" on public.game_sessions;
create policy "sessions_select" on public.game_sessions for select using (auth.uid() = user_id);

drop policy if exists "sessions_insert" on public.game_sessions;
create policy "sessions_insert" on public.game_sessions for insert with check (auth.uid() = user_id);

-- ============================================================
-- 6. Auto-create profile on signup trigger
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Google OAuth (cần làm thêm trong Supabase Dashboard):
--   Authentication → Providers → Google → bật ON
--   Điền Client ID và Client Secret từ Google Cloud Console
--   (APIs & Services → Credentials → OAuth 2.0 Client IDs)
--   Authorized redirect URI: https://<project>.supabase.co/auth/v1/callback
-- ============================================================
