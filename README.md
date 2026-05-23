# SkillMatch

SkillMatch is an AI-powered full-stack job application tracking platform that helps users manage job applications, upload resumes, extract skills automatically, parse job descriptions with OCR, and analyze resume-to-job compatibility through intelligent skill matching.

The project demonstrates modern full-stack architecture using React, TypeScript, Tailwind CSS, Spring Boot, REST APIs, JWT authentication, OCR processing, resume parsing workflows, and reusable UI system design.

---

# Features

## Authentication & User Management

- User registration and login
- JWT-based authentication
- Protected frontend routes
- Persistent login sessions
- User dropdown menu
- Profile access from header
- Logout functionality

## Resume & Profile System

- Resume PDF upload
- Automatic resume text extraction
- Skill extraction from resumes
- Profile onboarding flow
- Auto-filled profile fields from uploaded resumes
- Manual profile editing support
- Profile completion indicator
- Live profile completion percentage
- Resume management panel
- Replace resume support
- Remove resume support
- Parsed resume status display
- Detected skills preview

## Job Application Management

- Create, update, and delete job applications
- Store application details and notes
- View application details in modal
- Edit existing job applications
- Upload job description images
- OCR-based job description extraction
- Auto-filled job fields from extracted descriptions
- Persistent application tracking
- Delete confirmation workflow

## AI Skill Matching

- Resume-to-job skill analysis
- Match score calculation
- Missing skills detection
- Matched skills visualization
- Recommendation panel
- Stored analysis results

## Filtering & Search

- Search applications
- Filter by application status
- Filter by work mode
- Filter by location
- Filter by created date range
- Filter by updated date range
- URL-synced filters
- Empty state for no results

## User Experience

- Responsive UI
- Dark mode support
- Loading and error states
- Reusable UI component architecture
- Toast notifications
- Modal system
- Confirm modal
- Reusable badges, buttons, cards, inputs, selects, textareas
- Scrollable content sections
- Collapsible sections
- Clean SaaS-style profile and application workflows

## DevOps & Infrastructure

- Dockerized frontend
- Dockerized backend
- Full-stack Docker Compose setup
- Swagger/OpenAPI documentation
- GitHub Actions CI workflow
- Production-ready container architecture


---

# Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- Vite
- React Router DOM
- React Hooks
- Context API
- Axios

## Backend

- Spring Boot
- Java
- REST APIs
- JWT Authentication
- Maven
- Apache PDFBox
- Tesseract OCR
- Hibernate / JPA

## Database & DevOps

- PostgreSQL
- Docker
- Docker Compose
- GitHub Actions CI
- Swagger / OpenAPI
- Git & GitHub
- IntelliJ IDEA
- VS Code
---

# Installation & Setup

## Clone Repository
```bash
git clone https://github.com/avaseghidev-hub/skillmatch.git
cd skillmatch-fullstack
```
## Run with Docker
```bash
docker compose up --build
```

## Frontend
```bash
http://localhost:3000
```

## Backend API
```bash
http://localhost:8080/api/v1
```

## Swagger API Docs
```bash
http://localhost:8080/api/v1/swagger-ui/index.html
```
---

# Architecture

The project follows a modular full-stack architecture with feature-based frontend organization and domain-based backend modules.

```bash
skillmatch-fullstack/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── applications/
│   │   │   ├── profile/
│   │   │   └── resume/
│   │   ├── api/
│   │   └── types/
│
├── backend/
│   ├── src/main/java/com/azadeh/skillmatch/
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── resume/
│   │   ├── jobapplication/
│   │   ├── jobdescription/
│   │   └── skillmatchresult/
│   │
│   ├── src/test/java/com/azadeh/skillmatch/
│   │   ├── auth/
│   │   ├── skillmatchresult/
│   │   └── SkillmatchApplicationTests.java
│
├── screenshots/
└── README.md

```
The project is designed with production-oriented separation of concerns, reusable frontend modules, stateless JWT authentication, containerized services, and scalable backend domain architecture.

---

## Current Workflow

1. User registers and logs in
2. User uploads a resume PDF
3. Resume text is extracted automatically
4. Skills and target role can be detected from the resume
5. User completes or edits profile information
6. Profile completion percentage updates live
7. User can replace or remove the uploaded resume
8. User adds job applications
9. Job descriptions can be pasted manually or extracted from images using OCR
10. SkillMatch analyzes compatibility between resume skills and job requirements
11. User can track, filter, update, and manage job applications


## Project Goals

The goal of SkillMatch is to build an intelligent career assistant platform that helps job seekers manage and improve their application process through automation, resume analysis, OCR-based extraction, and AI-assisted skill matching.

The platform is designed to help users:

- organize and track job applications efficiently
- analyze how well their skills match job requirements
- identify missing or weak skill areas
- extract and structure information from resumes and job descriptions
- reduce manual work during job searching
- improve application quality through data-driven insights
- prepare for modern AI-assisted recruitment workflows
- manage profile and resume data in one place
---

## Screenshots

Screenshots will be added soon.

---

## Future Improvements

- Multi-language support (EN/DE/FA)
- AI-enhanced skill recommendations
- Resume improvement suggestions
- ATS score analysis
- AI-generated cover letters
- Vector search & semantic matching
- Advanced resume parsing with NLP
- React Query integration
- Role-based authorization
- Automated testing
- Kubernetes deployment
- Cloud deployment
- Email notifications and reminders
- Job scraping integrations
- Analytics dashboard and reporting
---

## Author

Azadeh Vaseghi

GitHub:
https://github.com/avaseghidev-hub

LinkedIn:
https://linkedin.com/in/azadeh-vaseghi