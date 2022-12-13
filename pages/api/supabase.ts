import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_API || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
);

export default supabase;
