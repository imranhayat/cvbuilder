-- Create admin user in Supabase
-- This will create a user with email: admin@cvbuilder.com and password: admin123

-- First, let's create a function to add admin user
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
BEGIN
  -- Insert admin user into auth.users (this would normally be done through Supabase Auth)
  -- For now, we'll create a user record in our public.users table
  INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'admin@cvbuilder.com',
    'Admin User',
    null,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO NOTHING;
  
  -- You'll need to create this user through Supabase Auth dashboard
  -- Go to Authentication > Users > Add User
  -- Email: admin@cvbuilder.com
  -- Password: admin123
  -- Auto Confirm User: Yes
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT create_admin_user();

-- Create admin role and permissions
CREATE ROLE IF NOT EXISTS admin_role;

-- Grant admin permissions
GRANT ALL ON public.users TO admin_role;
GRANT ALL ON public.cvs TO admin_role;
GRANT ALL ON public.templates TO admin_role;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_email = 'admin@cvbuilder.com';
END;
$$ LANGUAGE plpgsql;

-- Create admin-specific policies
CREATE POLICY "Admin can view all users" ON public.users
  FOR SELECT USING (is_admin(auth.jwt() ->> 'email'));

CREATE POLICY "Admin can view all CVs" ON public.cvs
  FOR SELECT USING (is_admin(auth.jwt() ->> 'email'));

CREATE POLICY "Admin can manage all CVs" ON public.cvs
  FOR ALL USING (is_admin(auth.jwt() ->> 'email'));

-- Add admin flag to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Update admin user to have admin flag
UPDATE public.users 
SET is_admin = TRUE 
WHERE email = 'admin@cvbuilder.com';

-- Create function to check admin status
CREATE OR REPLACE FUNCTION check_admin_status()
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
  admin_status BOOLEAN;
BEGIN
  -- Get current user email from JWT
  user_email := auth.jwt() ->> 'email';
  
  -- Check if user is admin
  SELECT is_admin INTO admin_status 
  FROM public.users 
  WHERE email = user_email;
  
  RETURN COALESCE(admin_status, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

