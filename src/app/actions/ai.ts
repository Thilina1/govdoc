'use server';

import { getAllCategories, getAllServices } from './admin';
import { indexDocument } from '@/ai/indexing';
import { revalidatePath } from 'next/cache';

export async function indexAllContent() {
    try {
        console.log('Starting full content indexing...');
        let indexedCount = 0;

        // 1. Index Categories
        const categories = await getAllCategories();
        console.log(`Found ${categories.length} categories.`);

        for (const cat of categories) {
            const text = `Category: ${cat.name}. This is a main category of services in GovDocs LK.`;
            await indexDocument(`cat-${cat.id}`, text, { type: 'category', title: cat.name, id: cat.id });
            indexedCount++;
        }

        // 2. Index Services
        const services = await getAllServices();
        console.log(`Found ${services.length} services.`);

        for (const service of services) {
            // @ts-ignore - Supabase join typing can be tricky
            const categoryName = service.categories?.name || 'General';
            const customDetails = (service as any).custom_details || {};

            let detailsText = '';
            // Dynamically index all custom fields
            Object.entries(customDetails).forEach(([key, value]) => {
                if (key && value) {
                    // Convert snake_case or camelCase keys to readable text if possible, or just use key
                    detailsText += `${key}: ${value}. `;
                }
            });

            const text = `
                Service Name: ${service.name}
                Category: ${categoryName}
                Description: ${service.description || 'No description provided.'}
                ${detailsText}
                
                GovDocs LK Guide for ${service.name}.
            `.trim();

            await indexDocument(`svc-${service.id}`, text, { type: 'service', title: service.name, id: service.id });
            indexedCount++;
        }

        console.log(`Successfully indexed ${indexedCount} items.`);
        return { success: true, message: `Successfully indexed ${indexedCount} items.` };
    } catch (error: any) {
        console.error('Indexing failed:', error);
        return { success: false, message: 'Indexing failed: ' + error.message };
    }
}
