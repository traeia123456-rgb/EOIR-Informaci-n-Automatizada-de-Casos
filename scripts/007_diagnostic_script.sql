-- Script de diagnóstico para verificar el estado de la base de datos
-- Ejecutar este script en Supabase SQL Editor para identificar problemas

-- 1. Verificar que las tablas existen
SELECT 'Tablas existentes:' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('immigration_cases', 'admin_users', 'admin_audit_log')
ORDER BY table_name;

-- 2. Verificar las columnas de cada tabla
SELECT 'Columnas de immigration_cases:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'immigration_cases' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Columnas de admin_users:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Columnas de admin_audit_log:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'admin_audit_log' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar si RLS está habilitado
SELECT 'RLS habilitado:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('immigration_cases', 'admin_users', 'admin_audit_log')
AND schemaname = 'public';

-- 4. Verificar las políticas existentes
SELECT 'Políticas existentes:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('immigration_cases', 'admin_users', 'admin_audit_log')
AND schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. Verificar usuarios admin
SELECT 'Usuarios admin:' as info;
SELECT id, email, full_name, role, created_at 
FROM admin_users 
ORDER BY created_at;

-- 6. Verificar datos de casos
SELECT 'Casos de inmigración:' as info;
SELECT COUNT(*) as total_cases FROM immigration_cases;

-- 7. Verificar logs de auditoría
SELECT 'Logs de auditoría:' as info;
SELECT COUNT(*) as total_logs FROM admin_audit_log;

-- 8. Probar consultas que están fallando
SELECT 'Prueba de consulta 1 (casos pendientes):' as info;
SELECT COUNT(*) as casos_pendientes 
FROM immigration_cases 
WHERE appeal_status ILIKE '%pending%' OR judicial_decision IS NULL;

SELECT 'Prueba de consulta 2 (casos completados):' as info;
SELECT COUNT(*) as casos_completados 
FROM immigration_cases 
WHERE judicial_decision IS NOT NULL AND judicial_decision != '';

SELECT 'Prueba de consulta 3 (casos con expulsión):' as info;
SELECT COUNT(*) as casos_expulsion 
FROM immigration_cases 
WHERE judicial_decision ILIKE '%expulsión%';
