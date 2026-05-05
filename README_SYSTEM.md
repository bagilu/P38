# P38 目光空間員工手冊系統 v3.2

## 本版重點
- admin.html 會先檢查 Supabase Auth session。
- 未登入者會導向 login.html。
- 已登入但不在 TblP38Admins 的帳號，不能進入後台。
- Edge Function 也會驗證登入者是否為 TblP38Admins 管理員。
- 前台 index.html 仍可公開讀取啟用中的手冊內容。

## 安裝步驟
1. Supabase SQL Editor 依序執行：
   - sql/00_reset_and_create.sql
   - sql/01_seed_handbook.sql
   - sql/02_insert_admin_email.sql（先把 your-email@example.com 改成管理員 Email）
2. Supabase Edge Functions：更新 update-handbook，貼上 supabase/functions/update-handbook/index.ts 後 Deploy。
3. 修改 js/config.js 的 SUPABASE_URL、SUPABASE_ANON_KEY、UPDATE_HANDBOOK_FUNCTION_URL。
4. 上傳 index.html、login.html、admin.html、css/、js/ 到 GitHub。

## Supabase Auth 設定
Authentication → URL Configuration 加入：
- https://你的帳號.github.io/P38/
- https://你的帳號.github.io/P38/admin.html

## 常見問題
- 進 admin.html 被導回 login.html：尚未登入或 session 尚未建立。
- 已登入但顯示不是管理員：TblP38Admins 沒有該 Email 或 is_active 不是 true。
- 儲存失敗 This account is not a P38 admin：Edge Function 端也擋下了，請檢查 TblP38Admins。
