-- Golf Meow schema
-- Run this in Supabase SQL Editor to set up tables

-- Areas we cover (La Quinta, Indian Wells, Palm Desert, Rancho Mirage)
create table if not exists areas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz default now()
);

insert into areas (slug, name) values
  ('la-quinta', 'La Quinta'),
  ('indian-wells', 'Indian Wells'),
  ('palm-desert', 'Palm Desert'),
  ('rancho-mirage', 'Rancho Mirage')
on conflict (slug) do nothing;

-- Golfers who signed up for alerts
-- area_slug: la-quinta, indian-wells, palm-desert, rancho-mirage, or 'all'
create table if not exists golfers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  area_slug text default 'la-quinta',
  created_at timestamptz default now()
);

-- Courses (added manually or via form)
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area_slug text references areas(slug) not null,
  booking_url text,
  created_at timestamptz default now()
);

-- Available slots submitted by courses
create table if not exists slots (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) not null,
  tee_time timestamptz not null,
  price_cents int not null,
  notes text,
  submitted_by text,
  created_at timestamptz default now()
);

-- Track sent alerts (for attribution)
create table if not exists alerts_sent (
  id uuid primary key default gen_random_uuid(),
  golfer_id uuid references golfers(id) not null,
  slot_id uuid references slots(id) not null,
  sent_at timestamptz default now()
);

-- See fix-rls.sql if you get "Something went wrong" (RLS blocking inserts)
