
-- First, clean up any existing admin role assignments for all users
UPDATE public.user_roles 
SET role = 'user' 
WHERE role = 'admin';

-- Then set your specific user ID as admin
-- Replace 'YOUR_USER_ID_HERE' with your actual Supabase auth.users user ID
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = 'YOUR_USER_ID_HERE';

-- If above update doesn't affect any rows (meaning your user ID wasn't in user_roles table yet)
-- then insert a new record instead
INSERT INTO public.user_roles (user_id, role)
SELECT 'YOUR_USER_ID_HERE', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = 'YOUR_USER_ID_HERE'
);
