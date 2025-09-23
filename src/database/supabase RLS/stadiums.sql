-- Enable RLS on stadiums table
-- It makes use of the is_admin function to restrict access to admin users only
ALTER TABLE public.stadiums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.stadiums
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert stadiums" ON public.stadiums
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update stadiums" ON public.stadiums
FOR UPDATE
TO authenticated
USING (public.is_admin());