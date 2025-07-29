"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, PieChart, BarChart3 } from "lucide-react"
import Link from "next/link"

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

export default function VisualizationPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [applications, setApplications] = useState<StudentData[]>([])

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
      if (JSON.parse(savedTheme)) {
        document.documentElement.classList.add("dark")
      }
    }

    const savedApplications = JSON.parse(localStorage.getItem("scholarshipApplications") || "[]")
    setApplications(savedApplications)
  }, [])

  // Venn Diagram Logic
  const vennData = {
    ipkGood: applications.filter((app) => app.ipk >= 3.5),
    noOtherScholarship: applications.filter((app) => !app.beasiswaLain),
    validSemester: applications.filter((app) => app.semester >= 3 && app.semester <= 8),
    noDiscipline: applications.filter((app) => !app.pelanggaran),
    economicEligible: applications.filter((app) => app.pendapatan <= 4000000 || app.sktm),
  }

  const eligible = applications.filter((app) => app.eligible)
  const notEligible = applications.filter((app) => !app.eligible)

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-blue-50 to-orange-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mr-4 rounded-2xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Visualisasi Data</h1>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Eligibility Pie Chart */}
          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={`flex items-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                <PieChart className="h-5 w-5 mr-2" />
                Status Kelayakan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Eligible</span>
                  </div>
                  <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {eligible.length} (
                    {applications.length > 0 ? ((eligible.length / applications.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Not Eligible</span>
                  </div>
                  <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {notEligible.length} (
                    {applications.length > 0 ? ((notEligible.length / applications.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${applications.length > 0 ? (eligible.length / applications.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={`flex items-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                <BarChart3 className="h-5 w-5 mr-2" />
                Distribusi Skor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["0.0-0.2", "0.2-0.4", "0.4-0.6", "0.6-0.8", "0.8-1.0"].map((range, index) => {
                  const [min, max] = range.split("-").map(Number)
                  const count = applications.filter((app) => app.skor >= min && app.skor < max).length
                  const percentage = applications.length > 0 ? (count / applications.length) * 100 : 0

                  return (
                    <div key={range} className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{range}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {count}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Venn Diagram Representation */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Analisis Kriteria Kelayakan</CardTitle>
            <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Breakdown kriteria berdasarkan logika proposisional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-2xl">
                <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>IPK ≥ 3.5</h4>
                <p className={`text-2xl font-bold ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
                  {vennData.ipkGood.length}
                </p>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  dari {applications.length} mahasiswa
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-2xl">
                <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Tidak Ada Beasiswa Lain
                </h4>
                <p className={`text-2xl font-bold ${darkMode ? "text-green-300" : "text-green-600"}`}>
                  {vennData.noOtherScholarship.length}
                </p>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  dari {applications.length} mahasiswa
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-2xl">
                <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Semester 3-8</h4>
                <p className={`text-2xl font-bold ${darkMode ? "text-purple-300" : "text-purple-600"}`}>
                  {vennData.validSemester.length}
                </p>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  dari {applications.length} mahasiswa
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-4 rounded-2xl">
                <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Tidak Ada Pelanggaran
                </h4>
                <p className={`text-2xl font-bold ${darkMode ? "text-orange-300" : "text-orange-600"}`}>
                  {vennData.noDiscipline.length}
                </p>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  dari {applications.length} mahasiswa
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-4 rounded-2xl">
                <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Ekonomi Layak</h4>
                <p className={`text-2xl font-bold ${darkMode ? "text-red-300" : "text-red-600"}`}>
                  {vennData.economicEligible.length}
                </p>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Income ≤ 4jt atau SKTM</p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-4 rounded-2xl">
                <h4 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Final Eligible</h4>
                <p className={`text-2xl font-bold ${darkMode ? "text-yellow-300" : "text-yellow-600"}`}>
                  {eligible.length}
                </p>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Memenuhi semua kriteria</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Truth Table */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Tabel Logika (Truth Table)</CardTitle>
            <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Evaluasi logika proposisional untuk setiap mahasiswa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <th className={`text-left p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Nama</th>
                    <th className={`text-center p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>IPK≥3.5</th>
                    <th className={`text-center p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>!Beasiswa</th>
                    <th className={`text-center p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Sem 3-8</th>
                    <th className={`text-center p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>!Disiplin</th>
                    <th className={`text-center p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Ekonomi</th>
                    <th className={`text-center p-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 10).map((app) => (
                    <tr key={app.id} className={`border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                      <td className={`p-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{app.nama}</td>
                      <td className="text-center p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            app.ipk >= 3.5
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {app.ipk >= 3.5 ? "T" : "F"}
                        </span>
                      </td>
                      <td className="text-center p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            !app.beasiswaLain
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {!app.beasiswaLain ? "T" : "F"}
                        </span>
                      </td>
                      <td className="text-center p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            app.semester >= 3 && app.semester <= 8
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {app.semester >= 3 && app.semester <= 8 ? "T" : "F"}
                        </span>
                      </td>
                      <td className="text-center p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            !app.pelanggaran
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {!app.pelanggaran ? "T" : "F"}
                        </span>
                      </td>
                      <td className="text-center p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            app.pendapatan <= 4000000 || app.sktm
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {app.pendapatan <= 4000000 || app.sktm ? "T" : "F"}
                        </span>
                      </td>
                      <td className="text-center p-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            app.eligible
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {app.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {applications.slice(0, 10).map((app) => (
                <Card key={app.id} className="rounded-2xl border bg-white/50 dark:bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{app.nama}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.eligible
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {app.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className={`mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>IPK≥3.5</p>
                        <span
                          className={`px-2 py-1 rounded ${
                            app.ipk >= 3.5
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {app.ipk >= 3.5 ? "T" : "F"}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className={`mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>!Beasiswa</p>
                        <span
                          className={`px-2 py-1 rounded ${
                            !app.beasiswaLain
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {!app.beasiswaLain ? "T" : "F"}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className={`mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Sem 3-8</p>
                        <span
                          className={`px-2 py-1 rounded ${
                            app.semester >= 3 && app.semester <= 8
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {app.semester >= 3 && app.semester <= 8 ? "T" : "F"}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className={`mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>!Disiplin</p>
                        <span
                          className={`px-2 py-1 rounded ${
                            !app.pelanggaran
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {!app.pelanggaran ? "T" : "F"}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className={`mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Ekonomi</p>
                        <span
                          className={`px-2 py-1 rounded ${
                            app.pendapatan <= 4000000 || app.sktm
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {app.pendapatan <= 4000000 || app.sktm ? "T" : "F"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {applications.length > 10 && (
              <p className={`text-center mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Menampilkan 10 dari {applications.length} data. Lihat dashboard admin untuk data lengkap.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
