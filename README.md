# 🚀 JobSpark – Full Stack Job Portal System

A modern **Full Stack Job Portal** that connects **Job Seekers** with **Employers** through an intuitive and responsive web application. The platform allows employers to post job opportunities while enabling candidates to search, apply, and track their applications seamlessly.

Built with **React + Vite**, **Node.js + Express.js**, and **MySQL**.

---

## 🌟 Key Features

### 👨‍💼 Job Seeker

* Search jobs by title, location, experience, and job type
* View complete job details
* Apply for jobs with a cover letter
* Save and bookmark favorite jobs
* Track application status in a personalized dashboard
* Manage profile and skills

### 🏢 Employer

* Secure employer registration & login
* Create and publish job postings
* View all applicants
* Update application status
* Manage company profile
* Monitor applications and job views

### 🔐 Authentication & Security

* JWT Authentication
* Password hashing using bcryptjs
* Role-Based Authorization (Job Seeker, Employer, Admin)
* Protected Routes
* Helmet Security
* Express Rate Limiter
* CORS Enabled

---

## 🛠 Tech Stack

### Frontend

* React 18
* Vite
* React Router DOM
* Context API
* Fetch API
* CSS

### Backend

* Node.js
* Express.js
* MySQL2
* JWT
* bcryptjs
* Helmet
* CORS
* Express Rate Limit

### Database

* MySQL
* Relational Database Design
* Foreign Key Relationships

---

## 📂 Project Structure

```text
job-portal/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── app.js
│   └── package.json
│
└── database/
    └── schema.sql
```

---

## ✨ Application Modules

* Authentication System
* Job Management
* Company Management
* Application Tracking
* Dashboard
* User Profile
* Company Directory

---

## 🚀 Getting Started


### Database Setup

```bash
mysql -u root -p < database/schema.sql
```

---

### Backend

```bash
cd backend

npm install

cp .env.example .env

npm run dev
```

Runs on:

```
http://localhost:5000
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## 🔑 Demo Credentials

### 👤 Job Seeker

```
Email:
john@seeker.com

Password:
demo123
```

### 🏢 Employer

```
Email:
employer@techcorp.com

Password:
demo123
```

### 👑 Admin

```
Email:
admin@jobportal.com

Password:
demo123
```

---

## 📡 REST API

| Method | Endpoint                       | Access        |
| ------ | ------------------------------ | ------------- |
| POST   | /api/auth/register             | Public        |
| POST   | /api/auth/login                | Public        |
| GET    | /api/jobs                      | Public        |
| GET    | /api/jobs/:id                  | Public        |
| GET    | /api/jobs/search               | Public        |
| POST   | /api/jobs                      | Employer      |
| POST   | /api/applications/:jobId/apply | Job Seeker    |
| GET    | /api/applications/my           | Job Seeker    |
| PUT    | /api/applications/:id/status   | Employer      |
| GET    | /api/companies                 | Public        |
| GET    | /api/users/dashboard           | Authenticated |

---

## 📱 Screens

* 🏠 Home Page
* 🔍 Job Search
* 📄 Job Details
* 🔐 Login
* 📝 Register
* 👤 User Dashboard
* 🏢 Employer Dashboard
* ➕ Post Job
* 🏢 Company Directory

---

## 🎯 Future Improvements

* Resume Upload
* Cloudinary Integration
* Email Notifications
* LinkedIn OAuth Login
* Real-time Chat
* Admin Dashboard
* AI Resume Matching
* Elasticsearch Search
* React Native Mobile App

---

## 💻 Installation

```bash
Frontend

npm install
npm run dev
```

```bash
Backend

npm install
npm run dev
```

---

## 👩‍💻 Author

**Anjali Kumari**

B.Tech (Computer Science & Engineering – Artificial Intelligence)

Full Stack Web Developer | AI/ML Enthusiast



---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Your support motivates future development and improvements.

---

## 📜 License

This project is licensed under the MIT License.
