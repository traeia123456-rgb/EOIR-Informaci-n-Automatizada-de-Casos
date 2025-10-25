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
  // Avoid importing Supabase server libraries inside middleware (Edge runtime).
  // Instead perform a lightweight check for authentication cookies that
  // Supabase sets. This prevents bundling Node-only APIs into the Edge
  // middleware and keeps redirects fast.

  const hasAccessToken = !!request.cookies.get("sb-access-token")?.value
  const hasRefreshToken = !!request.cookies.get("sb-refresh-token")?.value
  const hasSession = hasAccessToken || hasRefreshToken || !!request.cookies.get("sb")?.value

  if (!hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  // User appears to have a session cookie — continue. For stricter checks
  // consider validating the JWT on a server route instead of in middleware.
  return NextResponse.next({ request })
}
