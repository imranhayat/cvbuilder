-- Simple Admin Setup for CV Builder
-- Run this in your Supabase SQL Editor

-- First, make sure the basic tables exist
-- (Run the main database schema first if you haven't)

-- Add admin flag to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_admin') THEN
        ALTER TABLE public.users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
END
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_email = 'admin@cvbuilder.com';
END;
$$ LANGUAGE plpgsql;

-- Create function to check admin status from JWT
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

-- Create admin-specific policies
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin can view all CVs" ON public.cvs;
DROP POLICY IF EXISTS "Admin can manage all CVs" ON public.cvs;

CREATE POLICY "Admin can view all users" ON public.users
  FOR SELECT USING (is_admin(auth.jwt() ->> 'email'));

CREATE POLICY "Admin can view all CVs" ON public.cvs
  FOR SELECT USING (is_admin(auth.jwt() ->> 'email'));

CREATE POLICY "Admin can manage all CVs" ON public.cvs
  FOR ALL USING (is_admin(auth.jwt() ->> 'email'));

-- Note: You need to create the admin user in Supabase Auth first
-- Go to Authentication > Users > Add User
-- Email: admin@cvbuilder.com
-- Password: admin123
-- Auto Confirm User: Yes
-- 
-- After creating the user in Auth, run this to update the users table:
-- UPDATE public.users 
-- SET is_admin = TRUE, 
--     full_name = 'Admin User',
--     updated_at = NOW()
-- WHERE email = 'admin@cvbuilder.com';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.cvs TO authenticated;
GRANT ALL ON public.templates TO authenticated;
