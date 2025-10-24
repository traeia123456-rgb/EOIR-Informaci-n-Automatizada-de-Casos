-- Update admin_users table with the correct UUID from Supabase Auth
-- This links the authentication user with the admin profile

UPDATE admin_users 
SET id = 'f509de1f-ffd3-415f-9f8a-1eefd62d41dc'
WHERE email = 'admin@eoir.gov';

-- Verify the update
SELECT * FROM admin_users WHERE email = 'admin@eoir.gov';
