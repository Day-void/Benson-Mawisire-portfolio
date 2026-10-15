-- ========================================================
-- Benson Mawisire Portfolio - Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ========================================================

-- 1. Create the projects table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  description text not null,
  image_url text,
  link text,
  tags text[] default '{}',
  featured boolean default false,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for projects
alter table public.projects enable row level security;

-- Public read policy for projects
drop policy if exists "Public projects are viewable by everyone" on public.projects;
create policy "Public projects are viewable by everyone" on public.projects
  for select
  using (true);

-- Admin write policies for projects
drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects" on public.projects
  for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects" on public.projects
  for update
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects" on public.projects
  for delete
  using (auth.role() = 'authenticated');

-- 2. Create the site_content table (for editing the whole portfolio text & copy)
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for site_content
alter table public.site_content enable row level security;

-- Public read policy for site_content
drop policy if exists "Public site content is viewable by everyone" on public.site_content;
create policy "Public site content is viewable by everyone" on public.site_content
  for select
  using (true);

-- Admin write policy for site_content
drop policy if exists "Admins can manage site content" on public.site_content;
create policy "Admins can manage site content" on public.site_content
  for all
  using (auth.role() = 'authenticated');

-- 3. Create storage bucket for project images (if not exists)
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

-- Storage security policies
drop policy if exists "Project images are publicly accessible" on storage.objects;
create policy "Project images are publicly accessible" on storage.objects
  for select
  using (bucket_id = 'project-images');

drop policy if exists "Authenticated users can upload project images" on storage.objects;
create policy "Authenticated users can upload project images" on storage.objects
  for insert
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update project images" on storage.objects;
create policy "Authenticated users can update project images" on storage.objects
  for update
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');

drop policy if exists "Authenticated users can delete project images" on storage.objects;
create policy "Authenticated users can delete project images" on storage.objects
  for delete
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');

-- 4. Seed sample initial projects
insert into public.projects (title, category, description, image_url, link, tags, featured, order_index)
values
(
  'BensonDreams Brand Identity & Content Strategy',
  'Brand Strategy & Social Media',
  'Developed an end-to-end visual identity and 7-day content engine for a digital services personal brand, driving brand recognition and inbound conversions.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'https://vibrant-grow-showcase.lovable.app',
  array['Content Strategy', 'Brand Identity', 'Social Media'],
  true,
  1
),
(
  'Wevhu MobApp Airtime Frictionless UX',
  'Product & Growth Concept',
  'Designed a 5-step rapid airtime top-up customer journey reducing cognitive load and checkout drop-off across local payment gateways.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  '#concept',
  array['Product Concept', 'Mobile UX', 'Conversion Optimisation'],
  true,
  2
),
(
  'Xash Point Merchant Acquisition Campaign',
  'Digital Marketing & Merchant Strategy',
  'Strategic market activation using the SOSTAC framework to position local convenience stores as neighborhood digital service hubs.',
  'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
  '#strategy',
  array['SOSTAC', 'Audience Research', 'B2B Acquisition'],
  true,
  3
)
on conflict do nothing;
