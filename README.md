# MedVault - Medical Document Portal

A simple full-stack application for managing medical documents (PDFs). Built as part of the INI8 Labs Full Stack Developer Intern assignment.

![Medical Document Portal](https://via.placeholder.com/800x400/0f172a/0ea5e9?text=MedVault+Portal)

## ✨ Features

- **Upload PDF Documents** - Drag & drop or click to upload
- **View All Documents** - See your uploaded files in a clean list
- **Download Files** - One-click download for any document
- **Delete Documents** - Remove files you no longer need
- **Beautiful Dark UI** - Modern healthcare-themed design

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | SQLite |
| File Upload | Multer |

## 📁 Project Structure

```
ini8-medical-portal/
├── backend/
│   ├── server.js       # Express server & API endpoints
│   ├── database.js     # SQLite configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── DocumentList.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── uploads/            # Uploaded PDF files stored here
├── design.md           # Design document
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ini8-medical-portal.git
   cd ini8-medical-portal
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```
   Server runs on: http://localhost:3001

2. **Start the frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: http://localhost:5173

3. **Open your browser** and go to http://localhost:5173

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/documents/upload` | POST | Upload a PDF file |
| `/documents` | GET | List all documents |
| `/documents/:id` | GET | Download a file |
| `/documents/:id` | DELETE | Delete a file |

## 📝 Example API Calls

### Upload a file
```bash
curl -X POST -F "file=@test.pdf" http://localhost:3001/documents/upload
```

### List all documents
```bash
curl http://localhost:3001/documents
```

### Download a document
```bash
curl -O http://localhost:3001/documents/1
```

### Delete a document
```bash
curl -X DELETE http://localhost:3001/documents/1
```

## 📊 Database Schema

```sql
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    filesize INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Assumptions

- Single user (no authentication)
- PDF files only
- Max file size: 10MB
- Local file storage

## 📄 License

This project was created for the INI8 Labs Full Stack Developer Intern assignment.

---

Made with ❤️ for INI8 Labs
