-- Enable RLS on teams table
-- It makes use of the is_admin function to restrict access to admin users only
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Policy for admin insert
-- CREATE POLICY "Admins can insert teams" ON public.teams
-- FOR INSERT TO authenticated
-- WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));

--Policy for admin update
-- CREATE POLICY "Admins can update teams" ON public.teams
-- FOR UPDATE TO authenticated
-- USING ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]))
-- WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));

CREATE POLICY "Admins can insert teams" ON public.teams
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update teams" ON public.teams
FOR UPDATE
TO authenticated
USING (public.is_admin());