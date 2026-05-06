// 請複製為 config.js，再填入自己的 Supabase 專案資料。

const APP_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT_ID.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
  P38_UPDATE_HANDBOOK_FUNCTION_URL: "https://YOUR_PROJECT_ID.functions.supabase.co/P38_update_handbook",
  P38_CLOCK_ATTENDANCE_FUNCTION_URL: "https://YOUR_PROJECT_ID.functions.supabase.co/P38_clock_attendance",
  P38_LIST_ATTENDANCE_FUNCTION_URL: "https://YOUR_PROJECT_ID.functions.supabase.co/P38_list_attendance"
};
const supabaseClient = window.supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_ANON_KEY);
