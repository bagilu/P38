# P38 目光空間員工手冊系統 v3.1

## 一、系統定位

P38 是「目光空間制度建立」專案的第一個內部營運系統。目標是把員工手冊、SOP、檔案規範與工地紀錄原則，轉化為可維護、可擴充的網站系統。

目前版本重點：
- GitHub Pages 前端
- Supabase 資料表儲存手冊內容
- Edge Function 負責新增與更新
- 前端讀取資料庫內容動態顯示

## 二、檔案結構

```text
P38_VisionSpace_Handbook_System_v3_1/
├── index.html
├── login.html
├── admin.html
├── css/style.css
├── js/config.js
├── js/config.example.js
├── js/main.js
├── js/login.js
├── js/admin.js
├── sql/00_reset_and_create.sql
├── sql/01_seed_handbook.sql
├── sql/02_optional_strict_admin_policy_note.sql
├── supabase/functions/update-handbook/index.ts
└── README_SYSTEM.md
```

## 三、資料表

資料表名稱：`TblP38Handbook`

欄位：
- id：主鍵
- section_title：章節標題
- content：章節內容
- display_order：顯示順序
- is_active：是否啟用
- created_at：建立時間
- updated_at：更新時間

## 四、重新安裝方式

### Step 1：執行 SQL

到 Supabase SQL Editor 依序執行：

1. `sql/00_reset_and_create.sql`
2. `sql/01_seed_handbook.sql`

注意：第一個 SQL 會刪除舊的 `TblP38Handbook`。

### Step 2：建立 Edge Function

Supabase Dashboard → Edge Functions → New Function

Function name：

```text
update-handbook
```

將 `supabase/functions/update-handbook/index.ts` 的內容貼到線上編輯器，然後 Deploy。

Function URL 格式：

```text
https://YOUR_PROJECT_ID.functions.supabase.co/update-handbook
```

### Step 3：修改 js/config.js

```javascript
const APP_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT_ID.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
  UPDATE_HANDBOOK_FUNCTION_URL: "https://YOUR_PROJECT_ID.functions.supabase.co/update-handbook"
};
```

只可填 anon key，不可填 service_role key。

### Step 4：上傳 GitHub Pages

至少上傳：
- index.html
- login.html
- admin.html
- css/
- js/

`sql/`、`supabase/`、`docs/` 可保留在 repository 作為系統文件。若 repository 是公開的，請確定沒有 service_role key。

## 五、目前安全狀態

本版本採「初步可用」安全模式：

- 前端可讀取手冊資料。
- 寫入透過 Edge Function。
- service_role key 只存在 Edge Function 環境，不放前端。
- RLS 已啟用。
- 目前為了方便 admin.html 顯示章節列表，SQL 中開放 public select all。

正式給員工使用前，建議 v3.2 加強：
1. Admin 權限檢查。
2. 管理列表也改走 Edge Function。
3. 前台是否需登入後才能閱讀，依公司需求決定。

## 六、常見錯誤

### Identifier 'supabase' has already been declared

原因：`config.js` 把變數命名為 `supabase`，與 CDN 的 `window.supabase` 衝突。

正確寫法：

```javascript
const supabaseClient = window.supabase.createClient(...);
```

### supabase.from is not a function

原因：`main.js` 還在使用舊寫法。

正確寫法：

```javascript
supabaseClient.from("TblP38Handbook")
```

### 頁面有標題但沒有內容

可能原因：
- 資料表沒有資料。
- `config.js` 的 URL 或 anon key 錯誤。
- RLS policy 擋住 select。
- GitHub Pages 還在讀舊快取。

解法：
- 先執行 seed SQL。
- 按 Ctrl + F5。
- 網址後加 `?ver=2` 測試快取問題。
- 用 F12 Console 看錯誤訊息。

## 七、後續版本建議

v3.2：
- Admin role 權限控制
- 後台列表也走 Edge Function
- 登入後才可進 admin.html

v4：
- 工地 checklist
- 專案資料頁
- 廠商資料管理
- 客戶變更紀錄
