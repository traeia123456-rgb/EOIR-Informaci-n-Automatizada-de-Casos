-- Agregar columna appeal_board_info a la tabla immigration_cases
ALTER TABLE public.immigration_cases
ADD COLUMN IF NOT EXISTS appeal_board_info TEXT;

-- Actualizar los registros existentes con valores nulos
UPDATE public.immigration_cases
SET appeal_board_info = NULL
WHERE appeal_board_info IS NULL;