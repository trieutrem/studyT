-- Optional additive migration. Run in Supabase SQL editor after backup.
create table if not exists public.studyt_v9_workspace (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
 updated_at timestamptz not null default now()
);
alter table public.studyt_v9_workspace enable row level security;
revoke all on public.studyt_v9_workspace from anon;
grant select, insert, update, delete on public.studyt_v9_workspace to authenticated;
drop policy if exists v9_owner on public.studyt_v9_workspace;
create policy v9_owner on public.studyt_v9_workspace for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
