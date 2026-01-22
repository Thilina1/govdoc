-- Add file_url column to services table
alter table services 
add column if not exists file_url text;
