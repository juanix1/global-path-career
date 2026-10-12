-- Run in the Supabase SQL Editor.
-- This table is intentionally not exposed for direct browser access.
create table if not exists public.applications (
  id bigint generated always as identity primary key,
  reference text unique not null,
  full_name text not null,
  email text not null,
  phone text not null,
  destination text not null check (destination in ('UAE (Dubai)', 'Canada', 'Qatar', 'Australia')),
  job_title text not null,
  experience text not null,
  status text not null default 'received',
  created_at timestamptz not null default now()
);

alter table public.applications enable row level security;

-- Do not create an anon/public INSERT policy. The backend uses the secret
-- service-role key, which must never be placed in public/index.html.
