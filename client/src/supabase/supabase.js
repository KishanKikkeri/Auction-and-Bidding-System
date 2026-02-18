import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_REACT_APP_SUPABASE_APIKEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
