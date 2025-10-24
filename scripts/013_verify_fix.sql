-- Script de verificación rápida
-- Ejecutar este script en Supabase SQL Editor para verificar que todo funciona

-- 1. Verificar estructura de la tabla
SELECT 'Estructura de immigration_cases:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'immigration_cases' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar que registration_number existe
SELECT 'Verificación de registration_number:' as info;
SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'immigration_cases' 
    AND column_name = 'registration_number'
    AND table_schema = 'public'
) as registration_number_exists;

-- 3. Probar inserción de un caso de prueba
SELECT 'Probando inserción de caso de prueba:' as info;
INSERT INTO immigration_cases (
  registration_number,
  full_name,
  appeal_status,
  brief_status_respondent,
  brief_status_dhs
) VALUES (
  'TEST123456',
  'CASO DE PRUEBA',
  'pending',
  'Estado de prueba',
  'Estado de prueba'
) ON CONFLICT (registration_number) DO NOTHING;

-- 4. Verificar que se insertó correctamente
SELECT 'Verificando inserción:' as info;
SELECT registration_number, full_name, appeal_status 
FROM immigration_cases 
WHERE registration_number = 'TEST123456';

-- 5. Probar consulta por número de registro
SELECT 'Probando consulta por número de registro:' as info;
SELECT registration_number, full_name 
FROM immigration_cases 
WHERE registration_number = '215709190';

-- 6. Contar total de casos
SELECT 'Total de casos en la base de datos:' as info;
SELECT COUNT(*) as total_cases FROM immigration_cases;
