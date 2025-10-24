-- Script para corregir políticas de seguridad y permisos
-- Ejecutar este script en Supabase SQL Editor

-- 1. Habilitar RLS en immigration_cases si no está habilitado
ALTER TABLE immigration_cases ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Public can read immigration cases" ON immigration_cases;
DROP POLICY IF EXISTS "Admins can manage immigration cases" ON immigration_cases;

-- 3. Crear políticas correctas para immigration_cases
CREATE POLICY "Public can read immigration cases" ON immigration_cases
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage immigration cases" ON immigration_cases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- 4. Eliminar políticas existentes de admin_audit_log si las hay
DROP POLICY IF EXISTS "Admins can read audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Admins can insert audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Admins can update audit logs" ON admin_audit_log;

-- 5. Crear políticas correctas para admin_audit_log
CREATE POLICY "Admins can read audit logs" ON admin_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert audit logs" ON admin_audit_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update audit logs" ON admin_audit_log
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- 6. Verificar que las tablas existen y tienen las columnas correctas
-- Si no existe la tabla admin_audit_log, crearla
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(100),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Habilitar RLS en admin_audit_log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- 8. Verificar que el usuario admin existe
-- Reemplaza el UUID con el ID real del usuario autenticado
-- INSERT INTO admin_users (id, email, full_name, role) 
-- VALUES (
--   'f509de1f-ffd3-415f-9f8a-1eefd62d41dc', -- Reemplaza con el UUID real
--   'admin@eoir.gov',
--   'Administrador EOIR',
--   'super_admin'
-- ) ON CONFLICT (email) DO UPDATE SET
--   full_name = EXCLUDED.full_name,
--   role = EXCLUDED.role;
