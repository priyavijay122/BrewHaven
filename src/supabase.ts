/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zrxgpwyuuevboipoctvi.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyeGdwd3l1dWV2Ym9pcG9jdHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4Nzc3NTEsImV4cCI6MjA5ODQ1Mzc1MX0.326ZN1KZfwRqbpenkGyDJtgyc-M4PaF7YGn_5LdHBIg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

