-- Backup Restoration Script
-- Replace the content below with your actual backup data

-- Example structure for restoring data:

-- 1. Restore users data
INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at)
VALUES 
  -- Paste your users data here
  ('user-id-1', 'user1@example.com', 'User One', null, NOW(), NOW()),
  ('user-id-2', 'user2@example.com', 'User Two', null, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Restore CVs data
INSERT INTO public.cvs (id, user_id, name, title, company, template_id, cv_data, pdf_url, is_public, created_at, updated_at)
VALUES 
  -- Paste your CVs data here
  (gen_random_uuid(), 'user-id-1', 'John Doe CV', 'Software Developer', 'Tech Corp', 'template1', '{"personal_info": {...}}', null, false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Restore templates data
INSERT INTO public.templates (id, name, description, preview_url, is_active, created_at)
VALUES 
  -- Paste your templates data here
  ('template1', 'Template 1', 'Classic professional layout', '/templates/template1.png', true, NOW()),
  ('template2', 'Template 2', 'Modern layout', '/templates/template2.png', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Update sequences if needed
-- SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM public.users));
-- SELECT setval('public.cvs_id_seq', (SELECT MAX(id) FROM public.cvs));
