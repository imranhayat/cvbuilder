-- Admin Setup Fix Script
-- Run this in your Supabase SQL Editor

-- Step 1: Add is_admin column if it doesn't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Step 2: Check current users and their admin status
SELECT id, email, full_name, is_admin, created_at 
FROM public.users 
ORDER BY created_at DESC;

-- Step 3: Set your admin user (replace with your actual admin email)
UPDATE public.users 
SET is_admin = TRUE, 
    updated_at = NOW()
WHERE email = 'admin@cvbuilder.com';  -- Replace with your admin email

-- Step 4: Verify the admin user is set correctly
SELECT id, email, full_name, is_admin, created_at 
FROM public.users 
WHERE is_admin = TRUE;

-- Step 5: Check all CVs in the database
SELECT 
    c.id, 
    c.name, 
    c.title, 
    c.company, 
    c.user_id,
    u.email as user_email,
    u.is_admin as user_is_admin,
    c.created_at
FROM public.cvs c
LEFT JOIN public.users u ON c.user_id = u.id
ORDER BY c.created_at DESC;

-- Step 6: Add RLS policies for admin access (if not already added)
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all CVs" ON public.cvs;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Create admin policies
CREATE POLICY "Admins can view all CVs" ON public.cvs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Step 7: Test admin access (this should return all CVs for admin users)
-- This query should work when run by an admin user
SELECT 
    c.id, 
    c.name, 
    c.title, 
    c.company, 
    c.user_id,
    u.email as user_email,
    c.created_at
FROM public.cvs c
LEFT JOIN public.users u ON c.user_id = u.id
ORDER BY c.created_at DESC;
