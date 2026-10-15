create extension if not exists pgcrypto;

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),

  user_id uuid
    references auth.users(id)
    on delete set null,

  name text not null,
  email text not null,
  message text not null,

  status text not null default 'new',

  source_path text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  handled_at timestamptz,

  constraint support_tickets_status_valid
    check (
      status in (
        'new',
        'handled',
        'closed'
      )
    ),

  constraint support_tickets_name_length
    check (
      char_length(name) between 1 and 120
    ),

  constraint support_tickets_email_length
    check (
      char_length(email) between 3 and 320
    ),

  constraint support_tickets_message_length
    check (
      char_length(message) between 1 and 5000
    )
);

create index if not exists
support_tickets_status_index
on public.support_tickets (status);

create index if not exists
support_tickets_created_at_index
on public.support_tickets (created_at desc);

create index if not exists
support_tickets_user_id_index
on public.support_tickets (user_id);


create table if not exists public.support_submission_attempts (
  visitor_key text primary key,

  submission_count integer not null default 0,

  window_started_at timestamptz not null default now(),

  blocked_until timestamptz,

  updated_at timestamptz not null default now(),

  constraint support_submission_attempts_count_valid
    check (submission_count >= 0)
);


create table if not exists public.deleted_accounts (
  id uuid primary key default gen_random_uuid(),

  original_user_id uuid not null,

  email text not null,

  display_name text,

  auth_created_at timestamptz,

  deleted_by text not null default 'self',

  profile_snapshot jsonb not null default '{}'::jsonb,

  wishlists_snapshot jsonb not null default '[]'::jsonb,

  deleted_at timestamptz not null default now(),

  recover_until timestamptz not null
    default (now() + interval '90 days'),

  restored_at timestamptz,

  restored_to_user_id uuid,

  restored_by text,

  constraint deleted_accounts_deleted_by_valid
    check (
      deleted_by in (
        'self',
        'admin'
      )
    )
);

create index if not exists
deleted_accounts_email_index
on public.deleted_accounts (lower(email));

create index if not exists
deleted_accounts_deleted_at_index
on public.deleted_accounts (deleted_at desc);

create index if not exists
deleted_accounts_recover_until_index
on public.deleted_accounts (recover_until);


create table if not exists public.deleted_wishlists (
  id uuid primary key default gen_random_uuid(),

  original_wishlist_id uuid not null,

  original_owner_id uuid not null,

  owner_email text,

  title text not null,

  original_slug text not null,

  was_live boolean not null default false,

  wishlist_snapshot jsonb not null default '{}'::jsonb,

  gifts_snapshot jsonb not null default '[]'::jsonb,

  reservations_snapshot jsonb not null default '[]'::jsonb,

  deleted_by text not null default 'owner',

  deleted_at timestamptz not null default now(),

  recover_until timestamptz not null
    default (now() + interval '90 days'),

  restored_at timestamptz,

  restored_wishlist_id uuid,

  restored_slug text,

  restored_by text,

  constraint deleted_wishlists_deleted_by_valid
    check (
      deleted_by in (
        'owner',
        'admin',
        'account_delete',
        'account_reset'
      )
    )
);

create index if not exists
deleted_wishlists_original_owner_id_index
on public.deleted_wishlists (original_owner_id);

create index if not exists
deleted_wishlists_owner_email_index
on public.deleted_wishlists (lower(owner_email));

create index if not exists
deleted_wishlists_deleted_at_index
on public.deleted_wishlists (deleted_at desc);

create index if not exists
deleted_wishlists_recover_until_index
on public.deleted_wishlists (recover_until);


create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),

  admin_user_id uuid,

  admin_email text not null,

  action text not null,

  target_user_id uuid,

  target_email text,

  target_wishlist_id uuid,

  details jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists
admin_activity_log_created_at_index
on public.admin_activity_log (created_at desc);

create index if not exists
admin_activity_log_target_user_id_index
on public.admin_activity_log (target_user_id);

create index if not exists
admin_activity_log_target_wishlist_id_index
on public.admin_activity_log (target_wishlist_id);


alter table public.support_tickets
enable row level security;

alter table public.support_submission_attempts
enable row level security;

alter table public.deleted_accounts
enable row level security;

alter table public.deleted_wishlists
enable row level security;

alter table public.admin_activity_log
enable row level security;


revoke all
on table public.support_tickets
from anon;

revoke all
on table public.support_tickets
from authenticated;

revoke all
on table public.support_submission_attempts
from anon;

revoke all
on table public.support_submission_attempts
from authenticated;

revoke all
on table public.deleted_accounts
from anon;

revoke all
on table public.deleted_accounts
from authenticated;

revoke all
on table public.deleted_wishlists
from anon;

revoke all
on table public.deleted_wishlists
from authenticated;

revoke all
on table public.admin_activity_log
from anon;

revoke all
on table public.admin_activity_log
from authenticated;


grant select, insert, update, delete
on table public.support_tickets
to service_role;

grant select, insert, update, delete
on table public.support_submission_attempts
to service_role;

grant select, insert, update, delete
on table public.deleted_accounts
to service_role;

grant select, insert, update, delete
on table public.deleted_wishlists
to service_role;

grant select, insert, update, delete
on table public.admin_activity_log
to service_role;


create or replace function public.purge_expired_deleted_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.deleted_wishlists
  where recover_until <= now();

  delete from public.deleted_accounts
  where recover_until <= now();
end;
$$;

revoke all
on function public.purge_expired_deleted_data()
from public, anon, authenticated;

grant execute
on function public.purge_expired_deleted_data()
to service_role;
