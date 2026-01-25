-- Add icon column to categories table
alter table categories 
add column if not exists "icon" text default 'Folder';

comment on column categories."icon" is 'Lucide icon name';
