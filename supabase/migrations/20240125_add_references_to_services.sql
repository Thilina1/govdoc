-- Add references column to services table
alter table services 
add column if not exists "references" jsonb default '[]'::jsonb;

comment on column services."references" is 'List of reference links {label: string, url: string}[]';
