-- Create resource_categories table
create table if not exists public.resource_categories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text not null unique,
  parent_id uuid references public.resource_categories(id)
);

-- Create resources table
create table if not exists public.resources (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  category_id uuid references public.resource_categories(id) not null,
  file_url text,
  custom_details jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.resource_categories enable row level security;
alter table public.resources enable row level security;

-- Policies for resource_categories (Public Read, Admin Write)
create policy "Public Read resource_categories"
  on public.resource_categories for select
  using (true);

create policy "Authenticated Insert resource_categories"
  on public.resource_categories for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated Update resource_categories"
  on public.resource_categories for update
  using (auth.role() = 'authenticated');

-- Policies for resources (Public Read, Admin Write)
create policy "Public Read resources"
  on public.resources for select
  using (true);

create policy "Authenticated Insert resources"
  on public.resources for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated Update resources"
  on public.resources for update
  using (auth.role() = 'authenticated');

create policy "Authenticated Delete resources"
  on public.resources for delete
  using (auth.role() = 'authenticated');

-- Seed initial categories
insert into public.resource_categories (name, slug) values
('Gazette', 'gazette'),
('Past Papers', 'past-papers'),
('Model Papers', 'model-papers'),
('Syllabus', 'syllabus'),
('Teacher Guides', 'teacher-guides'),
('Text Books', 'text-books'),
('Exam Calendars', 'exam-calendars'),
('Jobs', 'jobs'),
('Results', 'results')
on conflict (slug) do nothing;
