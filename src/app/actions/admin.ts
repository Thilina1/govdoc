'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminProfile } from '@/lib/auth-service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getCategories(parentId: string | null = null) {
    const supabase = createAdminClient();
    let query = supabase
        .from('categories')
        .select('id, name, parent_id, icon');

    if (parentId) {
        query = query.eq('parent_id', parentId);
    } else {
        query = query.is('parent_id', null);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data || [];
}

export async function getAllCategories() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, parent_id, icon')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching all categories:', error);
        return [];
    }

    return data || [];
}

export async function getServices(categoryId: string | null) {
    if (!categoryId) {
        return [];
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category_id', categoryId)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching services:', error);
        return [];
    }

    return data || [];
}

export async function getAllServices() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('services')
        .select(`
            id, 
            name, 
            description, 
            category_id,
            categories:category_id (name)
        `)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching all services:', error);
        return [];
    }

    return data || [];
}

export async function getServiceById(id: string) {
    const supabase = createAdminClient();
    const { data: service, error } = await supabase
        .from('services')
        .select(`
            id,
            name,
            description,
            category_id,
            custom_details,
            references,
            file_url,
            categories:category_id (name)
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching service by id:', error);
        return null;
    }

    return service;
}

export async function getCategoryPath(categoryId: string) {
    const supabase = createAdminClient();
    // Recursive query or iterative approach could work. 
    // Given supabase recursive CTE support via RPC might be complex to set up if not already there.
    // For now, we'll do a simple iterative fetch up to a limit or assume specific depth.
    // Actually, let's fetch all categories (cacheable?) or just fetch upwards. 
    // Optimization: For now, fetching parents one by one. Depth is usually shallow.

    let path = [];
    let currentId = categoryId;

    while (currentId) {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, parent_id')
            .eq('id', currentId)
            .single();

        if (error || !data) break;

        path.unshift(data);
        if (data.parent_id) {
            currentId = data.parent_id;
        } else {
            break;
        }
    }
    return path;
}

export async function searchGlobal(term: string) {
    const supabase = createAdminClient();
    if (!term || term.length < 2) return { categories: [], services: [] };

    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name, parent_id, icon')
        .ilike('name', `%${term}%`)
        .limit(10);

    const { data: services, error: servError } = await supabase
        .from('services')
        .select('id, name, category_id, description, custom_details')
        .ilike('name', `%${term}%`)
        .limit(10);

    return {
        categories: categories || [],
        services: services || []
    };
}

export type CategoryState = {
    error?: string;
    success?: boolean;
    message?: string;
};

export async function createCategory(prevState: CategoryState, formData: FormData): Promise<CategoryState> {
    const name = formData.get('name') as string;
    const rawParentId = formData.get('parentId') as string;
    const parentId = (rawParentId && rawParentId !== 'root') ? rawParentId : null;
    const icon = formData.get('icon') as string || 'Folder';
    // Order field is removed as per user request

    if (!name) {
        return { error: 'Category name is required' };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
        .from('categories')
        .insert({
            name,
            parent_id: parentId,
            icon,
        });

    if (error) {
        console.error('Error creating category:', error);
        return { error: 'Failed to create category: ' + error.message };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/services/new');
    return { success: true, message: 'Category created successfully' };
}

export async function updateCategory(prevState: CategoryState, formData: FormData): Promise<CategoryState> {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const rawParentId = formData.get('parentId') as string;
    const parentId = (rawParentId && rawParentId !== 'root') ? rawParentId : null;
    const icon = formData.get('icon') as string || 'Folder';

    if (!id || !name) {
        return { error: 'Category ID and name are required' };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
        .from('categories')
        .update({
            name,
            parent_id: parentId,
            icon,
        })
        .eq('id', id);

    if (error) {
        console.error('Error updating category:', error);
        return { error: 'Failed to update category: ' + error.message };
    }

    revalidatePath('/admin/categories');
    revalidatePath(`/admin/categories/${id}/edit`);
    return { success: true, message: 'Category updated successfully' };
}

export async function getCategoryById(id: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching category by id:', error);
        return null;
    }
    return data;
}

export type ServiceState = {
    error?: string;
    success?: boolean;
    message?: string;
};

export async function createService(prevState: ServiceState, formData: FormData): Promise<ServiceState> {
    const name = formData.get('name') as string;
    const categoryId = formData.get('categoryId') as string;
    const description = formData.get('description') as string;
    const customDetailsJson = formData.get('customDetails') as string;
    const referencesJson = formData.get('references') as string;
    const fileUrl = formData.get('fileUrl') as string;

    if (!name || !categoryId) {
        return { error: 'Service name and category are required' };
    }

    let customDetails = {};
    try {
        if (customDetailsJson) {
            customDetails = JSON.parse(customDetailsJson);
        }
    } catch (e) {
        return { error: 'Invalid JSON for custom details' };
    }

    let references = [];
    try {
        if (referencesJson) {
            references = JSON.parse(referencesJson);
        }
    } catch (e) {
        return { error: 'Invalid JSON for references' };
    }

    const supabase = createAdminClient();

    // 1. Create Service
    const { data: service, error: serviceError } = await supabase
        .from('services')
        .insert({
            category_id: categoryId,
            name,
            description,
            custom_details: customDetails,
            references: references,
            file_url: fileUrl || null,
        })
        .select()
        .single();

    if (serviceError || !service) {
        console.error('Error creating service:', serviceError);
        return { error: 'Failed to create service: ' + serviceError?.message };
    }

    return { success: true, message: 'Service created successfully' };
}

export async function updateService(prevState: ServiceState, formData: FormData): Promise<ServiceState> {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const categoryId = formData.get('categoryId') as string;
    const description = formData.get('description') as string;
    const customDetailsJson = formData.get('customDetails') as string;
    const referencesJson = formData.get('references') as string;
    const fileUrl = formData.get('fileUrl') as string;

    if (!id || !name || !categoryId) {
        return { error: 'Service ID, name and category are required' };
    }

    let customDetails = {};
    try {
        if (customDetailsJson) {
            customDetails = JSON.parse(customDetailsJson);
        }
    } catch (e) {
        return { error: 'Invalid JSON for custom details' };
    }

    let references = [];
    try {
        if (referencesJson) {
            references = JSON.parse(referencesJson);
        }
    } catch (e) {
        return { error: 'Invalid JSON for references' };
    }

    const supabase = createAdminClient();

    const { error: serviceError } = await supabase
        .from('services')
        .update({
            category_id: categoryId,
            name,
            description,
            custom_details: customDetails,
            references: references,
            file_url: fileUrl || null,
        })
        .eq('id', id);

    if (serviceError) {
        console.error('Error updating service:', serviceError);
        return { error: 'Failed to update service: ' + serviceError.message };
    }

    revalidatePath('/admin/categories');
    return { success: true, message: 'Service updated successfully' };
}

export async function getUserCount() {
    const supabase = createAdminClient();
    const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error("Error fetching user count", error);
        return 0;
    }
    return count || 0;
}

export async function getUsers() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching users", error);
        return [];
    }
    return data || [];
}

export async function getCategoryByName(name: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, parent_id, icon')
        .ilike('name', name)
        .single(); // ilike matches case-insensitive

    if (error) {
        // Only log if it's not a 'no rows' error if you want to be cleaner, but standard log is fine
        if (error.code !== 'PGRST116') { // PGRST116 is 0 rows
            console.error(`Error fetching category by name (${name}):`, error);
        }
        return null;
    }

    return data;
}

export async function uploadResourceFile(formData: FormData) {
    const file = formData.get('file') as File;
    const categoryName = formData.get('categoryName') as string || 'resource';

    if (!file) {
        return { error: 'No file provided' };
    }

    // Auth check
    const admin = await getAdminProfile();
    if (!admin) {
        return { error: 'Unauthorized' };
    }

    const supabase = createAdminClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${categoryName.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return { error: uploadError.message };
        }

        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        return { success: true, publicUrl };
    } catch (error: any) {
        console.error('Unexpected upload error:', error);
        return { error: error.message };
    }
}
