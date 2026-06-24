-- ============================================================
-- Towards Recovery (Pulse) — Supabase schema
-- Run in the Supabase SQL editor.
--
-- DATA-PROTECTION DESIGN:
--  * We store ONLY numeric behavioural indicators + a derived score and an
--    emotion *label*. No camera frames, no images, no free text from the face
--    analysis ever reach the database.
--  * Row-Level Security guarantees a user can only read/write their OWN rows.
--  * Referrals store a minimal, consented summary — never raw indicators.
-- ============================================================

create extension if not exists "pgcrypto";

-- 1. Daily behavioural check-ins -----------------------------------------
create table if not exists public.check_ins (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  created_at        timestamptz not null default now(),
  indicators        jsonb not null,            -- {mood, stress, ...} each 0..1
  score             int  not null check (score between 0 and 100),
  band              text not null,             -- supported | monitor | reach-out
  emotion           text,                      -- dominant on-device emotion LABEL only
  emotion_confidence int                       -- 0..100, optional
);

alter table public.check_ins enable row level security;

create policy "own check-ins: select" on public.check_ins
  for select using (auth.uid() = user_id);
create policy "own check-ins: insert" on public.check_ins
  for insert with check (auth.uid() = user_id);
create policy "own check-ins: delete" on public.check_ins
  for delete using (auth.uid() = user_id);

create index if not exists check_ins_user_time
  on public.check_ins (user_id, created_at desc);

-- 2. Consented referrals to support services -----------------------------
create table if not exists public.referrals (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now(),
  service_name text not null,
  band         text not null,    -- only the wellbeing band is shared
  note         text,             -- the person's own optional words
  status       text not null default 'pending', -- pending | reviewed | contacted
  consented    boolean not null default true
);

alter table public.referrals enable row level security;

create policy "own referrals: select" on public.referrals
  for select using (auth.uid() = user_id);
create policy "own referrals: insert" on public.referrals
  for insert with check (auth.uid() = user_id and consented = true);

-- 3. Anonymous community posts (no identity link) -------------------------
create table if not exists public.community_posts (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  region     text,
  tag        text,
  body       text not null
  -- intentionally NO user_id: posts are anonymous by construction
);

alter table public.community_posts enable row level security;

create policy "posts: read all" on public.community_posts
  for select using (true);
create policy "posts: insert authed" on public.community_posts
  for insert with check (auth.role() = 'authenticated');
