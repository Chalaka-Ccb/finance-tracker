
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl    = process.env.SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY; // service-role bypasses RLS on the backend

if (!supabaseUrl || !supabaseSecret) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

// Service-role client for backend operations
export const supabase = createClient(supabaseUrl, supabaseSecret);