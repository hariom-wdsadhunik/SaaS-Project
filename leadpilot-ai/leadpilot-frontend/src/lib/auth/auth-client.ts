import { supabase } from "@/lib/supabase/client";

// Shared Supabase client reference preventing duplicate GoTrueClient instances
export const authClient = supabase;
