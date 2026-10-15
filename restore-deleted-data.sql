create extension if not exists pgcrypto;


create or replace function public.restore_deleted_wishlist(
  p_archive_id uuid,
  p_target_owner_id uuid,
  p_restored_by text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_archive public.deleted_wishlists%rowtype;
  v_snapshot jsonb;
  v_gift jsonb;
  v_reservation jsonb;

  v_new_wishlist_id uuid;
  v_new_gift_id uuid;

  v_old_gift_id text;
  v_new_gift_id_text text;

  v_gift_map jsonb := '{}'::jsonb;

  v_slug text;
  v_candidate_slug text;

  v_reserver_user_id uuid;
begin
  if p_archive_id is null then
    raise exception 'missing_archive_id';
  end if;

  if p_target_owner_id is null then
    raise exception 'missing_target_owner';
  end if;

  if nullif(trim(p_restored_by), '') is null then
    raise exception 'missing_restored_by';
  end if;

  select *
  into v_archive
  from public.deleted_wishlists
  where id = p_archive_id
  for update;

  if not found then
    raise exception 'deleted_wishlist_not_found';
  end if;

  if v_archive.restored_at is not null then
    raise exception 'wishlist_already_restored';
  end if;

  if v_archive.recover_until <= now() then
    raise exception 'wishlist_recovery_expired';
  end if;

  if not exists (
    select 1
    from auth.users
    where id = p_target_owner_id
  ) then
    raise exception 'target_user_not_found';
  end if;

  v_snapshot :=
    coalesce(
      v_archive.wishlist_snapshot,
      '{}'::jsonb
    );

  v_candidate_slug :=
    lower(
      trim(
        coalesce(
          nullif(v_archive.original_slug, ''),
          'wishlist'
        )
      )
    );

  if not exists (
    select 1
    from public.wishlists
    where lower(slug) =
      lower(v_candidate_slug)
  ) then
    v_slug := v_candidate_slug;
  else
    loop
      v_candidate_slug :=
        substr(
          replace(gen_random_uuid()::text, '-', ''),
          1,
          7
        );

      exit when not exists (
        select 1
        from public.wishlists
        where lower(slug) =
          lower(v_candidate_slug)
      );
    end loop;

    v_slug := v_candidate_slug;
  end if;

  insert into public.wishlists (
    owner_id,
    title,
    slug,
    is_live,
    access_code_hash,
    event_date,
    owner_contact_email,
    owner_contact_phone,
    created_at,
    updated_at
  )
  values (
    p_target_owner_id,

    coalesce(
      nullif(
        v_snapshot ->> 'title',
        ''
      ),
      v_archive.title
    ),

    v_slug,

    coalesce(
      (v_snapshot ->> 'is_live')::boolean,
      v_archive.was_live
    ),

    nullif(
      v_snapshot ->> 'access_code_hash',
      ''
    ),

    case
      when nullif(
        v_snapshot ->> 'event_date',
        ''
      ) is null
      then null
      else
        (
          v_snapshot ->> 'event_date'
        )::date
    end,

    nullif(
      v_snapshot ->> 'owner_contact_email',
      ''
    ),

    nullif(
      v_snapshot ->> 'owner_contact_phone',
      ''
    ),

    coalesce(
      nullif(
        v_snapshot ->> 'created_at',
        ''
      )::timestamptz,
      now()
    ),

    now()
  )
  returning id
  into v_new_wishlist_id;


  for v_gift in
    select value
    from jsonb_array_elements(
      coalesce(
        v_archive.gifts_snapshot,
        '[]'::jsonb
      )
    )
  loop
    v_new_gift_id :=
      gen_random_uuid();

    v_old_gift_id :=
      v_gift ->> 'id';

    insert into public.gifts (
      id,
      wishlist_id,
      owner_id,
      name,
      product_url,
      image_url,
      price,
      description,
      instructions,
      shipping_address,
      created_at,
      updated_at
    )
    values (
      v_new_gift_id,
      v_new_wishlist_id,
      p_target_owner_id,

      coalesce(
        nullif(
          v_gift ->> 'name',
          ''
        ),
        'Gift'
      ),

      coalesce(
        nullif(
          v_gift ->> 'product_url',
          ''
        ),
        'https://www.amazon.com'
      ),

      nullif(
        v_gift ->> 'image_url',
        ''
      ),

      case
        when nullif(
          v_gift ->> 'price',
          ''
        ) is null
        then null
        else
          (
            v_gift ->> 'price'
          )::numeric
      end,

      nullif(
        v_gift ->> 'description',
        ''
      ),

      nullif(
        v_gift ->> 'instructions',
        ''
      ),

      coalesce(
        nullif(v_gift ->> 'shipping_address', ''),
        nullif(v_snapshot ->> 'shipping_address', '')
      ),

      coalesce(
        nullif(
          v_gift ->> 'created_at',
          ''
        )::timestamptz,
        now()
      ),

      now()
    );

    if v_old_gift_id is not null then
      v_gift_map :=
        v_gift_map ||
        jsonb_build_object(
          v_old_gift_id,
          v_new_gift_id::text
        );
    end if;
  end loop;


  for v_reservation in
    select value
    from jsonb_array_elements(
      coalesce(
        v_archive.reservations_snapshot,
        '[]'::jsonb
      )
    )
  loop
    v_old_gift_id :=
      v_reservation ->> 'gift_id';

    v_new_gift_id_text :=
      v_gift_map ->> v_old_gift_id;

    if v_new_gift_id_text is null then
      continue;
    end if;

    v_reserver_user_id := null;

    if nullif(
      v_reservation ->> 'reserver_user_id',
      ''
    ) is not null then
      if exists (
        select 1
        from auth.users
        where id =
          (
            v_reservation ->>
            'reserver_user_id'
          )::uuid
      ) then
        v_reserver_user_id :=
          (
            v_reservation ->>
            'reserver_user_id'
          )::uuid;
      end if;
    end if;

    insert into public.reservations (
      id,
      gift_id,
      wishlist_id,
      reserver_user_id,
      reserver_name,
      reserver_email,
      reserver_phone,
      receipt_url,
      tracking_number,
      order_url,
      created_at,
      updated_at
    )
    values (
      gen_random_uuid(),

      v_new_gift_id_text::uuid,

      v_new_wishlist_id,

      v_reserver_user_id,

      coalesce(
        nullif(
          v_reservation ->> 'reserver_name',
          ''
        ),
        'Guest'
      ),

      nullif(
        v_reservation ->> 'reserver_email',
        ''
      ),

      nullif(
        v_reservation ->> 'reserver_phone',
        ''
      ),


      nullif(
        v_reservation ->> 'receipt_url',
        ''
      ),

      nullif(
        v_reservation ->> 'tracking_number',
        ''
      ),

      nullif(
        v_reservation ->> 'order_url',
        ''
      ),

      coalesce(
        nullif(
          v_reservation ->> 'created_at',
          ''
        )::timestamptz,
        now()
      ),

      now()
    );
  end loop;


  update public.deleted_wishlists
  set
    restored_at = now(),
    restored_wishlist_id =
      v_new_wishlist_id,
    restored_slug = v_slug,
    restored_by =
      trim(p_restored_by)
  where id = v_archive.id;

  return v_new_wishlist_id;
end;
$$;


create or replace function public.restore_deleted_account(
  p_archive_id uuid,
  p_target_user_id uuid,
  p_restored_by text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_archive public.deleted_accounts%rowtype;
  v_target_email text;
  v_deleted_wishlist record;
  v_display_name text;
begin
  if p_archive_id is null then
    raise exception 'missing_archive_id';
  end if;

  if p_target_user_id is null then
    raise exception 'missing_target_user';
  end if;

  if nullif(trim(p_restored_by), '') is null then
    raise exception 'missing_restored_by';
  end if;

  select *
  into v_archive
  from public.deleted_accounts
  where id = p_archive_id
  for update;

  if not found then
    raise exception 'deleted_account_not_found';
  end if;

  if v_archive.restored_at is not null then
    raise exception 'account_already_restored';
  end if;

  if v_archive.recover_until <= now() then
    raise exception 'account_recovery_expired';
  end if;

  select lower(email)
  into v_target_email
  from auth.users
  where id = p_target_user_id;

  if v_target_email is null then
    raise exception 'target_user_not_found';
  end if;

  if
    lower(trim(v_archive.email)) <>
    lower(trim(v_target_email))
  then
    raise exception 'target_email_mismatch';
  end if;

  v_display_name :=
    coalesce(
      nullif(
        v_archive.display_name,
        ''
      ),
      nullif(
        v_archive.profile_snapshot
          ->> 'display_name',
        ''
      )
    );

  insert into public.profiles (
    id,
    display_name,
    email,
    updated_at
  )
  values (
    p_target_user_id,
    v_display_name,
    v_target_email,
    now()
  )
  on conflict (id)
  do update set
    display_name =
      excluded.display_name,
    email =
      excluded.email,
    updated_at =
      now();


  for v_deleted_wishlist in
    select id
    from public.deleted_wishlists
    where account_archive_id =
      v_archive.id
      and restored_at is null
      and recover_until > now()
    order by deleted_at asc
  loop
    perform
      public.restore_deleted_wishlist(
        v_deleted_wishlist.id,
        p_target_user_id,
        p_restored_by
      );
  end loop;


  update public.deleted_accounts
  set
    restored_at = now(),
    restored_to_user_id =
      p_target_user_id,
    restored_by =
      trim(p_restored_by)
  where id = v_archive.id;

  return p_target_user_id;
end;
$$;


revoke all
on function public.restore_deleted_wishlist(
  uuid,
  uuid,
  text
)
from public;

revoke all
on function public.restore_deleted_wishlist(
  uuid,
  uuid,
  text
)
from anon;

revoke all
on function public.restore_deleted_wishlist(
  uuid,
  uuid,
  text
)
from authenticated;

grant execute
on function public.restore_deleted_wishlist(
  uuid,
  uuid,
  text
)
to service_role;


revoke all
on function public.restore_deleted_account(
  uuid,
  uuid,
  text
)
from public;

revoke all
on function public.restore_deleted_account(
  uuid,
  uuid,
  text
)
from anon;

revoke all
on function public.restore_deleted_account(
  uuid,
  uuid,
  text
)
from authenticated;

grant execute
on function public.restore_deleted_account(
  uuid,
  uuid,
  text
)
to service_role;
