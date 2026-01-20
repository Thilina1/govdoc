import { ai } from './genkit';
import { createAdminClient } from '@/lib/supabase/admin';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export async function indexDocument(id: string, text: string, metadata: any) {
    const supabase = createAdminClient();
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const output = await splitter.createDocuments([text]);

    // Process chunks in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < output.length; i += batchSize) {
        const batch = output.slice(i, i + batchSize);

        const embeddings = await Promise.all(
            batch.map(async (chunk: any) => {
                const embedding = await ai.embed({
                    embedder: 'googleai/text-embedding-004',
                    content: chunk.pageContent,
                });
                return {
                    content: chunk.pageContent,
                    metadata: { ...metadata, source_id: id },
                    embedding: embedding,
                };
            })
        );

        const { error } = await supabase.from('documents').insert(embeddings);
        if (error) {
            console.error('Error indexing chunk batch:', error);
            throw error;
        }
    }

    return true;
}
