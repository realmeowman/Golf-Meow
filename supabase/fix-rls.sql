-- Run this in Supabase SQL Editor if you get "Something went wrong" on signup or slot submit
-- (RLS blocking inserts)

alter table golfers enable row level security;
alter table courses enable row level security;
alter table slots enable row level security;

drop policy if exists "Allow anon insert golfers" on golfers;
drop policy if exists "Allow anon select golfers" on golfers;
create policy "Allow anon insert golfers" on golfers for insert to anon with check (true);
create policy "Allow anon select golfers" on golfers for select to anon using (true);

drop policy if exists "Allow anon insert courses" on courses;
drop policy if exists "Allow anon select courses" on courses;
create policy "Allow anon insert courses" on courses for insert to anon with check (true);
create policy "Allow anon select courses" on courses for select to anon using (true);

drop policy if exists "Allow anon insert slots" on slots;
drop policy if exists "Allow anon select slots" on slots;
create policy "Allow anon insert slots" on slots for insert to anon with check (true);
create policy "Allow anon select slots" on slots for select to anon using (true);
