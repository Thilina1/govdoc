import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { indexDocument } from '@/ai/indexing';
import { createAdminClient } from '@/lib/supabase/admin';

async function testRAG() {
    console.log('Testing RAG System...');
    console.log('Environment Check:');
    console.log('GOOGLE_GENAI_API_KEY present:', !!process.env.GOOGLE_GENAI_API_KEY);
    console.log('NEXT_PUBLIC_SUPABASE_URL present:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    // 1. Index a sample document
    const sampleText = "To obtain a Sri Lankan passport, you must visit the Department of Immigration and Emigration. You need your Birth Certificate, National Identity Card (NIC), and the completed application form K-35A. The fee is LKR 20,000 for one-day service.";
    const sampleId = 'test-doc-1';

    console.log('Indexing sample document...');
    try {
        await indexDocument(sampleId, sampleText, { title: 'Passport Guide' });
        console.log('Indexing successful.');
    } catch (e) {
        console.error('Indexing failed:', e);
        return;
    }

    // 2. Perform a test search via the API logic (simulated)
    // We can't fetch the API route directly in this script easily without running server, 
    // but we can test the embedding and search logic.
    console.log('Performing test vector search...');
    const { ai } = await import('@/ai/genkit');

    const query = "How much is the passport fee?";
    const embedding = await ai.embed({
        embedder: 'googleai/text-embedding-004',
        content: query,
    });

    console.log('Embedding generated.');

    const supabase = createAdminClient();
    const { data: documents, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 5,
    });

    if (error) {
        console.error('Vector search error:', error);
    } else {
        console.log('Search Results:', documents);
        if (documents && documents.length > 0) {
            console.log('Found relevant document!');
            const context = documents.map((d: any) => d.content).join('\n');
            console.log('Context:', context);
        } else {
            console.warn('No documents found for query.');
        }
    }
}

testRAG().catch(console.error);
