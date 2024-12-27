CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
security definer
AS $$
DECLARE
  user_role public.app_role;
BEGIN
  SELECT role
  INTO user_role
  FROM public.user_roles
  WHERE public.user_roles.user_id = auth.uid()
  LIMIT 1;

  IF user_role = 'admin' 
    THEN
      return true;
    ELSE
      return false;
  END IF;
END;
$$ LANGUAGE plpgsql;
