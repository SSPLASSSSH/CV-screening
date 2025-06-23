package models

type Experience struct {
	Company     string `json:"company"`
	Position    string `json:"position"`
	Year        string `json:"year"`
	Description string `json:"description"`
}

type Education struct {
	Institution string `json:"institution"`
	Major       string `json:"major"`
	Year        string `json:"year"`
}

type CVData struct {
	FullName       string       `json:"fullName"`
	Title          string       `json:"title"`
	Email          string       `json:"email"`
	Phone          string       `json:"phone"`
	Summary        string       `json:"summary"`
	WorkExperience []Experience `json:"workExperience"`
	Education      []Education  `json:"education"`
	Skills         []string     `json:"skills"`
}
