-- Script para corregir la dirección del tribunal
-- Este script mueve los datos de court_location a court_address

-- ===========================================
-- 1. VERIFICAR SI HAY DATOS EN COURT_LOCATION
-- ===========================================

DO $$ 
BEGIN
    -- Primero verificamos si la columna court_location existe
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'court_location'
        AND table_schema = 'public'
    ) THEN
        -- Si existe, actualizamos court_address con los datos de court_location
        UPDATE immigration_cases
        SET court_address = court_location
        WHERE court_address IS NULL OR court_address = ''
        AND court_location IS NOT NULL AND court_location != '';

        -- Luego eliminamos la columna court_location si ya no es necesaria
        ALTER TABLE immigration_cases DROP COLUMN IF EXISTS court_location;
    END IF;
END $$;

-- ===========================================
-- 2. VERIFICAR QUE LA MIGRACIÓN FUNCIONÓ
-- ===========================================

SELECT 'Verificación de direcciones del tribunal:' as info;
SELECT registration_number, court_address
FROM immigration_cases
WHERE court_address IS NULL OR court_address = '';