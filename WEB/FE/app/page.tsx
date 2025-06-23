"use client"

import type React from "react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import Link from "next/link"
import { FileText, Zap, ArrowRight, Sparkles, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PredictionResponse {
  prediksi: string
}

interface ErrorResponse {
  error: string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [prediction, setPrediction] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError("")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0]
      const allowedTypes = [".pdf", ".doc", ".docx"]
      const fileExtension = "." + droppedFile.name.split(".").pop()?.toLowerCase()

      if (allowedTypes.includes(fileExtension)) {
        setFile(droppedFile)
        setError("")
      } else {
        setError("Please upload a PDF, DOC, or DOCX file.")
      }
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError("Please choose a file first.")
      return
    }

    setIsLoading(true)
    setPrediction("")
    setError("")

    const formData = new FormData()
    formData.append("pdf_file", file)

    try {
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      })

      const result: PredictionResponse | ErrorResponse = await response.json()

      if (!response.ok) {
        if ("error" in result) {
          throw new Error(result.error)
        }
        throw new Error("An unknown error occurred during prediction.")
      }

      if ("prediksi" in result) {
        setPrediction(result.prediksi)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred.")
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">CVnatization</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-8 shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              CVnatization
              <span className="block text-4xl md:text-6xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mt-4">
                by Roger Moreno
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12">
              Transform your career journey with AI-powered tools. Analyze your resume or create a new one with our
              advanced technology.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Analysis
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Instant Results
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                100% Secure
              </Badge>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Choose Your Tool</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Whether you need to analyze an existing resume or create a new one, we have the perfect tool for you
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* CV Analyzer Card */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-6 text-center">AI CV Analyzer</h3>
                <p className="text-white/80 mb-8 leading-relaxed text-center text-lg">
                  Upload your existing resume and let our advanced AI analyze it to suggest the perfect career path for
                  you. Get instant insights, skill assessments, and personalized recommendations.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                    <span>Instant career path suggestions</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                    <span>Skills and experience analysis</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                    <span>PDF, DOC, DOCX support</span>
                  </div>
                </div>

                <Link href="/cv-analyze">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                    Analyze My Resume
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* CV Maker Card */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FileText className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-6 text-center">CV Maker</h3>
                <p className="text-white/80 mb-8 leading-relaxed text-center text-lg">
                  Create a professional resume from scratch with our intuitive form builder. Fill out your details and
                  generate a beautiful, ATS-friendly PDF instantly.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span>Professional templates</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span>Instant PDF generation</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span>ATS-friendly format</span>
                  </div>
                </div>

                <Link href="/cv-maker">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                    Create New CV
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-white/70 text-xl">Choose your path to career success</p>
            <p className="text-white/50 text-lg mt-2">Both tools are powered by advanced AI technology</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-xl">CVnatization</span>
                <p className="text-white/60 text-sm">by Roger Moreno</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <Shield className="w-4 h-4" />
              <span>Your data is processed securely and never stored permanently</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
