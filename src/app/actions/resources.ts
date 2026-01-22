'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type ResourceState = {
    error?: string;
    success?: boolean;
    message?: string;
};

// --- Categories ---

export async function createResourceCategory(prevState: ResourceState, formData: FormData): Promise<ResourceState> {
    const name = formData.get('name') as string;
    const parentId = formData.get('parentId') as string;
    const parentIdValue = parentId && parentId !== 'null' ? parentId : null;

    // Auto-generate slug
    const rawSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = parentIdValue ? `${rawSlug}-${Math.random().toString(36).substring(2, 7)}` : rawSlug;

    if (!name) {
        return { error: 'Category name is required' };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
        .from('resource_categories')
        .insert({
            name,
            slug,
            parent_id: parentIdValue
        });

    if (error) {
        return { error: 'Failed to create folder: ' + error.message };
    }

    revalidatePath('/admin/resources');
    return { success: true, message: 'Folder created' };
}

export async function getResourceCategoryBySlug(slug: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) return null;
    return data;
}

export async function getResourceCategoryById(id: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

export async function getAllResourceCategories() {
    return getResourceCategories(null);
}

export async function getResourceCategories(parentId: string | null = null) {
    const supabase = createAdminClient();
    let query = supabase
        .from('resource_categories')
        .select('*')
        .order('name');

    if (parentId) {
        query = query.eq('parent_id', parentId);
    } else {
        query = query.is('parent_id', null);
    }

    const { data, error } = await query;
    if (error) return [];
    return data;
}

export async function getCategoryAncestors(categoryId: string) {
    const supabase = createAdminClient();
    let path = [];
    let currentId = categoryId;

    for (let i = 0; i < 10; i++) {
        if (!currentId) break;
        const { data } = await supabase
            .from('resource_categories')
            .select('id, name, parent_id, slug')
            .eq('id', currentId)
            .single();

        if (!data) break;
        path.unshift(data);
        if (data.parent_id) {
            currentId = data.parent_id;
        } else {
            break;
        }
    }
    return path;
}

// --- Resources ---

export async function createResource(prevState: ResourceState, formData: FormData): Promise<ResourceState> {
    const title = formData.get('title') as string;
    const categoryId = formData.get('categoryId') as string;
    const description = formData.get('description') as string;
    const customDetailsJson = formData.get('customDetails') as string;
    const fileUrl = formData.get('fileUrl') as string;
    const redirectPath = formData.get('redirectPath') as string;

    if (!title || !categoryId) {
        return { error: 'Title and category are required' };
    }

    let customDetails = {};
    try {
        if (customDetailsJson) {
            customDetails = JSON.parse(customDetailsJson);
        }
    } catch (e) {
        return { error: 'Invalid JSON for custom details' };
    }

    const supabase = createAdminClient();

    const { error } = await supabase
        .from('resources')
        .insert({
            category_id: categoryId,
            title,
            description,
            custom_details: customDetails,
            file_url: fileUrl || null,
        });

    if (error) {
        console.error('Error creating resource:', error);
        return { error: 'Failed to create resource: ' + error.message };
    }

    if (redirectPath) {
        revalidatePath(redirectPath);
    }

    // We can't redirect from within a try/catch block often in server actions if using simple ActionState, 
    // but here we return success and let client redirect.
    return { success: true, message: 'Resource created successfully' };
}

export async function getResourcesByCategory(categoryId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching resources:', error);
        return [];
    }

    return data || [];
}

export async function getAllResources() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('resources')
        .select(`
            *,
            resource_categories:category_id (name, slug)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all resources:', error);
        return [];
    }
    return data || [];
}
