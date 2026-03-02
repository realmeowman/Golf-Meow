-- Add Palm Springs and Cathedral City; add rack_rate_cents to courses
-- Run in Supabase SQL Editor

insert into areas (slug, name) values
  ('palm-springs', 'Palm Springs'),
  ('cathedral-city', 'Cathedral City')
on conflict (slug) do nothing;

alter table courses add column if not exists rack_rate_cents int;
