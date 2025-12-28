-- Add agreed_to_terms_at column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN agreed_to_terms_at timestamp with time zone NULL;

-- Make name and city optional (remove NOT NULL constraint)
ALTER TABLE public.profiles 
ALTER COLUMN name DROP NOT NULL,
ALTER COLUMN city DROP NOT NULL;

-- Add default for name column to allow empty string
COMMENT ON COLUMN public.profiles.name IS 'User display name - optional';
COMMENT ON COLUMN public.profiles.city IS 'User city - optional';
COMMENT ON COLUMN public.profiles.agreed_to_terms_at IS 'Timestamp when user agreed to community guidelines';