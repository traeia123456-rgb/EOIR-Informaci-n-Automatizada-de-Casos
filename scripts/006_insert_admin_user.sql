-- Script para insertar el usuario admin correcto
-- Basado en el token JWT: f509de1f-ffd3-415f-9f8a-1eefd62d41dc

-- Insertar el usuario admin con el UUID correcto
INSERT INTO admin_users (id, email, full_name, role) 
VALUES (
  'f509de1f-ffd3-415f-9f8a-1eefd62d41dc',
  'admin@eoir.gov',
  'Administrador EOIR',
  'super_admin'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Verificar que el usuario fue insertado correctamente
SELECT * FROM admin_users WHERE id = 'f509de1f-ffd3-415f-9f8a-1eefd62d41dc';
