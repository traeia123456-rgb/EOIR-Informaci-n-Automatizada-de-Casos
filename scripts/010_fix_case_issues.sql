-- Script para corregir problemas con casos
-- Ejecutar este script en Supabase SQL Editor

-- ===========================================
-- 1. VERIFICAR Y CORREGIR ESTRUCTURA DE TABLA
-- ===========================================

-- Asegurar que la tabla tiene todas las columnas necesarias
ALTER TABLE immigration_cases 
ADD COLUMN IF NOT EXISTS judicial_decision TEXT,
ADD COLUMN IF NOT EXISTS decision_date DATE,
ADD COLUMN IF NOT EXISTS decision_court_address TEXT;

-- ===========================================
-- 2. CORREGIR POLÍTICAS DE SEGURIDAD
-- ===========================================

-- Eliminar políticas existentes que puedan estar causando conflictos
DROP POLICY IF EXISTS "Public can read immigration cases" ON immigration_cases;
DROP POLICY IF EXISTS "Admins can manage immigration cases" ON immigration_cases;

-- Crear políticas más permisivas para debugging
CREATE POLICY "Public can read immigration cases" ON immigration_cases
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage immigration cases" ON immigration_cases
  FOR ALL USING (true);

-- ===========================================
-- 3. VERIFICAR QUE EL USUARIO ADMIN EXISTE
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
-- 4. INSERTAR DATOS DE EJEMPLO SI NO EXISTEN
-- ===========================================

INSERT INTO immigration_cases (
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
  'Pendiente',
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
-- 5. CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_immigration_cases_registration_number 
ON immigration_cases(registration_number);

CREATE INDEX IF NOT EXISTS idx_immigration_cases_appeal_status 
ON immigration_cases(appeal_status);

CREATE INDEX IF NOT EXISTS idx_immigration_cases_created_at 
ON immigration_cases(created_at);

-- ===========================================
-- 6. VERIFICAR QUE TODO FUNCIONA
-- ===========================================

SELECT 'Verificación final:' as info;

SELECT 'Total de casos:' as status, COUNT(*) as count FROM immigration_cases;

SELECT 'Caso de ejemplo:' as status, registration_number, full_name 
FROM immigration_cases 
WHERE registration_number = '215709190';

SELECT 'Políticas activas:' as status, COUNT(*) as count 
FROM pg_policies 
WHERE tablename = 'immigration_cases'
AND schemaname = 'public';

SELECT 'Usuario admin:' as status, COUNT(*) as count 
FROM admin_users 
WHERE id = 'f509de1f-ffd3-415f-9f8a-1eefd62d41dc';

-- ===========================================
-- 7. PROBAR CONSULTAS CRÍTICAS
-- ===========================================

SELECT 'Prueba de consulta por número de registro:' as info;
SELECT * FROM immigration_cases WHERE registration_number = '215709190';

SELECT 'Prueba de consulta de casos pendientes:' as info;
SELECT COUNT(*) as casos_pendientes 
FROM immigration_cases 
WHERE appeal_status ILIKE '%pendiente%';

SELECT 'Prueba de consulta de casos completados:' as info;
SELECT COUNT(*) as casos_completados 
FROM immigration_cases 
WHERE judicial_decision IS NOT NULL AND judicial_decision != '';
