-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'member', 'viewer');

-- Create enum for announcement status
CREATE TYPE public.announcement_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table for member information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  social_links JSONB DEFAULT '{}',
  mission_description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  status announcement_status DEFAULT 'pending' NOT NULL,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create countries reference table
CREATE TABLE public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view all profiles if authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete any profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- RLS Policies for user_roles (only admins can manage)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- RLS Policies for announcements
CREATE POLICY "Approved announcements are public"
  ON public.announcements FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can view their own announcements"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all announcements"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can create announcements"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending announcements"
  ON public.announcements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can update any announcement"
  ON public.announcements FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete announcements"
  ON public.announcements FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- RLS Policies for countries (public read)
CREATE POLICY "Countries are viewable by everyone"
  ON public.countries FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage countries"
  ON public.countries FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign default 'member' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');
  RETURN NEW;
END;
$$;

-- Trigger to automatically assign role on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert common countries
INSERT INTO public.countries (name, code) VALUES
  ('United States', 'US'),
  ('United Kingdom', 'GB'),
  ('Canada', 'CA'),
  ('Australia', 'AU'),
  ('Germany', 'DE'),
  ('France', 'FR'),
  ('India', 'IN'),
  ('Brazil', 'BR'),
  ('Japan', 'JP'),
  ('South Africa', 'ZA'),
  ('Mexico', 'MX'),
  ('Italy', 'IT'),
  ('Spain', 'ES'),
  ('Netherlands', 'NL'),
  ('Sweden', 'SE'),
  ('Norway', 'NO'),
  ('Denmark', 'DK'),
  ('Switzerland', 'CH'),
  ('Austria', 'AT'),
  ('Belgium', 'BE'),
  ('Ireland', 'IE'),
  ('New Zealand', 'NZ'),
  ('Singapore', 'SG'),
  ('South Korea', 'KR'),
  ('Israel', 'IL'),
  ('United Arab Emirates', 'AE'),
  ('Poland', 'PL'),
  ('Portugal', 'PT'),
  ('Greece', 'GR'),
  ('Argentina', 'AR')
ON CONFLICT (name) DO NOTHING;