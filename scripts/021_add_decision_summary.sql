-- Agregar columna decision_summary a la tabla immigration_cases
ALTER TABLE public.immigration_cases
ADD COLUMN IF NOT EXISTS decision_summary TEXT;

-- Actualizar los registros existentes con valores nulos
UPDATE public.immigration_cases
SET decision_summary = NULL
WHERE decision_summary IS NULL;