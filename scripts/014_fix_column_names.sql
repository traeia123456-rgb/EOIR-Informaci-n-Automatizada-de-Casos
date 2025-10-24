
-- Script para corregir nombres de columnas
-- Ejecutar este script en Supabase SQL Editor

-- ===========================================
-- 1. RENOMBRAR COLUMNAS PARA QUE COINCIDAN CON EL CÓDIGO
-- ===========================================

-- Renombrar alien_registration_number a registration_number
ALTER TABLE immigration_cases 
RENAME COLUMN alien_registration_number TO registration_number;

-- Renombrar case_status a appeal_status (si no existe ya)
-- Primero verificar si appeal_status ya existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'appeal_status'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases 
        RENAME COLUMN case_status TO appeal_status;
    END IF;
END $$;

-- Renombrar court_location a court_address (si no existe ya)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'court_address'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases 
        RENAME COLUMN court_location TO court_address;
    END IF;
END $$;

-- Renombrar case_details a next_hearing_info (si no existe ya)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'next_hearing_info'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases 
        RENAME COLUMN case_details TO next_hearing_info;
    END IF;
END $$;

-- Renombrar respondent_brief_status a brief_status_respondent (si no existe ya)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'brief_status_respondent'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases 
        RENAME COLUMN respondent_brief_status TO brief_status_respondent;
    END IF;
END $$;

-- Renombrar dhs_brief_status a brief_status_dhs (si no existe ya)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'brief_status_dhs'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases 
        RENAME COLUMN dhs_brief_status TO brief_status_dhs;
    END IF;
END $$;

-- ===========================================
-- 2. AGREGAR RESTRICCIÓN UNIQUE A registration_number
-- ===========================================

-- Agregar restricción unique si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'immigration_cases' 
        AND constraint_name LIKE '%registration_number%'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases 
        ADD CONSTRAINT immigration_cases_registration_number_unique 
        UNIQUE (registration_number);
    END IF;
END $$;

-- ===========================================
-- 3. VERIFICAR ESTRUCTURA DESPUÉS DE CAMBIOS
-- ===========================================

SELECT 'Estructura después de renombrar columnas:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'immigration_cases' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ===========================================
-- 4. INSERTAR DATOS DE EJEMPLO
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
-- 5. VERIFICAR QUE TODO FUNCIONA
-- ===========================================

SELECT 'Verificación final:' as info;
SELECT COUNT(*) as total_cases FROM immigration_cases;

SELECT 'Caso de ejemplo:' as info;
SELECT registration_number, full_name, appeal_status 
FROM immigration_cases 
WHERE registration_number = '215709190';
