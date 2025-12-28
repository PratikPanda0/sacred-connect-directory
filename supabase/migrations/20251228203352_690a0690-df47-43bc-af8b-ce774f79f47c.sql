-- Disable the protect_role_change trigger
ALTER TABLE profiles DISABLE TRIGGER protect_role_change;

-- Update Pratik Kumar Panda's role to admin (role_id = 3)
UPDATE profiles SET role_id = 3 WHERE user_id = '96787d55-f583-4b1c-88e3-d8822ae70b4e';

-- Re-enable the trigger
ALTER TABLE profiles ENABLE TRIGGER protect_role_change;