import { createClient } from '@supabase/supabase-js'

// CRITICAL: This client bypasses Row Level Security (RLS).
// It should ONLY be used in trusted server-side contexts (Server Actions/Components).
// NEVER expose this client or the service role key to the client.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
}

if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined. Please add it to your environment variables.");
}

export const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
