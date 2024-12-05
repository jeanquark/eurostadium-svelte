-- -- CREATE FUNCTION
-- CREATE OR REPLACE FUNCTION public.create_user() RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.users (id, firstname, lastname) 
-- VALUES 
--   (
--     NEW.id,
--     NEW.raw_user_meta_data ->> 'firstname', 
--     NEW.raw_user_meta_data ->> 'lastname'
--   );
-- RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- -- CREATE TRIGGER
-- CREATE TRIGGER create_user_trigger 
-- AFTER 
--   INSERT ON auth.users FOR EACH ROW WHEN (
--     NEW.raw_user_meta_data IS NOT NULL
--   ) EXECUTE FUNCTION public.create_user();



/* This trigger automatically creates a user entry when a new user signs up via Supabase Auth. */ 
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
begin
  insert into public.users (id)
  values (new.id);
  return new;
end;
$$ LANGUAGE plpgsql SECURITY definer;
-- trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  -- [ WHEN ( condition ) ]
  -- WHERE id = row_id
  EXECUTE PROCEDURE public.handle_new_user();