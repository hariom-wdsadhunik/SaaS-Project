const { createClient } = require("@supabase/supabase-js");
const { config } = require("../config");

// Use service role key for backend operations (bypasses RLS)
const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey || config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// For client-side operations (respects RLS)
const supabaseAnon = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

module.exports = { supabase, supabaseAnon };
