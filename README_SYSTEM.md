# P38 目光空間系統 v4.2
## 員工手冊 + 出勤打卡 + 出勤分析

## 本版重點

1. Edge Function 全部加 P 編號前綴：
   - P38_update_handbook
   - P38_clock_attendance
   - P38_list_attendance

2. 出勤打卡不限制公司 IP：
   - 只記錄來源 IP。
   - is_company_network 僅標記是否符合公司網路白名單。
   - 避免外出工地、遠端工作或網路變動造成爭議。

3. 出勤後台新增：
   - 原始出勤紀錄
   - 每日摘要
   - 遲到判斷
   - 工時估算
   - CSV 匯出

## 安裝步驟

### Step 1：執行 SQL
到 Supabase SQL Editor 依序執行：

1. sql/00_reset_and_create.sql
2. sql/01_seed_handbook.sql
3. sql/02_insert_admins_employees_networks.sql

第三個 SQL 必須先修改管理員 Email、員工 Email 與公司 IP。

### Step 2：建立 Edge Functions
在 Supabase Dashboard → Edge Functions 建立：

- P38_update_handbook
- P38_clock_attendance
- P38_list_attendance

分別貼上 supabase/functions 下對應 index.ts，然後 Deploy。

### Step 3：修改 js/config.js
填入：

- SUPABASE_URL
- SUPABASE_ANON_KEY
- P38_UPDATE_HANDBOOK_FUNCTION_URL
- P38_CLOCK_ATTENDANCE_FUNCTION_URL
- P38_LIST_ATTENDANCE_FUNCTION_URL

Function URL 格式：
https://YOUR_PROJECT_ID.functions.supabase.co/P38_clock_attendance

### Step 4：Supabase Auth Redirect URLs
Authentication → URL Configuration 加入：

- https://你的帳號.github.io/P38/
- https://你的帳號.github.io/P38/login.html
- https://你的帳號.github.io/P38/admin.html
- https://你的帳號.github.io/P38/attendance.html
- https://你的帳號.github.io/P38/admin_attendance.html

## 出勤分析邏輯

- 每日首次 IN 視為上班時間。
- 每日最後 OUT 視為下班時間。
- 若首次 IN 晚於管理者設定的標準時間，標記為遲到。
- 工時估算 = 最後 OUT - 首次 IN。
- 此為管理參考，不建議直接作為薪資結算依據。

## 後續 v4.3 建議

- 員工管理後台
- 補登申請與審核
- 異常打卡提醒
- 月報表
