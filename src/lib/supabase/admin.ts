
import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('⚠️ Missing Supabase Env Vars in createAdminClient:', {
            url: !!supabaseUrl,
            key: !!supabaseKey,
            NODE_ENV: process.env.NODE_ENV
        });
    }

    return createClient(
        supabaseUrl!,
        supabaseKey!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
};
