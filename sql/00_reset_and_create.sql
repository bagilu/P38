-- P38 目光空間員工手冊系統 v3.2
drop table if exists "TblP38Handbook" cascade;
drop table if exists "TblP38Admins" cascade;
drop function if exists public.is_p38_admin();

create table "TblP38Handbook" (
  id bigserial primary key,
  section_title text not null,
  content text not null,
  display_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table "TblP38Admins" (
  id bigserial primary key,
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_tblp38handbook_order on "TblP38Handbook" (display_order);

create or replace function public.is_p38_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from "TblP38Admins"
    where lower(email) = lower(auth.jwt() ->> 'email') and is_active = true
  );
$$;

alter table "TblP38Handbook" enable row level security;
alter table "TblP38Admins" enable row level security;

create policy "P38 public read active handbook"
on "TblP38Handbook" for select using (is_active = true);

create policy "P38 admin read all handbook"
on "TblP38Handbook" for select to authenticated using (public.is_p38_admin());

create policy "P38 admin read self admin row"
on "TblP38Admins" for select to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email') and is_active = true);
