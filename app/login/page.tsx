"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, LogIn, UserCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [studentLogin, setStudentLogin] = useState({ nim: "", password: "" })
  const [adminLogin, setAdminLogin] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
      if (JSON.parse(savedTheme)) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!studentLogin.nim || !studentLogin.password) {
      setErrors({ student: "NIM dan password wajib diisi" })
      return
    }

    // Simple validation - in real app, this would be server-side
    const applications = JSON.parse(localStorage.getItem("scholarshipApplications") || "[]")
    const student = applications.find((app: any) => app.nim === studentLogin.nim)

    if (student && studentLogin.password === "student123") {
      localStorage.setItem("currentUser", JSON.stringify({ type: "student", data: student }))
      router.push("/student-dashboard")
    } else {
      setErrors({ student: "NIM atau password salah" })
    }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!adminLogin.username || !adminLogin.password) {
      setErrors({ admin: "Username dan password wajib diisi" })
      return
    }

    // Simple admin validation
    if (adminLogin.username === "admin" && adminLogin.password === "admin123") {
      localStorage.setItem("currentUser", JSON.stringify({ type: "admin", data: { username: "admin" } }))
      router.push("/admin")
    } else {
      setErrors({ admin: "Username atau password salah" })
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-blue-50 to-orange-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="ghost" className="mr-2 sm:mr-4 rounded-2xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>
            </Link>
            <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Login</h1>
          </div>

          {/* Login Form */}
          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Masuk ke Sistem</CardTitle>
              <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Pilih jenis akun untuk melanjutkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="student" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl">
                  <TabsTrigger value="student" className="rounded-2xl text-sm">
                    Mahasiswa
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="rounded-2xl text-sm">
                    Admin
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="student">
                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="nim">NIM</Label>
                      <Input
                        id="nim"
                        value={studentLogin.nim}
                        onChange={(e) => setStudentLogin((prev) => ({ ...prev, nim: e.target.value }))}
                        className="rounded-2xl"
                        placeholder="Masukkan NIM"
                      />
                    </div>
                    <div>
                      <Label htmlFor="student-password">Password</Label>
                      <Input
                        id="student-password"
                        type="password"
                        value={studentLogin.password}
                        onChange={(e) => setStudentLogin((prev) => ({ ...prev, password: e.target.value }))}
                        className="rounded-2xl"
                        placeholder="Masukkan password"
                      />
                      <p className="text-xs text-gray-500 mt-1">Default: student123</p>
                    </div>
                    {errors.student && <p className="text-red-500 text-sm">{errors.student}</p>}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Login Mahasiswa
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="admin">
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={adminLogin.username}
                        onChange={(e) => setAdminLogin((prev) => ({ ...prev, username: e.target.value }))}
                        className="rounded-2xl"
                        placeholder="Masukkan username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminLogin.password}
                        onChange={(e) => setAdminLogin((prev) => ({ ...prev, password: e.target.value }))}
                        className="rounded-2xl"
                        placeholder="Masukkan password"
                      />
                      <p className="text-xs text-gray-500 mt-1">Default: admin / admin123</p>
                    </div>
                    {errors.admin && <p className="text-red-500 text-sm">{errors.admin}</p>}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login Admin
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
