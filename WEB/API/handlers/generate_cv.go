package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/jung-kurt/gofpdf"

	// PASTIKAN INI SESUAI DENGAN NAMA MODUL ANDA
	"cv-screening/api/models"
)

func GenerateCvHandler(w http.ResponseWriter, r *http.Request) {
	var data models.CVData
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// --- Header ---
	// Nama Lengkap
	pdf.SetFont("Arial", "B", 24)
	pdf.Cell(0, 12, data.FullName)
	pdf.Ln(12) // Pindah baris

	// Jabatan
	pdf.SetFont("Arial", "", 14)
	pdf.Cell(0, 8, data.Title)
	pdf.Ln(8)

	// Kontak (Email dan Telepon)
	pdf.SetFont("Arial", "", 10)
	contactInfo := data.Email + " | " + data.Phone
	pdf.Cell(0, 6, contactInfo)
	pdf.Ln(10)

	// Garis pemisah
	pdf.SetDrawColor(200, 200, 200)
	pdf.Line(10, pdf.GetY(), 200, pdf.GetY())
	pdf.Ln(10)

	// --- Ringkasan ---
	pdf.SetFont("Arial", "B", 14)
	pdf.Cell(0, 8, "Summary")
	pdf.Ln(8)
	pdf.SetFont("Arial", "", 11)
	pdf.MultiCell(0, 6, data.Summary, "", "", false) // MultiCell untuk teks panjang
	pdf.Ln(10)

	// Garis pemisah
	pdf.SetDrawColor(200, 200, 200)
	pdf.Line(10, pdf.GetY(), 200, pdf.GetY())
	pdf.Ln(10)

	// --- Pendidikan ---
	if len(data.Education) > 0 {
		pdf.SetFont("Arial", "B", 14)
		pdf.Cell(0, 8, "Education")
		pdf.Ln(10)
		pdf.SetFont("Arial", "", 11)
		for _, edu := range data.Education {
			pdf.SetFont("", "B", 0)
			pdf.Cell(0, 6, edu.Institution)
			pdf.Ln(5)

			pdf.SetFont("", "", 0)
			pdf.Cell(0, 6, edu.Major)
			pdf.Ln(5)

			pdf.SetFont("", "I", 0)
			pdf.Cell(0, 6, edu.Year)
			pdf.Ln(8)
		}
	}

	// Garis pemisah
	pdf.SetDrawColor(200, 200, 200)
	pdf.Line(10, pdf.GetY(), 200, pdf.GetY())
	pdf.Ln(10)

	// --- Pengalaman Kerja ---
	if len(data.WorkExperience) > 0 {
		pdf.SetFont("Arial", "B", 14)
		pdf.Cell(0, 8, "Work Experience")
		pdf.Ln(10)
		pdf.SetFont("Arial", "", 11)
		for _, exp := range data.WorkExperience {
			// Posisi dan Perusahaan (Bold)
			pdf.SetFont("", "B", 0)
			pdf.Cell(0, 6, exp.Position+" at "+exp.Company)
			pdf.Ln(5)

			// Tahun (Italic)
			pdf.SetFont("", "I", 0)
			pdf.Cell(0, 6, exp.Year)
			pdf.Ln(6)

			// Deskripsi (Regular)
			pdf.SetFont("", "", 0)
			pdf.MultiCell(0, 5, exp.Description, "", "", false)
			pdf.Ln(8)
		}
	}

	// Garis pemisah
	pdf.SetDrawColor(200, 200, 200)
	pdf.Line(10, pdf.GetY(), 200, pdf.GetY())
	pdf.Ln(10)

	// --- Keahlian ---
	if len(data.Skills) > 0 {
		pdf.SetFont("Arial", "B", 14)
		pdf.Cell(0, 8, "Skills")
		pdf.Ln(10)
		pdf.SetFont("Arial", "", 11)
		skillsStr := strings.Join(data.Skills, ", ")
		pdf.MultiCell(0, 6, skillsStr, "", "", false)
		pdf.Ln(10)
	}

	var pdfBuffer bytes.Buffer
	err = pdf.Output(&pdfBuffer)
	if err != nil {
		http.Error(w, "Failed to generate PDF", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=cv.pdf")
	w.Write(pdfBuffer.Bytes())
}
