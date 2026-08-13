/* =========================================================
   SUPABASE CONFIG
   -------------------------------------------------------
   1. Go to https://supabase.com -> create a free project.
   2. Project Settings -> API -> copy "Project URL" and
      "anon public" key, paste them below.
   3. Never put your "service_role" key here — only "anon".
   ========================================================= */

const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

// Creates the shared Supabase client used by auth.js
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
