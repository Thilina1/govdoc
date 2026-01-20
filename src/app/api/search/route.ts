import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { createAdminClient } from '@/lib/supabase/admin';
import { searchGlobal } from '@/app/actions/admin';
import { z } from 'zod';

const SearchSchema = z.object({
    query: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query } = SearchSchema.parse(body);

        // 1. Direct Search (Keywords) - Execute first for Smart Skip
        let directResults = await searchGlobal(query);

        // Fallback: If no results, try extracting keywords (basic stopword removal)
        if (directResults.services.length === 0 && directResults.categories.length === 0) {
            const stopWords = ['how', 'do', 'does', 'to', 'get', 'create', 'apply', 'for', 'a', 'an', 'the', 'in', 'sri', 'lanka', 'what', 'is', 'i', 'want', 'need', 'can', 'you', 'help', 'me', 'with', 'open', 'account', 'bank', 'obtain', 'make'];
            const keywords = query.toLowerCase()
                .replace(/[?.,!]/g, '') // Remove punctuation
                .split(' ')
                .filter(w => !stopWords.includes(w) && w.length > 2)
                .join(' ');

            if (keywords && keywords.length > 2 && keywords !== query.toLowerCase()) {
                // console.log('Retrying direct search with keywords:', keywords);
                const keywordResults = await searchGlobal(keywords);
                if (keywordResults.services.length > 0 || keywordResults.categories.length > 0) {
                    directResults = keywordResults;
                }
            }
        }

        // Smart Skip: If we find direct matches, skip AI (Cost Saving)
        // We skip AI if we found services/categories AND the query is likely a keyword search (< 20 chars)
        // or if we found a very strong match (exact name match logic is implicit in searchGlobal's ilike for now)
        if ((directResults.services.length > 0 || directResults.categories.length > 0) && query.length < 50) {
            return NextResponse.json({
                answer: `I found ${directResults.services.length} services and ${directResults.categories.length} categories matching "${query}".`,
                sources: [],
                directMatches: directResults
            });
        }

        // 2. Indirect Search (Vector)
        const supabase = createAdminClient();
        const embedding = await ai.embed({
            embedder: 'googleai/text-embedding-004',
            content: query,
        });

        const { data: documents, error: vectorError } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: 5,
        });

        if (vectorError) {
            console.error('Vector search error:', vectorError);
        }

        // 3. Generate Answer (RAG)
        let aiAnswer = null;

        let context = "";
        if (documents && documents.length > 0) {
            context += documents.map((doc: any) => doc.content).join('\n\n');
        }

        // Inject Direct Matches into Context (High Priority)
        // This allows the AI to read the 'services' table data directly if a keyword match was found
        if (directResults.services && directResults.services.length > 0) {
            const directContext = directResults.services.map((s: any) => `
        [PRIORITY LIVE DATA FROM DATABASE]
        Service Name: ${s.name}
        Description: ${s.description || 'N/A'}
        Details: ${JSON.stringify(s.custom_details || {})}
            `).join('\n\n');

            context = directContext + "\n\n" + context;
        }

        if (context.trim().length > 0) {
            const prompt = `
        You are a helpful assistant for GovDocs LK, a platform for Sri Lankan government services.
        Answer the user's question based ONLY on the following context.
        
        Rules:
        1. If the question is in English, answer in English.
        2. If the question is in Sinhala or "Singlish" (Sinhala written in English), answer in that same language/style.
        3. If the question is in Tamil, answer in Tamil.
        4. If the answer is not in the context, say "I don't have enough information to answer that based on the available guides" (translated if needed).
        5. Keep the answer concise, friendly, and helpful. Use Markdown formatting.

        Context:
        ${context}

        Question:
        ${query}
      `;

            try {
                const { text } = await ai.generate({
                    model: 'googleai/gemini-2.5-flash',
                    prompt: prompt,
                });
                aiAnswer = text;
            } catch (genError) {
                console.error('Generation error:', genError);
            }
        }

        return NextResponse.json({
            answer: aiAnswer,
            sources: documents || [],
            directMatches: directResults
        });

    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
