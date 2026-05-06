const APP_CONFIG = {
  SUPABASE_URL: "https://mfljkyvdadxlrbxlboce.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mbGpreXZkYWR4bHJieGxib2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MTQwMDUsImV4cCI6MjA4MDM5MDAwNX0.Z4OeacVpO8yM1d1uOWZ6jU2Gl7wgEbhXvAFSqF5pBRs",
  P38_UPDATE_HANDBOOK_FUNCTION_URL: "https://mfljkyvdadxlrbxlboce.supabase.co/functions/v1/P38_update_handbook",
  P38_CLOCK_ATTENDANCE_FUNCTION_URL: "https://mfljkyvdadxlrbxlboce.supabase.co/functions/v1/P38_clock_attendance",
  P38_LIST_ATTENDANCE_FUNCTION_URL: "https://mfljkyvdadxlrbxlboce.supabase.co/functions/v1/P38_list_attendance"
};
const supabaseClient = window.supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_ANON_KEY);
