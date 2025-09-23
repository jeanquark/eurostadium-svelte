-- Enable RLS on images table
-- It makes use of the is_admin function to restrict access to admin users only
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.images
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert images" ON public.images
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update images" ON public.images
FOR UPDATE
TO authenticated
USING (public.is_admin());