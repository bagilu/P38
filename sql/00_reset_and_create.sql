-- P38 目光空間系統 v4.2：員工手冊 + 出勤打卡 + 出勤分析
-- 會刪除舊表，請先確認是否需要備份。
drop table if exists "TblP38Attendance" cascade;
drop table if exists "TblP38CompanyNetworks" cascade;
drop table if exists "TblP38Employees" cascade;
drop table if exists "TblP38Handbook" cascade;
drop table if exists "TblP38Admins" cascade;
drop function if exists public.is_p38_admin();
drop function if exists public.is_p38_employee();
create table "TblP38Handbook" (id bigserial primary key,section_title text not null,content text not null,display_order integer not null default 1,is_active boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table "TblP38Admins" (id bigserial primary key,email text not null unique,is_active boolean not null default true,created_at timestamptz not null default now());
create table "TblP38Employees" (id bigserial primary key,email text not null unique,display_name text,is_active boolean not null default true,created_at timestamptz not null default now());
create table "TblP38CompanyNetworks" (id bigserial primary key,label text not null,allowed_ip text not null unique,is_active boolean not null default true,created_at timestamptz not null default now());
create table "TblP38Attendance" (id bigserial primary key,user_email text not null,display_name text,clock_type text not null check (clock_type in ('IN','OUT')),clock_time timestamptz not null default now(),ip_address text,is_company_network boolean not null default false,user_agent text,note text,created_at timestamptz not null default now());
create index if not exists idx_tblp38handbook_order on "TblP38Handbook" (display_order);
create index if not exists idx_tblp38attendance_email_time on "TblP38Attendance" (user_email, clock_time desc);
create index if not exists idx_tblp38attendance_time on "TblP38Attendance" (clock_time desc);
create index if not exists idx_tblp38employees_email on "TblP38Employees" (email);
create index if not exists idx_tblp38admins_email on "TblP38Admins" (email);
create or replace function public.is_p38_admin() returns boolean language sql security definer set search_path = public as $$ select exists (select 1 from "TblP38Admins" where lower(email)=lower(auth.jwt()->>'email') and is_active=true); $$;
create or replace function public.is_p38_employee() returns boolean language sql security definer set search_path = public as $$ select exists (select 1 from "TblP38Employees" where lower(email)=lower(auth.jwt()->>'email') and is_active=true); $$;
alter table "TblP38Handbook" enable row level security; alter table "TblP38Admins" enable row level security; alter table "TblP38Employees" enable row level security; alter table "TblP38CompanyNetworks" enable row level security; alter table "TblP38Attendance" enable row level security;
create policy "P38 public read active handbook" on "TblP38Handbook" for select using (is_active=true);
create policy "P38 admin read all handbook" on "TblP38Handbook" for select to authenticated using (public.is_p38_admin());
create policy "P38 admin read self admin row" on "TblP38Admins" for select to authenticated using (lower(email)=lower(auth.jwt()->>'email') and is_active=true);
create policy "P38 employee read self" on "TblP38Employees" for select to authenticated using (lower(email)=lower(auth.jwt()->>'email') and is_active=true);
create policy "P38 admin read employees" on "TblP38Employees" for select to authenticated using (public.is_p38_admin());
create policy "P38 admin read company networks" on "TblP38CompanyNetworks" for select to authenticated using (public.is_p38_admin());
create policy "P38 employee read own attendance" on "TblP38Attendance" for select to authenticated using (lower(user_email)=lower(auth.jwt()->>'email'));
create policy "P38 admin read all attendance" on "TblP38Attendance" for select to authenticated using (public.is_p38_admin());
-- 不開放前端 insert/update/delete。打卡與手冊寫入一律走 Edge Function。
