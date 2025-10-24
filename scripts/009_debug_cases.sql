-- Script de diagnóstico para problemas con casos
-- Ejecutar este script en Supabase SQL Editor

-- ===========================================
-- 1. VERIFICAR ESTRUCTURA DE LA TABLA
-- ===========================================

SELECT 'Estructura de immigration_cases:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'immigration_cases' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ===========================================
-- 2. VERIFICAR POLÍTICAS DE SEGURIDAD
-- ===========================================

SELECT 'Políticas de immigration_cases:' as info;
SELECT policyname, cmd, permissive, roles, qual 
FROM pg_policies 
WHERE tablename = 'immigration_cases'
AND schemaname = 'public'
ORDER BY policyname;

-- ===========================================
-- 3. VERIFICAR DATOS EXISTENTES
-- ===========================================

SELECT 'Datos existentes en immigration_cases:' as info;
SELECT 
  id,
  registration_number,
  full_name,
  appeal_status,
  created_at,
  updated_at
FROM immigration_cases 
ORDER BY created_at DESC
LIMIT 10;

-- ===========================================
-- 4. VERIFICAR RLS
-- ===========================================

SELECT 'RLS habilitado en immigration_cases:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'immigration_cases'
AND schemaname = 'public';

-- ===========================================
-- 5. PROBAR CONSULTAS SIMPLES
-- ===========================================

SELECT 'Prueba de consulta 1 - Todos los casos:' as info;
SELECT COUNT(*) as total_cases FROM immigration_cases;

SELECT 'Prueba de consulta 2 - Caso específico:' as info;
SELECT registration_number, full_name 
FROM immigration_cases 
WHERE registration_number = '215709190';

SELECT 'Prueba de consulta 3 - Casos pendientes:' as info;
SELECT COUNT(*) as casos_pendientes 
FROM immigration_cases 
WHERE appeal_status ILIKE '%pending%' OR appeal_status ILIKE '%pendiente%';

-- ===========================================
-- 6. VERIFICAR USUARIO ADMIN
-- ===========================================

SELECT 'Usuario admin:' as info;
SELECT id, email, full_name, role 
FROM admin_users 
WHERE id = 'f509de1f-ffd3-415f-9f8a-1eefd62d41dc';

-- ===========================================
-- 7. VERIFICAR LOGS DE AUDITORÍA
-- ===========================================

SELECT 'Logs de auditoría recientes:' as info;
SELECT action, resource_type, resource_id, created_at
FROM admin_audit_log 
ORDER BY created_at DESC
LIMIT 5;

-- ===========================================
-- 8. PROBAR INSERCIÓN DE CASO DE PRUEBA
-- ===========================================

-- Deshabilitar RLS temporalmente para pruebas
-- ALTER TABLE immigration_cases DISABLE ROW LEVEL SECURITY;

-- INSERT INTO immigration_cases (
--   registration_number,
--   full_name,
--   appeal_status,
--   brief_status_respondent,
--   brief_status_dhs
-- ) VALUES (
--   'TEST123456',
--   'CASO DE PRUEBA',
--   'Pendiente',
--   'Estado de prueba',
--   'Estado de prueba'
-- );

-- Habilitar RLS nuevamente
-- ALTER TABLE immigration_cases ENABLE ROW LEVEL SECURITY;

-- Verificar el caso de prueba
-- SELECT * FROM immigration_cases WHERE registration_number = 'TEST123456';
