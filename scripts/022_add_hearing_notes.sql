-- Agregar columna hearing_notes a la tabla immigration_cases
ALTER TABLE public.immigration_cases
ADD COLUMN IF NOT EXISTS hearing_notes TEXT;

-- Actualizar los registros existentes con valores nulos
UPDATE public.immigration_cases
SET hearing_notes = NULL
WHERE hearing_notes IS NULL;