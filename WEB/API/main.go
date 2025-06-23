package main

import (
	"log"
	"net/http"

	"github.com/rs/cors"

	"cv-screening/api/handlers"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/generate-cv", handlers.GenerateCvHandler)
	mux.HandleFunc("/api/analyze-cv", handlers.AnalyzeCvHandler)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"POST", "GET", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	})
	handler := c.Handler(mux)

	log.Println("Go API server starting on port 4000...")
	if err := http.ListenAndServe(":4000", handler); err != nil {
		log.Fatalf("Could not start server: %s\n", err)
	}
}
