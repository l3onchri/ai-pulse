import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwnctoszgtxjxfdamvuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bmN0b3N6Z3R4anhmZGFtdnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzYxNTYsImV4cCI6MjA4NjE1MjE1Nn0.vXxgHKKZ6fV2TWDv8Ar198gOEpdbD3mpF9KaLZUQLqM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
