-- Run in Supabase SQL editor if inquiries table is missing these columns
alter table public.inquiries
  add column if not exists service_type text,
  add column if not exists name text,
  add column if not exists notes text,
  add column if not exists topic text;
