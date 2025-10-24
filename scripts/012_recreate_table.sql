-- Script para recrear la tabla immigration_cases completamente
-- Ejecutar este script en Supabase SQL Editor

-- ===========================================
-- 1. ELIMINAR TABLA EXISTENTE SI HAY PROBLEMAS
-- ===========================================

-- Comentar esta línea si no quieres eliminar la tabla existente
-- DROP TABLE IF EXISTS immigration_cases CASCADE;

-- ===========================================
-- 2. CREAR TABLA NUEVA CON TODAS LAS COLUMNAS
-- ===========================================

CREATE TABLE IF NOT EXISTS public.immigration_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(9) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  nationality VARCHAR(2) NOT NULL,
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

-- ===========================================
-- 3. HABILITAR RLS
-- ===========================================

ALTER TABLE immigration_cases ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- 4. CREAR POLÍTICAS DE SEGURIDAD
-- ===========================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Public can read immigration cases" ON immigration_cases;
DROP POLICY IF EXISTS "Admins can manage immigration cases" ON immigration_cases;

-- Crear políticas
CREATE POLICY "Public can read immigration cases" ON immigration_cases
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage immigration cases" ON immigration_cases
  FOR ALL USING (true);

-- ===========================================
-- 5. CREAR ÍNDICES
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_immigration_cases_registration_number 
ON immigration_cases(registration_number);

CREATE INDEX IF NOT EXISTS idx_immigration_cases_nationality 
ON immigration_cases(nationality);

CREATE INDEX IF NOT EXISTS idx_immigration_cases_appeal_status 
ON immigration_cases(appeal_status);

CREATE INDEX IF NOT EXISTS idx_immigration_cases_created_at 
ON immigration_cases(created_at);

-- ===========================================
-- 6. INSERTAR DATOS DE EJEMPLO
-- ===========================================

INSERT INTO immigration_cases (
  registration_number,
  full_name,
  nationality,
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
  'SV',
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
-- 7. VERIFICAR QUE TODO FUNCIONA
-- ===========================================

SELECT 'Verificación de estructura:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'immigration_cases' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Verificación de datos:' as info;
SELECT COUNT(*) as total_cases FROM immigration_cases;

SELECT 'Caso de ejemplo:' as info;
SELECT registration_number, full_name, appeal_status 
FROM immigration_cases 
WHERE registration_number = '215709190';

SELECT 'Verificación de políticas:' as info;
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'immigration_cases'
AND schemaname = 'public';
