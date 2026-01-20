
import { createAdminClient } from '@/lib/supabase/admin';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verifyYesAccount() {
    const query = "yes account";
    const stopWords = ['how', 'do', 'does', 'to', 'get', 'create', 'apply', 'for', 'a', 'an', 'the', 'in', 'sri', 'lanka', 'what', 'is', 'i', 'want', 'need', 'can', 'you', 'help', 'me', 'with', 'open', 'account', 'bank', 'obtain', 'make'];

    // Simulate Logic from route.ts
    const keywords = query.toLowerCase()
        .replace(/[?.,!]/g, '') // Remove punctuation
        .split(' ')
        .filter(w => !stopWords.includes(w) && w.length > 2)
        .join(' ');

    console.log(`Original Query: "${query}"`);
    console.log(`Extracted Keywords: "${keywords}"`);

    const supabase = createAdminClient();

    // 1. Check what services match "Yes"
    console.log('--- Checking DB for "Yes" ---');
    const { data: yesData } = await supabase.from('services').select('name').ilike('name', '%Yes%');
    if (yesData && yesData.length > 0) {
        console.log('Found services with "Yes":', yesData.map(s => s.name));
    } else {
        console.log('No services found with "Yes".');
    }

    // 2. Check if the extraction logic works for this specific case
    if (keywords.length > 0) {
        const { data: mm } = await supabase.from('services').select('name').ilike('name', `%${keywords}%`);
        if (mm && mm.length > 0) {
            console.log(`✅ Search for "${keywords}" WOULD find:`, mm.map(s => s.name));
        } else {
            console.log(`❌ Search for "${keywords}" WOULD NOT find anything.`);
        }
    } else {
        console.log('❌ All words were stripped. Fallback search would fail.');
    }
}

verifyYesAccount();
