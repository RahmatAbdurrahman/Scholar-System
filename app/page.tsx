"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users, Award, TrendingUp, Moon, Sun, LogIn } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
    }

    // Check current user
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")
    setCurrentUser(user)
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-blue-50 to-orange-50"
      }`}
    >
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-orange-500" />
            <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Budgy Scholar 🧩</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-2xl">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {currentUser.type === "admin" ? "Admin" : currentUser.data?.nama}
                </span>
                <Button
                  onClick={() => {
                    localStorage.removeItem("currentUser")
                    setCurrentUser(null)
                  }}
                  variant="outline"
                  className="rounded-2xl"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all duration-200">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl px-4 py-2">
            Sistem Informasi Seleksi Beasiswa
          </Badge>
          <h2 className={`text-5xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Seleksi Beasiswa Berbasis
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Logika Komputasi
            </span>
          </h2>
          <p className={`text-xl mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Sistem transparan dengan validasi logika proposisional dan predikat untuk menentukan kelayakan beasiswa
            mahasiswa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 px-8 py-3 text-lg">
                Daftar Beasiswa
              </Button>
            </Link>
            {currentUser?.type === "admin" && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 px-8 py-3 text-lg bg-transparent"
                >
                  Dashboard Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto text-orange-500 mb-4" />
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Pendaftaran Mahasiswa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Form input lengkap dengan validasi realtime untuk IPK, pendapatan, semester, dan kriteria lainnya
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-orange-500 mb-4" />
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Dashboard Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Kelola semua pendaftar dengan status kelayakan, skor otomatis, dan export data CSV/Excel
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Award className="h-12 w-12 mx-auto text-orange-500 mb-4" />
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Diagram Visual</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Diagram Venn interaktif dan tabel logika untuk visualisasi kriteria seleksi
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-orange-500 mb-4" />
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Sistem Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Peringkat otomatis berdasarkan fungsi skor dengan bobot IPK, prestasi, dan pendapatan
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Logic Formula Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className={`text-3xl ${darkMode ? "text-white" : "text-gray-900"}`}>
              Logika Seleksi Beasiswa
            </CardTitle>
            <CardDescription className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Berbasis Logika Proposisional dan Predikat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 p-4 sm:p-6 rounded-2xl">
              <h4 className={`font-semibold mb-3 text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                Formula Kelayakan:
              </h4>
              <code className={`text-xs sm:text-sm break-all ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Eligible(x) ≡ IPK(x) ≥ 3.5 ∧ !BeasiswaLain(x) ∧ Semester(x) ∈ [3..8] ∧ !Disiplin(x) ∧ (Income(x) ≤ 4jt ∨
                SKTM(x))
              </code>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 p-4 sm:p-6 rounded-2xl">
              <h4 className={`font-semibold mb-3 text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
                Formula Skor:
              </h4>
              <code className={`text-xs sm:text-sm break-all ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Skor(x) = 0.4⋅IPK + 0.35⋅(1−Income/10jt) + 0.15⋅Prestasi + 0.10⋅JamOrganisasi
              </code>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className={`py-8 text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        <p>&copy; 2025 Budgy Scholar. Sistem Informasi Seleksi Beasiswa Berbasis Logika Komputasi.</p>
      </footer>
    </div>
  )
}
