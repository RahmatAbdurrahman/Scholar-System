"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Search, Filter, Users, CheckCircle, XCircle, BarChart3 } from "lucide-react"
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

export default function AdminPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [applications, setApplications] = useState<StudentData[]>([])
  const [filteredApplications, setFilteredApplications] = useState<StudentData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
      if (JSON.parse(savedTheme)) {
        document.documentElement.classList.add("dark")
      }
    }

    // Load applications from localStorage
    const savedApplications = JSON.parse(localStorage.getItem("scholarshipApplications") || "[]")
    setApplications(savedApplications)
    setFilteredApplications(savedApplications)
  }, [])

  useEffect(() => {
    let filtered = applications

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.nim.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((app) => (filterStatus === "eligible" ? app.eligible : !app.eligible))
    }

    setFilteredApplications(filtered)
  }, [searchTerm, filterStatus, applications])

  const exportToCSV = () => {
    const headers = [
      "Nama",
      "NIM",
      "IPK",
      "Pendapatan",
      "Semester",
      "SKTM",
      "Beasiswa Lain",
      "Pelanggaran",
      "Prestasi",
      "Jam Organisasi",
      "Eligible",
      "Skor",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredApplications.map((app) =>
        [
          app.nama,
          app.nim,
          app.ipk,
          app.pendapatan,
          app.semester,
          app.sktm ? "Ya" : "Tidak",
          app.beasiswaLain ? "Ya" : "Tidak",
          app.pelanggaran ? "Ya" : "Tidak",
          app.prestasi,
          app.jamOrganisasi,
          app.eligible ? "Eligible" : "Not Eligible",
          app.skor.toFixed(3),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "scholarship_applications.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const stats = {
    total: applications.length,
    eligible: applications.filter((app) => app.eligible).length,
    notEligible: applications.filter((app) => !app.eligible).length,
    averageScore:
      applications.length > 0 ? applications.reduce((sum, app) => sum + app.skor, 0) / applications.length : 0,
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
              Dashboard Admin
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Link href="/visualization" className="w-full sm:w-auto">
              <Button variant="outline" className="rounded-2xl bg-transparent w-full sm:w-auto">
                <BarChart3 className="h-4 w-4 mr-2" />
                Visualisasi
              </Button>
            </Link>
            <Button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Total Pendaftar
              </CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Eligible
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.eligible}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Not Eligible
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {stats.notEligible}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Rata-rata Skor
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {stats.averageScore.toFixed(3)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama atau NIM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-2xl"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full rounded-2xl">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="eligible">Eligible</SelectItem>
                  <SelectItem value="not-eligible">Not Eligible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Data Pendaftar Beasiswa</CardTitle>
            <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Menampilkan {filteredApplications.length} dari {applications.length} pendaftar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead>IPK</TableHead>
                    <TableHead>Pendapatan</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Skor</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.nama}</TableCell>
                      <TableCell>{app.nim}</TableCell>
                      <TableCell>{app.ipk}</TableCell>
                      <TableCell>Rp {app.pendapatan.toLocaleString()}</TableCell>
                      <TableCell>{app.semester}</TableCell>
                      <TableCell>
                        <Badge variant={app.eligible ? "default" : "destructive"} className="rounded-full">
                          {app.eligible ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Eligible
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Not Eligible
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{app.skor.toFixed(3)}</TableCell>
                      <TableCell>{new Date(app.createdAt).toLocaleDateString("id-ID")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="rounded-2xl border bg-white/50 dark:bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {app.nama}
                        </h3>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>NIM: {app.nim}</p>
                      </div>
                      <Badge variant={app.eligible ? "default" : "destructive"} className="rounded-full">
                        {app.eligible ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Eligible
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Eligible
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>IPK:</span>
                        <span className={`ml-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{app.ipk}</span>
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Semester:</span>
                        <span className={`ml-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{app.semester}</span>
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Skor:</span>
                        <span className={`ml-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {app.skor.toFixed(3)}
                        </span>
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Tanggal:</span>
                        <span className={`ml-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {new Date(app.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className={`font-medium text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Pendapatan:
                      </span>
                      <span className={`ml-2 text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Rp {app.pendapatan.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
