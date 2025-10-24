"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return // Prevenir múltiples envíos
    setLoading(true)
    setError("")

    try {
      // Validación básica del lado del cliente
      if (!email.trim() || !password.trim()) {
        setError("Por favor, complete todos los campos")
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError("Credenciales inválidas. Por favor, verifique su email y contraseña.")
        return
      }

      if (data.user) {
        // Optimizar consultas paralelas
        const [adminResponse, _] = await Promise.all([
          supabase
            .from("admin_users")
            .select("id")
            .eq("id", data.user.id)
            .single(),
          supabase.from("admin_audit_log").insert({
            admin_id: data.user.id,
            action: "LOGIN",
            resource_type: "AUTH",
            details: { email: data.user.email },
          }).select()
        ])

        if (adminResponse.error || !adminResponse.data) {
          await supabase.auth.signOut()
          setError("Acceso denegado. No tiene permisos de administrador.")
          return
        }

        router.push("/admin/dashboard")
      }
    } catch (err) {
      setError("Error de conexión. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#1A365D] rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-sm"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Panel de Administración</h2>
          <p className="mt-2 text-sm text-gray-600">EOIR - Executive Office for Immigration Review</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingrese sus credenciales de administrador para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  placeholder="admin@eoir.gov"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-[#1A365D] hover:bg-[#2A4A6D] text-white">
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Sistema seguro protegido por autenticación</p>
          <p className="mt-1">Department of Justice | Executive Office for Immigration Review</p>
        </div>
      </div>
    </div>
  )
}
