-- Enable RLS on teams table
-- It makes use of the is_admin function to restrict access to admin users only
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.teams
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert teams" ON public.teams
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update teams" ON public.teams
FOR UPDATE
TO authenticated
USING (public.is_admin());