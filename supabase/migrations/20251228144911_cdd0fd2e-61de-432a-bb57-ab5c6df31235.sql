-- Create roles master table
CREATE TABLE public.roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Insert role data
INSERT INTO public.roles (id, name) VALUES 
  (1, 'Basic'),
  (2, 'Devotee'),
  (3, 'Admin');

-- Enable RLS on roles table
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Everyone can view roles (it's a lookup table)
CREATE POLICY "Roles are viewable by everyone" 
ON public.roles 
FOR SELECT 
USING (true);

-- Only admins can manage roles
CREATE POLICY "Admins can manage roles" 
ON public.roles 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Add role_id column to profiles with default 2 (Devotee)
ALTER TABLE public.profiles 
ADD COLUMN role_id INTEGER NOT NULL DEFAULT 2 REFERENCES public.roles(id);

-- Create function to prevent users from changing their own role
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If role_id is being changed
  IF OLD.role_id IS DISTINCT FROM NEW.role_id THEN
    -- Check if the current user is an admin
    IF NOT public.is_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to enforce role protection
CREATE TRIGGER protect_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_change();

-- Update is_admin function to use the new structure
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role_id = 3
  )
$$;

-- Update has_role function to use the new structure
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.user_id = _user_id
      AND r.name = _role_name
  )
$$;

-- Drop the old user_roles table and related objects
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop the old app_role enum type
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Drop the old trigger for new user role assignment (it references the deleted table)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;