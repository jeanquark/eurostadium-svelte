-- -- Create the auth hook function
-- create or replace function public.custom_access_token_hook(event jsonb)
-- returns jsonb
-- language plpgsql
-- stable
-- as $$
--   declare
--     claims jsonb;
--     user_role public.app_role;
--   begin
--     -- Fetch the user role in the user_roles table
--     select role into user_role from public.user_roles where user_id = (event->>'user_id')::uuid;

--     claims := event->'claims';

--     if user_role is not null then
--       -- Set the claim
--       claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
--     else
--       claims := jsonb_set(claims, '{user_role}', 'null');
--     end if;

--     -- Update the 'claims' object in the original event
--     event := jsonb_set(event, '{claims}', claims);

--     -- Return the modified or original event
--     return event;
--   end;
-- $$;

-- grant usage on schema public to supabase_auth_admin;

-- grant execute
--   on function public.custom_access_token_hook
--   to supabase_auth_admin;

-- revoke execute
--   on function public.custom_access_token_hook
--   from authenticated, anon, public;

-- grant all
--   on table public.user_roles
-- to supabase_auth_admin;

-- revoke all
--   on table public.user_roles
--   from authenticated, anon, public;

-- create policy "Allow auth admin to read user roles" ON public.user_roles
-- as permissive for select
-- to supabase_auth_admin
-- using (true)




-- Create the auth hook function
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
  declare
    claims jsonb;
    user_role public.app_role;
    user_roles text[];
  begin
    -- Fetch the user role in the user_roles table
    user_roles := ARRAY(select role from public.user_roles where user_id = (event->>'user_id')::uuid);

    claims := event->'claims';

    if array_length(user_roles, 1) > 0 then
      -- Set the claim
      claims := jsonb_set(claims, '{user_roles}', to_jsonb(user_roles));
    else
      claims := jsonb_set(claims, '{user_roles}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;


grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

grant usage on schema public to supabase_auth_admin;

revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon, public;
  
grant all
  on table public.user_roles
to supabase_auth_admin;

revoke all
  on table public.user_roles
  from authenticated, anon, public;


-- In config.toml file set up the following 3 lines:
-- [auth.hook.<hook_name>]
-- enabled = true
-- uri = "pg-functions://[database_name]/public/[hook_name]"

-- More info, see: https://supabase.com/docs/guides/auth/auth-hooks?queryGroups=language&language=sql