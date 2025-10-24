-- Script para corregir columnas faltantes en immigration_cases
-- Ejecutar este script en Supabase SQL Editor

-- ===========================================
-- 1. VERIFICAR ESTRUCTURA ACTUAL
-- ===========================================

SELECT 'Estructura actual de immigration_cases:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'immigration_cases' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ===========================================
-- 2. AGREGAR COLUMNAS FALTANTES
-- ===========================================

-- Agregar registration_number si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'registration_number'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN registration_number VARCHAR(9) UNIQUE;
    END IF;
END $$;

-- Agregar full_name si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'full_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN full_name TEXT NOT NULL;
    END IF;
END $$;

-- Agregar appeal_received_date si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'appeal_received_date'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN appeal_received_date DATE;
    END IF;
END $$;

-- Agregar appeal_status si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'appeal_status'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN appeal_status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Agregar brief_status_respondent si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'brief_status_respondent'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN brief_status_respondent TEXT;
    END IF;
END $$;

-- Agregar brief_status_dhs si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'brief_status_dhs'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN brief_status_dhs TEXT;
    END IF;
END $$;

-- Agregar court_address si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'court_address'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN court_address TEXT;
    END IF;
END $$;

-- Agregar court_phone si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'court_phone'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN court_phone TEXT;
    END IF;
END $$;

-- Agregar next_hearing_date si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'next_hearing_date'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN next_hearing_date DATE;
    END IF;
END $$;

-- Agregar next_hearing_info si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'next_hearing_info'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN next_hearing_info TEXT;
    END IF;
END $$;

-- Agregar judicial_decision si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'judicial_decision'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN judicial_decision TEXT;
    END IF;
END $$;

-- Agregar decision_date si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'decision_date'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN decision_date DATE;
    END IF;
END $$;

-- Agregar decision_court_address si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'decision_court_address'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE immigration_cases ADD COLUMN decision_court_address TEXT;
    END IF;
END $$;

-- ===========================================
-- 3. VERIFICAR ESTRUCTURA DESPUÉS DE CAMBIOS
-- ===========================================

SELECT 'Estructura después de agregar columnas:' as info;
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
