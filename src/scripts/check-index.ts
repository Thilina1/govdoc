
import { createAdminClient } from '@/lib/supabase/admin';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkIndex() {
    const supabase = createAdminClient();

    console.log('Checking vector index for "Bank"...');

    const { data, error } = await supabase
        .from('documents')
        .select('content, metadata')
        .ilike('content', '%Bank%')
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log(`✅ Found ${data.length} indexed documents containing "Bank":`);
        data.forEach(d => {
            console.log('--');
            console.log(d.content.slice(0, 150) + '...');
        });
    } else {
        console.log('❌ No documents found containing "Bank". Indexing required.');
    }
}

checkIndex();
