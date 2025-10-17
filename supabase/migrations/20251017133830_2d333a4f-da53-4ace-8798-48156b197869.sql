-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create users profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  college TEXT,
  course TEXT,
  year INTEGER,
  primary_goal TEXT,
  profile_complete BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ,
  last_visited TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL CHECK (type IN ('video', 'article', 'quiz', 'coding')),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  points INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create progress table
CREATE TABLE public.progress (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  completed_lessons UUID[] DEFAULT '{}',
  percent NUMERIC DEFAULT 0 CHECK (percent >= 0 AND percent <= 100),
  points_earned INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, subject_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view all profiles for leaderboard"
  ON public.profiles FOR SELECT
  USING (true);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for subjects (public read)
CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

-- RLS Policies for lessons (public read)
CREATE POLICY "Anyone can view lessons"
  ON public.lessons FOR SELECT
  USING (true);

-- RLS Policies for progress
CREATE POLICY "Users can view their own progress"
  ON public.progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial subjects
INSERT INTO public.subjects (title, slug, description, icon, color, order_index) VALUES
('Aptitude & Reasoning', 'aptitude', 'Master quantitative aptitude, logical reasoning, and verbal ability for placement tests', 'Brain', '#3b82f6', 1),
('Data Structures & Algorithms', 'dsa', 'Learn essential DSA concepts and practice coding problems for technical interviews', 'Code2', '#8b5cf6', 2),
('Development', 'development', 'Build practical projects and learn modern web and mobile development', 'Rocket', '#f59e0b', 3),
('CS Fundamentals', 'cs-fundamentals', 'Strengthen your understanding of OS, DBMS, Networks, and OOP concepts', 'BookOpen', '#10b981', 4);

-- Seed sample lessons for each subject
INSERT INTO public.lessons (subject_id, title, content, type, difficulty, points, order_index)
SELECT 
  s.id,
  lesson.title,
  lesson.content,
  lesson.type,
  lesson.difficulty,
  lesson.points,
  lesson.order_index
FROM public.subjects s
CROSS JOIN LATERAL (
  VALUES
    ('Introduction to ' || s.title, 'Getting started with ' || s.title || ' concepts and fundamentals.', 'article', 'beginner', 10, 1),
    ('Core Concepts', 'Deep dive into the essential concepts and theories.', 'video', 'beginner', 15, 2),
    ('Practice Problems', 'Apply your knowledge with hands-on practice problems.', 'quiz', 'intermediate', 20, 3),
    ('Advanced Topics', 'Explore advanced concepts and real-world applications.', 'article', 'advanced', 25, 4),
    ('Coding Challenge', 'Test your skills with a comprehensive coding challenge.', 'coding', 'advanced', 30, 5)
) AS lesson(title, content, type, difficulty, points, order_index);