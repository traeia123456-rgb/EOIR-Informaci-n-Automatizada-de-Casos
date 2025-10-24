-- Script para corregir el problema de seguridad con la vista template_summary
-- Ejecutar este script en Supabase SQL Editor

-- 1. Eliminar la vista existente que expone datos sensibles
DROP VIEW IF EXISTS public.template_summary;

-- 2. Recrear la vista con acceso restringido
CREATE OR REPLACE VIEW public.template_summary AS
SELECT 
  t.id,
  t.name,
  t.description,
  t.category,
  t.status,
  t.created_at,
  t.updated_at,
  a.full_name as created_by_name
FROM 
  templates t
  LEFT JOIN admin_users a ON t.created_by = a.id
WHERE 
  t.status = 'active';

-- 3. Establecer permisos restrictivos en la vista
ALTER VIEW public.template_summary OWNER TO authenticated;

-- 4. Revocar todos los permisos existentes
REVOKE ALL ON public.template_summary FROM PUBLIC;
REVOKE ALL ON public.template_summary FROM anon;
REVOKE ALL ON public.template_summary FROM authenticated;

-- 5. Otorgar permisos específicos
GRANT SELECT ON public.template_summary TO authenticated;

-- 6. Crear política RLS para la vista
ALTER VIEW public.template_summary SECURITY DEFINER;
ALTER VIEW public.template_summary SET ROW LEVEL SECURITY TO ON;

DROP POLICY IF EXISTS "Users can only view active templates" ON public.template_summary;
CREATE POLICY "Users can only view active templates" ON public.template_summary
  FOR SELECT
  TO authenticated
  USING (status = 'active');