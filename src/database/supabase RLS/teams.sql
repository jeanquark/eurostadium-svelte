-- Enable RLS on teams table
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Policy for admin insert
CREATE POLICY "Admins can insert teams" ON public.teams
FOR INSERT TO authenticated
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));

--Policy for admin update
CREATE POLICY "Admins can update teams" ON public.teams
FOR UPDATE TO authenticated
USING ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]))
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));