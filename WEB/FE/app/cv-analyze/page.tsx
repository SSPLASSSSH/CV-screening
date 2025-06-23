"use client"

import type React from "react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, ArrowLeft, Zap, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PredictionResponse {
  prediksi: string
}

interface ErrorResponse {
  error: string
}

export default function CvAnalyze() {
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
      const response = await fetch('http://localhost:4000/api/analyze-cv', {
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
          <Link href="/" className="flex items-center space-x-3 text-white hover:text-white/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">CVnatization</span>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="relative px-6 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-6 shadow-2xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">AI CV Analyzer</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Upload your resume and let our advanced AI analyze it to suggest the perfect career path for you
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Clock className="w-4 h-4 mr-2" />
              Instant Analysis
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Private
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered
            </Badge>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Main Analyzer Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-white/10">
              <CardTitle className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
                <Upload className="w-6 h-6" />
                Upload Your Resume
              </CardTitle>
              <CardDescription className="text-white/80 text-center">
                Supported formats: PDF, DOC, DOCX • Maximum size: 10MB
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* File Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                    isDragOver
                      ? "border-cyan-400 bg-cyan-400/10 scale-105 shadow-lg"
                      : file
                        ? "border-green-400 bg-green-400/10 shadow-md"
                        : "border-white/30 hover:border-white/50 hover:bg-white/5"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                  />

                  <div className="space-y-4">
                    {file ? (
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-white text-lg">{file.name}</p>
                          <p className="text-white/60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-white/60" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-white mb-2">Drop your resume here</p>
                          <p className="text-white/60">or click to browse files</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !file}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </form>

              {/* Results Section */}
              <div className="space-y-6">
                {error && (
                  <Alert className="bg-red-500/10 border-red-500/30 text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                )}

                {prediction && (
                  <Card className="bg-green-500/10 border-green-500/30 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-green-300 mb-2 flex items-center gap-2">
                            Analysis Complete!
                            <span className="text-2xl">🎉</span>
                          </h3>
                          <p className="text-green-200 text-lg leading-relaxed mb-4">
                            Based on your resume analysis, you would be an excellent fit for:
                          </p>
                          <Card className="bg-green-400/20 border-green-400/30">
                            <CardContent className="p-6">
                              <p className="text-3xl font-bold text-green-300 text-center">{prediction}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!error && !prediction && !isLoading && (
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="pt-8 pb-8">
                      <div className="text-center text-white/60">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="text-lg">Upload your resume to get started with AI-powered career analysis</p>
                        <p className="text-sm mt-2 text-white/40">
                          Our AI will analyze your skills, experience, and qualifications to suggest the best career
                          paths
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Instant Results</h3>
                <p className="text-white/70 text-sm">Get your career analysis in under 30 seconds</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">100% Secure</h3>
                <p className="text-white/70 text-sm">Your data is encrypted and never stored permanently</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
                <p className="text-white/70 text-sm">Advanced machine learning for accurate predictions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <Shield className="w-4 h-4" />
            <span>Your resume data is processed securely and never stored permanently</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
