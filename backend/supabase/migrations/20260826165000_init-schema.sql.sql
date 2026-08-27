create table rooms (
  id       uuid primary key default gen_random_uuid(),
  name     text not null unique,
  capacity int
);

create table bookings (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references rooms (id) on delete cascade,
  booked_name text not null check (length(trim(booked_name)) > 0),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  created_at  timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index bookings_room_time_idx on bookings (room_id, starts_at);
create index bookings_starts_at_idx on bookings (starts_at);

alter table rooms enable row level security;
alter table bookings enable row level security;

-- No auth in this app: the anon key is the only credential, so policies are open.
create policy "anyone can read rooms"
  on rooms for select to anon using (true);

create policy "anyone can read bookings"
  on bookings for select to anon using (true);

create policy "anyone can create bookings"
  on bookings for insert to anon with check (true);

create policy "anyone can cancel bookings"
  on bookings for delete to anon using (true);
