"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from "lucide-react"
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

export default function RegisterPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    ipk: "",
    pendapatan: "",
    semester: "",
    sktm: false,
    beasiswaLain: false,
    pelanggaran: false,
    prestasi: "",
    jamOrganisasi: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
      if (JSON.parse(savedTheme)) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi"
    if (!formData.nim.trim()) newErrors.nim = "NIM wajib diisi"
    if (!formData.ipk || Number.parseFloat(formData.ipk) < 0 || Number.parseFloat(formData.ipk) > 4) {
      newErrors.ipk = "IPK harus antara 0-4"
    }
    if (!formData.pendapatan || Number.parseFloat(formData.pendapatan) < 0) {
      newErrors.pendapatan = "Pendapatan harus valid"
    }
    if (!formData.semester || Number.parseInt(formData.semester) < 1 || Number.parseInt(formData.semester) > 14) {
      newErrors.semester = "Semester harus antara 1-14"
    }
    if (!formData.prestasi || Number.parseFloat(formData.prestasi) < 0 || Number.parseFloat(formData.prestasi) > 1) {
      newErrors.prestasi = "Prestasi harus antara 0-1"
    }
    if (
      !formData.jamOrganisasi ||
      Number.parseFloat(formData.jamOrganisasi) < 0 ||
      Number.parseFloat(formData.jamOrganisasi) > 1
    ) {
      newErrors.jamOrganisasi = "Jam organisasi harus antara 0-1"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateEligibility = (data: any) => {
    const ipk = Number.parseFloat(data.ipk)
    const pendapatan = Number.parseFloat(data.pendapatan)
    const semester = Number.parseInt(data.semester)

    return (
      ipk >= 3.5 &&
      !data.beasiswaLain &&
      semester >= 3 &&
      semester <= 8 &&
      !data.pelanggaran &&
      (pendapatan <= 4000000 || data.sktm)
    )
  }

  const calculateScore = (data: any) => {
    const ipk = Number.parseFloat(data.ipk)
    const pendapatan = Number.parseFloat(data.pendapatan)
    const prestasi = Number.parseFloat(data.prestasi)
    const jamOrganisasi = Number.parseFloat(data.jamOrganisasi)

    return 0.4 * (ipk / 4) + 0.35 * (1 - pendapatan / 10000000) + 0.15 * prestasi + 0.1 * jamOrganisasi
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    const eligible = calculateEligibility(formData)
    const skor = calculateScore(formData)

    const studentData: StudentData = {
      id: Date.now().toString(),
      nama: formData.nama,
      nim: formData.nim,
      ipk: Number.parseFloat(formData.ipk),
      pendapatan: Number.parseFloat(formData.pendapatan),
      semester: Number.parseInt(formData.semester),
      sktm: formData.sktm,
      beasiswaLain: formData.beasiswaLain,
      pelanggaran: formData.pelanggaran,
      prestasi: Number.parseFloat(formData.prestasi),
      jamOrganisasi: Number.parseFloat(formData.jamOrganisasi),
      eligible,
      skor,
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem("scholarshipApplications") || "[]")
    existingData.push(studentData)
    localStorage.setItem("scholarshipApplications", JSON.stringify(existingData))

    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/success")
    }, 1000)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-blue-50 to-orange-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="ghost" className="mr-4 rounded-2xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Pendaftaran Beasiswa</h1>
          </div>

          {/* Form */}
          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Form Pendaftaran Mahasiswa</CardTitle>
              <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Lengkapi semua data dengan benar untuk proses seleksi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Data Pribadi */}
                <div className="space-y-6">
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Data Pribadi</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <Input
                        id="nama"
                        value={formData.nama}
                        onChange={(e) => handleInputChange("nama", e.target.value)}
                        className="rounded-2xl"
                        placeholder="Masukkan nama lengkap"
                      />
                      {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
                    </div>

                    <div>
                      <Label htmlFor="nim">NIM</Label>
                      <Input
                        id="nim"
                        value={formData.nim}
                        onChange={(e) => handleInputChange("nim", e.target.value)}
                        className="rounded-2xl"
                        placeholder="Masukkan NIM"
                      />
                      {errors.nim && <p className="text-red-500 text-sm mt-1">{errors.nim}</p>}
                    </div>
                  </div>
                </div>

                {/* Data Akademik */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Data Akademik
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ipk">IPK</Label>
                      <Input
                        id="ipk"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={formData.ipk}
                        onChange={(e) => handleInputChange("ipk", e.target.value)}
                        className="rounded-2xl"
                        placeholder="3.50"
                      />
                      {errors.ipk && <p className="text-red-500 text-sm mt-1">{errors.ipk}</p>}
                    </div>

                    <div>
                      <Label htmlFor="semester">Semester</Label>
                      <Select onValueChange={(value) => handleInputChange("semester", value)}>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue placeholder="Pilih semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(14)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              Semester {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
                    </div>
                  </div>
                </div>

                {/* Data Ekonomi */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Data Ekonomi</h3>

                  <div>
                    <Label htmlFor="pendapatan">Pendapatan Keluarga (Rp/bulan)</Label>
                    <Input
                      id="pendapatan"
                      type="number"
                      min="0"
                      value={formData.pendapatan}
                      onChange={(e) => handleInputChange("pendapatan", e.target.value)}
                      className="rounded-2xl"
                      placeholder="3000000"
                    />
                    {errors.pendapatan && <p className="text-red-500 text-sm mt-1">{errors.pendapatan}</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sktm"
                      checked={formData.sktm}
                      onCheckedChange={(checked) => handleInputChange("sktm", checked)}
                    />
                    <Label htmlFor="sktm">Memiliki SKTM (Surat Keterangan Tidak Mampu)</Label>
                  </div>
                </div>

                {/* Data Tambahan */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Data Tambahan
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prestasi">Skor Prestasi (0-1)</Label>
                      <Input
                        id="prestasi"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={formData.prestasi}
                        onChange={(e) => handleInputChange("prestasi", e.target.value)}
                        className="rounded-2xl"
                        placeholder="0.8"
                      />
                      {errors.prestasi && <p className="text-red-500 text-sm mt-1">{errors.prestasi}</p>}
                    </div>

                    <div>
                      <Label htmlFor="jamOrganisasi">Jam Organisasi (0-1)</Label>
                      <Input
                        id="jamOrganisasi"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={formData.jamOrganisasi}
                        onChange={(e) => handleInputChange("jamOrganisasi", e.target.value)}
                        className="rounded-2xl"
                        placeholder="0.6"
                      />
                      {errors.jamOrganisasi && <p className="text-red-500 text-sm mt-1">{errors.jamOrganisasi}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="beasiswaLain"
                        checked={formData.beasiswaLain}
                        onCheckedChange={(checked) => handleInputChange("beasiswaLain", checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="beasiswaLain" className="text-sm leading-5">
                        Sedang menerima beasiswa lain
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="pelanggaran"
                        checked={formData.pelanggaran}
                        onCheckedChange={(checked) => handleInputChange("pelanggaran", checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="pelanggaran" className="text-sm leading-5">
                        Pernah melakukan pelanggaran disiplin
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Daftar Beasiswa
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
