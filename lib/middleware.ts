import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const CACHE_MAX_AGE = 60 // 1 minuto en segundos

// Lista de rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/auth",
  "/admin/login",
  "/case-information"
]

export async function updateSession(request: NextRequest) {
  // Verificar si la ruta es estática o no requiere autenticación
  const pathname = request.nextUrl.pathname
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  
  // Si es una ruta pública, no necesitamos verificar la autenticación
  if (isPublicRoute) {
    return NextResponse.next({
      request,
      headers: {
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=30`,
      }
    })
  }

  // Solo creamos el cliente de Supabase si es necesario
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
        },
      },
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
      },
    },
  )

  // Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si no hay usuario y no es una ruta pública, redirigir al login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  // Usuario autenticado, continuar
  return NextResponse.next({ request })
}
