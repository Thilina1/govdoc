-- Add custom_details column to services table
alter table services 
add column if not exists custom_details jsonb default '{}'::jsonb;
