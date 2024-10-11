import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('auth_user')
      .select('count(*)')
      .single();

    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }

    console.log('Connection test successful. Row count:', data.count);
    return true;
  } catch (err) {
    console.error('Unexpected error during connection test:', err);
    return false;
  }
}