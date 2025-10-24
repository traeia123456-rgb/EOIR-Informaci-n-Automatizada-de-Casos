-- Agregar columna decision a la tabla immigration_cases
ALTER TABLE public.immigration_cases
ADD COLUMN IF NOT EXISTS decision TEXT;

-- Actualizar los registros existentes con valores nulos
UPDATE public.immigration_cases
SET decision = NULL
WHERE decision IS NULL;