# 💜 Mahesh Digital Studio — Quick Print System

<div align="center">

<img src="quickprint-frontend/public/mahesh-banner.png" 
alt="Mahesh Digital Studio Logo"
height="100"
 width="220" />

### 🖨️ Upload. Manage. Print. Simplify.

**A modern online document upload and printing management system.**

[![Live Application](https://img.shields.io/badge/Live%20Application-Visit%20Now-6C3BFF?style=for-the-badge&logo=vercel&logoColor=white)](https://mahesh-qr-service-quickprint-fronte.vercel.app/upload)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://mahesh-qr-service.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/mohitkpani/mahesh-qr-service)

</div>

---

## 🌟 About the Project

**Mahesh Digital Studio Quick Print System** is a full-stack web application designed to simplify document printing services.

Customers can upload their documents and images online by providing their name and mobile number, selecting print preferences, and submitting their files.

The administrator can access a dedicated dashboard to view uploaded documents, manage customer print requests, open files, and initiate quick printing.

The application connects a React frontend with a Spring Boot backend and is deployed using Vercel and Render.

## ✨ Features

### 👤 Customer Portal

- 📄 Upload PDF documents.
- 🖼️ Upload images (JPG, JPEG, PNG).
- 👤 Enter customer name and mobile number.
- 🎨 Select black-and-white or color printing.
- 📑 Upload multiple documents.
- 🔢 Select the required number of copies.
- 📤 Submit documents online.
- 📱 Simple and responsive interface.

### 🔐 Admin Dashboard

- 🔑 Admin login.
- 📊 Dashboard overview and system status.
- 📂 View all uploaded customer documents.
- 👥 View customer information.
- 📦 Monitor uploaded storage and document count.
- 👁️ Open uploaded files.
- 🖨️ Quick Print functionality.
- 🔄 Refresh uploaded document records.
- 🗑️ Close jobs and remove associated documents.
- ⚙️ Dashboard settings interface.

## 🛠️ Tech Stack

| Technology        | Purpose                               |
| ----------------- | ------------------------------------- |
| React.js          | Frontend development                  |
| Vite              | Frontend build tool                   |
| Java 21           | Backend programming                   |
| Spring Boot       | REST API development                  |
| Maven             | Backend dependency management         |
| Axios             | HTTP communication                    |
| HTML5 & CSS3      | User interface                        |
| JavaScript        | Application logic                     |
| WebSocket / STOMP | Real-time communication configuration |
| Vercel            | Frontend deployment                   |
| Render            | Backend deployment                    |
| Git & GitHub      | Version control                       |

## 🏗️ Project Architecture

```text
mahesh-qr-service/
│
├── MaheshPrint/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/backend/
│   │       │       ├── config/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       └── ...
│   │       └── resources/
│   ├── Dockerfile
│   └── pom.xml
│
├── quickprint-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── Services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── package.json
│
├── .gitignore
└── README.md
```

_Some internal folders may vary depending on the current implementation._

## 🚀 Live Deployment

| Component       | Platform | URL                                                                               |
| --------------- | -------- | --------------------------------------------------------------------------------- |
| Frontend        | Vercel   | [Open Application](https://mahesh-qr-service-quickprint-fronte.vercel.app/upload) |
| Admin Dashboard | Vercel   | [Admin Login](https://mahesh-qr-service-quickprint-fronte.vercel.app/login)       |
| Backend API     | Render   | [Backend Service](https://mahesh-qr-service.onrender.com)                         |
| Source Code     | GitHub   | [Repository](https://github.com/mohitkpani/mahesh-qr-service)                     |

## 💻 Run Locally

### Prerequisites

Install the following:

- Java 21 or later
- Node.js and npm
- Maven
- Git
- Visual Studio Code or another IDE

### 1. Clone the Repository

```bash
git clone https://github.com/mohitkpani/mahesh-qr-service.git
```

```bash
cd mahesh-qr-service
```

### 2. Start the Backend

Navigate to the backend directory:

```bash
cd MaheshPrint
```

Configure the required environment variables:

**Windows PowerShell:**

```powershell
$env:ADMIN_USERNAME="your_admin_username"
$env:ADMIN_PASSWORD="your_strong_password"
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 3. Start the Frontend

Open another terminal:

```bash
cd quickprint-frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8080/api
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## 🔗 API Endpoints

The backend exposes the following application endpoints:

| Method | Endpoint                                   | Description                    |
| ------ | ------------------------------------------ | ------------------------------ |
| POST   | `/api/auth/login`                          | Admin login                    |
| POST   | `/api/upload`                              | Upload customer documents      |
| GET    | `/api/jobs`                                | Retrieve uploaded jobs         |
| GET    | `/api/jobs/{jobId}/documents/{documentId}` | Open a document                |
| DELETE | `/api/jobs/{jobId}`                        | Delete a job and its documents |

### WebSocket

```text
/ws
```

The WebSocket endpoint is configured for application communication.

## 📋 Upload Specifications

| Specification     | Limit / Supported Value |
| ----------------- | ----------------------- |
| Supported formats | PDF, JPG, JPEG, PNG     |
| Maximum file size | 10 MB per file          |
| Maximum files     | 10 per upload           |
| Print copies      | 1–100                   |
| Print modes       | Black & White, Color    |

## 🔒 Environment Configuration

### Backend

Configure these environment variables in your deployment environment:

| Variable         | Description                      |
| ---------------- | -------------------------------- |
| `ADMIN_USERNAME` | Administrator username           |
| `ADMIN_PASSWORD` | Administrator password           |
| `PORT`           | Server port (provided by Render) |

### Frontend

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

Never commit passwords, private credentials, or secret keys to GitHub.

## ☁️ Deployment

### Frontend — Vercel

1. Import the GitHub repository into Vercel.
2. Select `quickprint-frontend` as the Root Directory.
3. Choose Vite as the framework.
4. Configure the production environment variable `VITE_API_URL`.
5. Deploy the project.

### Backend — Render

1. Create a new Render Web Service.
2. Connect the GitHub repository.
3. Set the Root Directory to `MaheshPrint`.
4. Select Docker as the deployment environment.
5. Configure `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
6. Deploy the backend.

## ⚠️ Production Considerations

Before using this application for real customer documents:

- Configure persistent file storage or external object storage. Temporary files on a Render free instance may be lost after restarts or redeployments.
- Implement server-side authorization for all administrator-only endpoints.
- Use secure password handling and HTTPS.
- Avoid exposing customer documents or personal information to unauthorized users.
- Configure backups and appropriate document-retention policies.

## 🔮 Future Enhancements

- [ ] Persistent cloud document storage.
- [ ] Strong server-side admin authentication and authorization.
- [ ] Customer upload tracking and status notifications.
- [ ] Print job completion status.
- [ ] Advanced dashboard analytics.
- [ ] Customer download and order history.
- [ ] Improved mobile experience.

## 👨‍💻 Developer

**Mohit Kumar Pani**

Full Stack Developer

- GitHub: [@mohitkpani](https://github.com/mohitkpani)
- Project Repository: [mahesh-qr-service](https://github.com/mohitkpani/mahesh-qr-service)

## 🏢 Business

**Mahesh Digital Studio**

Document Printing | Photo Services | Recharge | Digital Services

---

<div align="center">

### 💜 Built with passion for Mahesh Digital Studio

**Upload • Manage • Print**

⭐ If you like this project, consider giving the repository a star!

</div>
