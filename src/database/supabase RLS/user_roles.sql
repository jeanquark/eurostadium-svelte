-- Enable Row Level Security (RLS) on the table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to read their own role
CREATE POLICY "Allow users to read their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);