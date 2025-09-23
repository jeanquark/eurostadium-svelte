-- Enable RLS on leagues table
-- It makes use of the is_admin function to restrict access to admin users only
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable read access for all users" ON public.leagues
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert leagues" ON public.leagues
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update leagues" ON public.leagues
FOR UPDATE
TO authenticated
USING (public.is_admin());