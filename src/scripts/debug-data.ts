
import { createAdminClient } from '@/lib/supabase/admin';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkData() {
    const supabase = createAdminClient();

    console.log('Searching for "Bank" services...');

    const { data, error } = await supabase
        .from('services')
        .select('*')
        .ilike('name', '%Bank%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('✅ Found Services:');
        data.forEach(s => {
            console.log('------------------------------------------------');
            console.log(`ID: ${s.id}`);
            console.log(`Name: ${s.name}`);
            console.log(`Description: ${s.description}`);
            console.log(`Custom Details (JSON):`);
            console.log(JSON.stringify(s.custom_details, null, 2));
            console.log('------------------------------------------------');
        });
    } else {
        console.log('❌ No services found matching "Bank".');
    }
}

checkData();
