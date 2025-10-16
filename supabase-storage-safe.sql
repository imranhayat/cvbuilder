-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public) VALUES
('cv-files', 'cv-files', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload own CV files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own CV files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own CV files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own CV files" ON storage.objects;

-- Create storage policies
CREATE POLICY "Users can upload own CV files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own CV files" ON storage.objects
  FOR SELECT USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own CV files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own CV files" ON storage.objects
  FOR DELETE USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);
