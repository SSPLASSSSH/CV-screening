"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Trash2,
  Plus,
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Download,
  Eye,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

interface Experience {
  company: string
  position: string
  year: string
  description: string
}

interface Education {
  institution: string
  major: string
  year: string
}

interface CVData {
  fullName: string
  title: string
  email: string
  phone: string
  summary: string
  workExperience: Experience[]
  education: Education[]
  skills: string[]
}

export default function CvMakerPage() {
  const [cvData, setCvData] = useState<CVData>({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    summary: "",
    workExperience: [{ company: "", position: "", year: "", description: "" }],
    education: [{ institution: "", major: "", year: "" }],
    skills: [""],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCvData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDynamicChange = (
    section: keyof CVData,
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    const list = cvData[section] as any[]
    list[index][name] = value
    setCvData((prev) => ({ ...prev, [section]: list }))
  }

  const handleSkillChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newSkills = [...cvData.skills]
    newSkills[index] = e.target.value
    setCvData((prev) => ({ ...prev, skills: newSkills }))
  }

  const addSectionItem = (section: "workExperience" | "education" | "skills") => {
    if (section === "skills") {
      setCvData((prev) => ({ ...prev, skills: [...prev.skills, ""] }))
    } else if (section === "workExperience") {
      setCvData((prev) => ({
        ...prev,
        workExperience: [...prev.workExperience, { company: "", position: "", year: "", description: "" }],
      }))
    } else {
      setCvData((prev) => ({
        ...prev,
        education: [...prev.education, { institution: "", major: "", year: "" }],
      }))
    }
  }

  const removeSectionItem = (section: keyof CVData, index: number) => {
    const list = cvData[section] as any[]
    if (list.length > 1) {
      const newList = list.filter((_, i) => i !== index)
      setCvData((prev) => ({ ...prev, [section]: newList }))
    }
  }

  const handleSubmitAndPreview = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setPdfUrl(null)

    try {
      const response = await fetch("http://localhost:4000/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cvData),
      })
      if (!response.ok) throw new Error("Failed to generate PDF")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-6 shadow-2xl">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">CV Maker</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Create your professional resume with our intuitive form builder and generate a beautiful PDF instantly
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <FileText className="w-4 h-4 mr-2" />
              Professional Templates
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Download className="w-4 h-4 mr-2" />
              Instant PDF Download
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Eye className="w-4 h-4 mr-2" />
              Live Preview
            </Badge>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
              <CardTitle className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
                <User className="w-6 h-6" />
                Build Your Professional CV
              </CardTitle>
              <CardDescription className="text-white/80 text-center">
                Fill out the form below to create your resume automatically
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmitAndPreview} className="space-y-8">
                {/* Personal Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Personal Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="fullName"
                      placeholder="Full Name"
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                    />
                    <Input
                      name="title"
                      placeholder="Professional Title (e.g., Full Stack Developer)"
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                    />
                    <Input
                      name="phone"
                      placeholder="Phone Number"
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                    />
                  </div>
                  <Textarea
                    name="summary"
                    placeholder="Professional Summary..."
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 min-h-[100px]"
                  />
                </div>

                <Separator className="bg-white/20" />

                {/* Work Experience Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Work Experience</h3>
                  </div>
                  {cvData.workExperience.map((exp, index) => (
                    <Card key={index} className="bg-white/5 border-white/20 relative">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Input
                            name="position"
                            placeholder="Position"
                            value={exp.position}
                            onChange={(e) => handleDynamicChange("workExperience", index, e)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                          />
                          <Input
                            name="company"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => handleDynamicChange("workExperience", index, e)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                          />
                        </div>
                        <Input
                          name="year"
                          placeholder="Year (e.g., 2020 - 2023)"
                          value={exp.year}
                          onChange={(e) => handleDynamicChange("workExperience", index, e)}
                          className="mb-4 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                        />
                        <Textarea
                          name="description"
                          placeholder="Job Description"
                          value={exp.description}
                          onChange={(e) => handleDynamicChange("workExperience", index, e)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                        />
                        {cvData.workExperience.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSectionItem("workExperience", index)}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSectionItem("workExperience")}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>

                <Separator className="bg-white/20" />

                {/* Education Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Education</h3>
                  </div>
                  {cvData.education.map((edu, index) => (
                    <Card key={index} className="bg-white/5 border-white/20 relative">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Input
                            name="institution"
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => handleDynamicChange("education", index, e)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                          />
                          <Input
                            name="major"
                            placeholder="Major"
                            value={edu.major}
                            onChange={(e) => handleDynamicChange("education", index, e)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                          />
                        </div>
                        <Input
                          name="year"
                          placeholder="Year (e.g., 2016 - 2020)"
                          value={edu.year}
                          onChange={(e) => handleDynamicChange("education", index, e)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                        />
                        {cvData.education.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSectionItem("education", index)}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSectionItem("education")}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>

                <Separator className="bg-white/20" />

                {/* Skills Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Skills</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cvData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="e.g., JavaScript"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                        />
                        {cvData.skills.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSectionItem("skills", index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSectionItem("skills")}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>

                <Separator className="bg-white/20" />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating CV...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Generate CV & Preview
                    </>
                  )}
                </Button>
              </form>

              {/* Error Display */}
              {error && (
                <Alert className="mt-6 bg-red-500/10 border-red-500/30 text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {/* PDF Preview */}
              {pdfUrl && (
                <div className="mt-8 space-y-6">
                  <div className="flex items-center justify-center gap-2 text-white">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h3 className="text-2xl font-semibold">CV Generated Successfully!</h3>
                  </div>

                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-6">
                      <div className="border border-white/20 rounded-lg aspect-[8.5/11] bg-white/5">
                        <iframe src={pdfUrl} className="w-full h-full rounded-lg" title="CV Preview"></iframe>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => window.open(pdfUrl, "_blank")}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button
                      onClick={() => window.open(pdfUrl, "_blank")}
                      variant="outline"
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <FileText className="w-4 h-4" />
            <span>Create professional resumes with ease using CVnatization</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
