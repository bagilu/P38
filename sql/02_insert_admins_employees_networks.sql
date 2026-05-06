-- P38 v4.2 管理員、員工與公司網路初始設定
-- 請先修改 Email 與 IP 後再執行。
insert into "TblP38Admins" (email,is_active) values ('bagilu@gmail.com',true),('admin2@example.com',true) on conflict (email) do update set is_active=true;
insert into "TblP38Employees" (email,display_name,is_active) values ('admin1@example.com','管理員一',true),('sc114@gms.tcu.edu.tw','員工一',true),('employee2@example.com','員工二',true) on conflict (email) do update set display_name=excluded.display_name,is_active=excluded.is_active;
-- v4.2 不會阻擋非公司 IP，只標記是否符合公司網路。
insert into "TblP38CompanyNetworks" (label,allowed_ip,is_active) values ('公司主要 WiFi','123.123.123.123',true) on conflict (allowed_ip) do update set label=excluded.label,is_active=excluded.is_active;
