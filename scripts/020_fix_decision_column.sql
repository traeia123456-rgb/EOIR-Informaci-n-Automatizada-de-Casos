-- Corregir el problema de la columna decision
-- Primero, copiar los datos de judicial_decision a decision si existen
UPDATE public.immigration_cases
SET decision = judicial_decision
WHERE decision IS NULL AND judicial_decision IS NOT NULL;

-- Luego, eliminar la columna judicial_decision si existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'immigration_cases' 
        AND column_name = 'judicial_decision'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.immigration_cases DROP COLUMN judicial_decision;
    END IF;
END $$;

-- Asegurarse de que la columna decision existe
ALTER TABLE public.immigration_cases
ADD COLUMN IF NOT EXISTS decision TEXT;