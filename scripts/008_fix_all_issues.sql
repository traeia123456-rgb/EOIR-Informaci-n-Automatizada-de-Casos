-- Script completo para corregir todos los problemas
-- Ejecutar este script en Supabase SQL Editor

-- ===========================================
-- 1. CREAR TABLAS SI NO EXISTEN
-- ===========================================

-- Crear tabla immigration_cases si no existe
CREATE TABLE IF NOT EXISTS public.immigration_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(9) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  appeal_received_date DATE,
  appeal_status TEXT DEFAULT 'pending',
  brief_status_respondent TEXT,
  brief_status_dhs TEXT,
  court_address TEXT,
  court_phone TEXT,
  next_hearing_date DATE,
  next_hearing_info TEXT,
  judicial_decision TEXT,
  decision_date DATE,
  decision_court_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla admin_users si no existe
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla admin_audit_log si no existe
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

-- ===========================================
-- 2. HABILITAR RLS EN TODAS LAS TABLAS
-- ===========================================

ALTER TABLE immigration_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- 3. ELIMINAR POLÍTICAS EXISTENTES
-- ===========================================

-- Eliminar políticas de immigration_cases
DROP POLICY IF EXISTS "Public can read immigration cases" ON immigration_cases;
DROP POLICY IF EXISTS "Admins can manage immigration cases" ON immigration_cases;

-- Eliminar políticas de admin_users
DROP POLICY IF EXISTS "Admin users can read own data" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update own data" ON admin_users;

-- Eliminar políticas de admin_audit_log
DROP POLICY IF EXISTS "Admins can read audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Admins can insert audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Admins can update audit logs" ON admin_audit_log;

-- ===========================================
-- 4. CREAR NUEVAS POLÍTICAS CORRECTAS
-- ===========================================

-- Políticas para immigration_cases
CREATE POLICY "Public can read immigration cases" ON immigration_cases
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage immigration cases" ON immigration_cases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Políticas para admin_users
CREATE POLICY "Admin users can read own data" ON admin_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users can update own data" ON admin_users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para admin_audit_log
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

-- ===========================================
-- 5. INSERTAR USUARIO ADMIN
-- ===========================================

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

-- ===========================================
-- 6. INSERTAR DATOS DE EJEMPLO SI NO EXISTEN
-- ===========================================

INSERT INTO public.immigration_cases (
  registration_number,
  full_name,
  appeal_received_date,
  appeal_status,
  brief_status_respondent,
  brief_status_dhs,
  court_address,
  court_phone,
  next_hearing_info,
  judicial_decision,
  decision_date,
  decision_court_address
) VALUES (
  '215709190',
  'SANABRIA-ORELLANA, CLAUDIA JOSSELIN',
  '2024-03-14',
  'pending',
  'Todavía no se ha fijado una fecha límite para la presentación de escritos legales.',
  'Todavía no se ha fijado una fecha límite para la presentación de escritos legales.',
  'OFFICE OF THE CHIEF CLERK\n5107 LEESBURG PIKE, SUITE 2000\nFALLS CHURCH, VA 22041',
  '(703) 605-1007',
  'No hay audiencias futuras para este caso.',
  'El juez de inmigración ORDENÓ la expulsión.',
  '2024-02-29',
  '500 JEFFERSON ST., SUITE 300\nHOUSTON, TX 77002'
) ON CONFLICT (registration_number) DO NOTHING;

-- ===========================================
-- 7. CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_immigration_cases_registration_number 
ON public.immigration_cases(registration_number);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id 
ON admin_audit_log(admin_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at 
ON admin_audit_log(created_at);

-- ===========================================
-- 8. VERIFICAR QUE TODO FUNCIONA
-- ===========================================

SELECT 'Verificación final:' as info;
SELECT 'Tablas creadas:' as status, COUNT(*) as count FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('immigration_cases', 'admin_users', 'admin_audit_log');

SELECT 'Políticas creadas:' as status, COUNT(*) as count FROM pg_policies 
WHERE tablename IN ('immigration_cases', 'admin_users', 'admin_audit_log')
AND schemaname = 'public';

SELECT 'Usuario admin:' as status, COUNT(*) as count FROM admin_users 
WHERE id = 'f509de1f-ffd3-415f-9f8a-1eefd62d41dc';

SELECT 'Casos de ejemplo:' as status, COUNT(*) as count FROM immigration_cases;
