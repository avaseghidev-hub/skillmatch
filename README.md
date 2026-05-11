# SkillMatch

SkillMatch is an AI-powered full-stack job application tracking platform that helps users manage job applications, upload resumes, extract skills automatically, and analyze resume-to-job compatibility through intelligent skill matching.

The project demonstrates modern full-stack architecture using React, TypeScript, Tailwind CSS, Spring Boot, REST APIs, JWT authentication, OCR processing, and resume parsing workflows.

---

# Features

## Authentication & User Management

- User registration and login
- JWT-based authentication
- Protected frontend routes
- Persistent login sessions
- Logout functionality

## Resume & Profile System

- Resume PDF upload
- Automatic resume text extraction
- Skill extraction from resumes
- Profile onboarding flow
- Auto-filled profile fields from uploaded resumes
- Manual profile editing support

## Job Application Management

- Create, update, and delete job applications
- Store application details and notes
- Upload job description images
- OCR-based job description extraction
- Persistent application tracking

## AI Skill Matching

- Resume-to-job skill analysis
- Match score calculation
- Missing skills detection
- Matched skills visualization
- Stored analysis results

## User Experience

- Responsive UI
- Dark mode support
- Loading and error states
- Reusable UI component architecture
- Toast notifications
- Advanced filtering and search

---

# Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- Vite
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

## Database & DevOps

- PostgreSQL
- Docker
- Git & GitHub
- IntelliJ IDEA
- VS Code

---

# Architecture

The project follows a modular full-stack architecture:

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
│
├── screenshots/
└── README.md---

## Current Workflow
1. User registers and logs in
2. User uploads resume PDF
3. Resume text and skills are extracted automatically
4. User completes profile information
5. User adds job applications
6. Job descriptions can be pasted or extracted from images using OCR
7. SkillMatch analyzes compatibility between resume and job requirements


## Project Goals

The goal of SkillMatch is to build an intelligent career assistant platform that helps job seekers manage and improve their application process through automation, resume analysis, and AI-assisted skill matching.

The platform is designed to help users:

- organize and track job applications efficiently
- analyze how well their skills match job requirements
- identify missing or weak skill areas
- extract and structure information from resumes and job descriptions
- reduce manual work during job searching
- improve application quality through data-driven insights
- prepare for modern AI-assisted recruitment workflows

In addition to solving real-world job search challenges, the project also serves as a full-stack engineering portfolio demonstrating scalable architecture, clean UI systems, authentication workflows, OCR integration, resume parsing, and AI-powered analysis features.
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
- CI/CD pipeline
- Docker Compose environment
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
https://linkdin.com/in/azadeh-vaseghi
