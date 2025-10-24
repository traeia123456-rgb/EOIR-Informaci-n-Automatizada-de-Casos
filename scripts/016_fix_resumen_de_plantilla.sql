-- Script para corregir el problema de seguridad con la vista resumen_de_plantilla
-- Ejecutar este script en Supabase SQL Editor

-- 1. Eliminar la vista existente que expone datos sensibles
DROP VIEW IF EXISTS public.resumen_de_plantilla;

-- 2. Recrear la vista con acceso restringido
CREATE OR REPLACE VIEW public.resumen_de_plantilla AS
SELECT 
  t.id,
  t.name AS nombre,
  t.description AS descripcion,
  t.category AS categoria,
  t.status AS estado,
  t.created_at AS fecha_creacion,
  t.updated_at AS fecha_actualizacion,
  a.full_name AS creado_por
FROM 
  templates t
  LEFT JOIN admin_users a ON t.created_by = a.id
WHERE 
  t.status = 'active';

-- 3. Establecer permisos restrictivos en la vista
ALTER VIEW public.resumen_de_plantilla OWNER TO authenticated;

-- 4. Revocar todos los permisos existentes
REVOKE ALL ON public.resumen_de_plantilla FROM PUBLIC;
REVOKE ALL ON public.resumen_de_plantilla FROM anon;
REVOKE ALL ON public.resumen_de_plantilla FROM authenticated;

-- 5. Otorgar permisos específicos
GRANT SELECT ON public.resumen_de_plantilla TO authenticated;

-- 6. Crear política RLS para la vista
ALTER VIEW public.resumen_de_plantilla SECURITY DEFINER;
ALTER VIEW public.resumen_de_plantilla SET ROW LEVEL SECURITY TO ON;

DROP POLICY IF EXISTS "Los usuarios solo pueden ver plantillas activas" ON public.resumen_de_plantilla;
CREATE POLICY "Los usuarios solo pueden ver plantillas activas" ON public.resumen_de_plantilla
  FOR SELECT
  TO authenticated
  USING (estado = 'active');