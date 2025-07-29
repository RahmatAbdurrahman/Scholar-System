"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, FileText } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
      if (JSON.parse(savedTheme)) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-blue-50 to-orange-50"
      }`}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className={`text-2xl ${darkMode ? "text-white" : "text-gray-900"}`}>
                Pendaftaran Berhasil!
              </CardTitle>
              <CardDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
                Data Anda telah tersimpan dan akan diproses sesuai dengan logika seleksi beasiswa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Link href="/">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all duration-200">
                    <Home className="h-4 w-4 mr-2" />
                    Kembali ke Beranda
                  </Button>
                </Link>
                <Link href="/ranking">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 bg-transparent"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Ranking
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
