
-- Create portfolio profile table (single row for admin info)
CREATE TABLE public.portfolio_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_photo_url TEXT,
  email TEXT NOT NULL DEFAULT 'thisisakhilkotyada@gmail.com',
  phone TEXT NOT NULL DEFAULT '8317609312',
  github TEXT NOT NULL DEFAULT 'https://github.com/akhilkotyada',
  linkedin TEXT NOT NULL DEFAULT 'https://linkedin.com/in/akhilkotyada',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profile" ON public.portfolio_profile FOR SELECT USING (true);
CREATE POLICY "Anyone can insert profile" ON public.portfolio_profile FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profile" ON public.portfolio_profile FOR UPDATE USING (true);

-- Create portfolio projects table
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT NOT NULL DEFAULT '#',
  github_url TEXT NOT NULL DEFAULT '#',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read projects" ON public.portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert projects" ON public.portfolio_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update projects" ON public.portfolio_projects FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete projects" ON public.portfolio_projects FOR DELETE USING (true);

-- Create portfolio project images table
CREATE TABLE public.portfolio_project_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read project images" ON public.portfolio_project_images FOR SELECT USING (true);
CREATE POLICY "Anyone can insert project images" ON public.portfolio_project_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update project images" ON public.portfolio_project_images FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete project images" ON public.portfolio_project_images FOR DELETE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_portfolio_profile_updated_at
  BEFORE UPDATE ON public.portfolio_profile
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

CREATE POLICY "Anyone can view portfolio images" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Anyone can upload portfolio images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "Anyone can update portfolio images" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio');
CREATE POLICY "Anyone can delete portfolio images" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio');

-- Insert default profile row
INSERT INTO public.portfolio_profile (email, phone, github, linkedin)
VALUES ('thisisakhilkotyada@gmail.com', '8317609312', 'https://github.com/akhilkotyada', 'https://linkedin.com/in/akhilkotyada');
