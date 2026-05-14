-- Settings tables for Bleu Chandelier CMS
-- Run via: supabase db push (or apply manually in Supabase dashboard)

-- User profile settings
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  phone text default '',
  timezone text default 'America/New_York',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_settings enable row level security;

create policy "Users can view own settings"
  on user_settings for select
  using ((select auth.uid()) = user_id);

create policy "Users can update own settings"
  on user_settings for all
  using ((select auth.uid()) = user_id);

-- Brand settings
create table if not exists brand_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  logo_url text,
  colors jsonb default '["#0d1929","#b7955b","#bdd4e4"]'::jsonb,
  font text default 'DM Sans',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table brand_settings enable row level security;

create policy "Users can view own brand"
  on brand_settings for select
  using ((select auth.uid()) = user_id);

create policy "Users can update own brand"
  on brand_settings for all
  using ((select auth.uid()) = user_id);

-- Notification preferences
create table if not exists notification_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  email boolean default true,
  push boolean default true,
  sms boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, category)
);

alter table notification_settings enable row level security;

create policy "Users can view own notifications"
  on notification_settings for select
  using ((select auth.uid()) = user_id);

create policy "Users can update own notifications"
  on notification_settings for all
  using ((select auth.uid()) = user_id);
