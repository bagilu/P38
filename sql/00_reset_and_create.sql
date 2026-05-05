-- P38 目光空間員工手冊系統 v3.1
-- 會刪除舊 TblP38Handbook，請先確認是否需要備份。

drop table if exists "TblP38Handbook" cascade;

create table "TblP38Handbook" (
  id bigserial primary key,
  section_title text not null,
  content text not null,
  display_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tblp38handbook_order
on "TblP38Handbook" (display_order);

alter table "TblP38Handbook" enable row level security;

drop policy if exists "P38 allow public read active handbook" on "TblP38Handbook";
create policy "P38 allow public read active handbook"
on "TblP38Handbook"
for select
using (is_active = true);

drop policy if exists "P38 allow public read all handbook for admin list" on "TblP38Handbook";
create policy "P38 allow public read all handbook for admin list"
on "TblP38Handbook"
for select
using (true);

-- 不開放 anon insert/update/delete。
-- 寫入請透過 Edge Function 使用 service_role。
