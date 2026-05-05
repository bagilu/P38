-- 請把 your-email@example.com 改成你的管理員 Email。
insert into "TblP38Admins" (email, is_active)
values ('bagilu@gmail.com', true)
on conflict (email) do update set is_active = true;
