-- Fix remaining functions with search path issues
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at_referrals()
RETURNS trigger
LANGUAGE plpgsql  
SET search_path = public
AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Update ensure_referral function to include search path
CREATE OR REPLACE FUNCTION public.ensure_referral(invite_type text)
RETURNS referrals
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  rec public.referrals;
begin
  if invite_type not in ('user','worker') then
    raise exception 'invalid invite_type';
  end if;

  select * into rec
  from public.referrals
  where inviter_id = auth.uid()
    and invite_type = ensure_referral.invite_type
  order by created_at asc
  limit 1;

  if not found then
    insert into public.referrals (inviter_id, invite_type, ref_code, status)
    values (auth.uid(), ensure_referral.invite_type, substr(replace(gen_random_uuid()::text,'-',''),1,8), 'created')
    returning * into rec;
  end if;

  return rec;
end;
$$;

-- Update handle_new_user function to include search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null), coalesce(new.phone, null), 'worker')
  on conflict (id) do nothing;
  return new;
end;
$$;