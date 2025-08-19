-- Enable RLS on stadiums table
ALTER TABLE public.stadiums ENABLE ROW LEVEL SECURITY;

-- Policy for admin insert
CREATE POLICY "Admins can insert stadiums" ON public.stadiums
FOR INSERT TO authenticated
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));

--Policy for admin update
CREATE POLICY "Admins can update stadiums" ON public.stadiums
FOR UPDATE TO authenticated
USING ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]))
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));