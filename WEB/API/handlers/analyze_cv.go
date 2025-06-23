package handlers

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
)

var pythonApiURL = "http://127.0.0.1:5000/predict"

func AnalyzeCvHandler(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Could not parse multipart form: "+err.Error(), http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("pdf_file")
	if err != nil {
		http.Error(w, "Invalid file: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("pdf_file", header.Filename)
	if err != nil {
		http.Error(w, "Could not create form file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if _, err := io.Copy(part, file); err != nil {
		http.Error(w, "Could not copy file content: "+err.Error(), http.StatusInternalServerError)
		return
	}
	writer.Close()

	req, err := http.NewRequest("POST", pythonApiURL, body)
	if err != nil {
		http.Error(w, "Could not create request to Python API: "+err.Error(), http.StatusInternalServerError)
		return
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Could not send request to Python API: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	pythonResponse, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Could not read response from Python API: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(pythonResponse)
}
