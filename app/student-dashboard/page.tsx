"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, CheckCircle, XCircle, Award, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface StudentData {
  id: string
  nama: string
  nim: string
  ipk: number
  pendapatan: number
  semester: number
  sktm: boolean
  beasiswaLain: boolean
  pelanggaran: boolean
  prestasi: number
  jamOrganisasi: number
  eligible: boolean
  skor: number
  createdAt: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [rank, setRank] = useState<number>(0)

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
      if (JSON.parse(savedTheme)) {
        document.documentElement.classList.add("dark")
      }
    }

    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (currentUser.type !== "student") {
      router.push("/login")
      return
    }

    setStudentData(currentUser.data)

    // Calculate rank
    const applications = JSON.parse(localStorage.getItem("scholarshipApplications") || "[]")
    const eligibleStudents = applications
      .filter((app: StudentData) => app.eligible)
      .sort((a: StudentData, b: StudentData) => b.skor - a.skor)

    const studentRank = eligibleStudents.findIndex((app: StudentData) => app.id === currentUser.data.id) + 1
    setRank(studentRank)
  }, [router])

  const logout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!studentData) {
    return <div>Loading...</div>
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-blue-50 to-orange-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" className="mr-4 rounded-2xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Dashboard Mahasiswa
            </h1>
          </div>
          <Button onClick={logout} variant="outline" className="rounded-2xl bg-transparent w-full sm:w-auto">
            Logout
          </Button>
        </div>

        {/* Student Profile */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <CardTitle className={`text-xl sm:text-2xl ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {studentData.nama}
                </CardTitle>
                <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  NIM: {studentData.nim}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status Card */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className={`flex items-center ${darkMode ? "text-white" : "text-gray-900"}`}>
              Status Beasiswa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                {studentData.eligible ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <div>
                      <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Selamat! Anda Eligible
                      </h3>
                      <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                        Anda memenuhi semua kriteria beasiswa
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-12 w-12 text-red-500" />
                    <div>
                      <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Tidak Eligible
                      </h3>
                      <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                        Anda belum memenuhi kriteria beasiswa
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Badge
                variant={studentData.eligible ? "default" : "destructive"}
                className="text-base sm:text-lg px-4 py-2 rounded-2xl"
              >
                {studentData.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Score and Rank */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={`flex items-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                <Award className="h-5 w-5 mr-2" />
                Skor Anda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {studentData.skor.toFixed(3)}
                </p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>dari maksimal 1.000</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={`flex items-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                <Calendar className="h-5 w-5 mr-2" />
                Peringkat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {studentData.eligible ? (
                  <>
                    <p className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>#{rank}</p>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>dari mahasiswa eligible</p>
                  </>
                ) : (
                  <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Tidak masuk peringkat</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Detail Informasi</CardTitle>
            <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Rincian data yang Anda daftarkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>IPK</label>
                  <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {studentData.ipk}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Semester
                  </label>
                  <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {studentData.semester}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Pendapatan Keluarga
                  </label>
                  <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Rp {studentData.pendapatan.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>SKTM</label>
                  <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {studentData.sktm ? "Ya" : "Tidak"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Prestasi
                  </label>
                  <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {studentData.prestasi}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Jam Organisasi
                  </label>
                  <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {studentData.jamOrganisasi}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Beasiswa Lain
                  </label>
                  <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {studentData.beasiswaLain ? "Ya" : "Tidak"}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Pelanggaran Disiplin
                  </label>
                  <p className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {studentData.pelanggaran ? "Ya" : "Tidak"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
