-- Enable RLS on images table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to read their own user data
CREATE POLICY "Allow users to read their own data"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Policy for admin insert
CREATE POLICY "Admins can insert users" ON public.users
FOR INSERT TO authenticated
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));

--Policy for admin update
CREATE POLICY "Admins can update users" ON public.users
FOR UPDATE TO authenticated
USING ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]))
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));