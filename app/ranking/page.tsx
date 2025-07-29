"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Medal, Award } from "lucide-react"
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

export default function RankingPage() {
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

    // Load and sort applications by score
    const savedApplications = JSON.parse(localStorage.getItem("scholarshipApplications") || "[]")
    const sortedApplications = savedApplications
      .filter((app: StudentData) => app.eligible)
      .sort((a: StudentData, b: StudentData) => b.skor - a.skor)
    setApplications(sortedApplications)
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600"
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500"
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-600"
    return "bg-gradient-to-r from-blue-400 to-blue-600"
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-blue-50 to-orange-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="mr-4 rounded-2xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Ranking Beasiswa</h1>
        </div>

        {/* Description */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Peringkat Berdasarkan Skor</CardTitle>
            <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Ranking mahasiswa eligible berdasarkan formula: 0.4⋅IPK + 0.35⋅(1−Income/10jt) + 0.15⋅Prestasi +
              0.10⋅JamOrganisasi
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Ranking List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Belum ada mahasiswa yang eligible untuk beasiswa
                </p>
              </CardContent>
            </Card>
          ) : (
            applications.map((student, index) => {
              const rank = index + 1
              return (
                <Card
                  key={student.id}
                  className={`rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105 transition-all duration-200 ${
                    rank <= 3 ? "ring-2 ring-yellow-400" : ""
                  }`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                          {getRankIcon(rank)}
                        </div>
                        <div>
                          <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {student.nama}
                          </h3>
                          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            NIM: {student.nim}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <Badge
                          className={`${getRankBadge(rank)} text-white rounded-full px-3 py-1 mb-2 block sm:inline-block`}
                        >
                          Peringkat {rank}
                        </Badge>
                        <p className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {student.skor.toFixed(3)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>IPK</p>
                        <p
                          className={`font-semibold text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {student.ipk}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Pendapatan
                        </p>
                        <p className={`font-semibold text-xs sm:text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>
                          Rp {student.pendapatan.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Prestasi</p>
                        <p
                          className={`font-semibold text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {student.prestasi}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Organisasi
                        </p>
                        <p
                          className={`font-semibold text-sm sm:text-base ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {student.jamOrganisasi}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
