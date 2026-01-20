
import { createAdminClient } from '@/lib/supabase/admin';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkPassport() {
    const supabase = createAdminClient();

    console.log('Checking for "Passport" service...');

    // Check Services Table
    const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .ilike('name', '%Passport%');

    if (services && services.length > 0) {
        console.log(`✅ Found ${services.length} "Passport" services in Database.`);
        services.forEach(s => console.log(`- ${s.name} (ID: ${s.id})`));
    } else {
        console.log('❌ No "Passport" service found in Database.');
    }

    // Check Index
    const { data: docs } = await supabase
        .from('documents')
        .select('metadata')
        .ilike('content', '%Passport%')
        .limit(1);

    if (docs && docs.length > 0) {
        console.log('✅ "Passport" content IS indexed in Vector Store.');
    } else {
        console.log('❌ "Passport" content is NOT indexed.');
    }
}

checkPassport();
