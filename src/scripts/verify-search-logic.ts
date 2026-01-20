
import { createAdminClient } from '@/lib/supabase/admin';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verifyLogic() {
    const query = "How do I get a passport?";
    const stopWords = ['how', 'do', 'does', 'to', 'get', 'create', 'apply', 'for', 'a', 'an', 'the', 'in', 'sri', 'lanka', 'what', 'is', 'i', 'want', 'need', 'can', 'you', 'help', 'me', 'with', 'open', 'account', 'bank', 'obtain', 'make'];

    // Simulate Logic from route.ts
    const keywords = query.toLowerCase()
        .replace(/[?.,!]/g, '') // Remove punctuation
        .split(' ')
        .filter(w => !stopWords.includes(w) && w.length > 2)
        .join(' ');

    console.log(`Original Query: "${query}"`);
    console.log(`Extracted Keywords: "${keywords}"`);

    if (keywords.includes('passport')) {
        console.log('✅ Correctly extracted "passport".');

        // Check DB for this keyword
        const supabase = createAdminClient();
        const { data } = await supabase.from('services').select('name').ilike('name', `%${keywords}%`);
        if (data && data.length > 0) {
            console.log(`✅ Found ${data.length} services matching "${keywords}":`, data.map(s => s.name));
        } else {
            console.log(`❌ No services found for "${keywords}".`);
        }

    } else {
        console.log('❌ Failed to extract "passport".');
    }
}

verifyLogic();
