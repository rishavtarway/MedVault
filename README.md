# MedVault - Medical Document Portal

A simple full-stack application for managing medical documents (PDFs).

<img width="1675" height="700" alt="Screenshot 2025-12-09 at 3 43 32 PM" src="https://github.com/user-attachments/assets/12263ab5-7ec1-4ca2-903a-83365243b8b9" />


## Features

- Upload PDF documents (drag and drop or click)
- View all uploaded documents in a list
- Download any document
- Delete documents when not needed


## Tech Stack

- Frontend -> React + Vite
- Backend -> Node.js + Express
- Database -> SQLite
- File Upload -> Multer


## Project Structure

- backend/ -> Express server and API endpoints
- frontend/ -> React application with components
- uploads/ -> Uploaded PDF files stored here
- design.md -> Design document with architecture and API specs
- README.md -> This file


## Getting Started

Prerequisites: Node.js (v14+) and npm

1. Clone the repository
   ```
   git clone https://github.com/rishavtarway/MedVault.git
   cd MedVault
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```


## Running Locally

Terminal 1 - Start backend:
```
cd backend
npm start
```
Backend runs on http://localhost:3001

Terminal 2 - Start frontend:
```
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173


## API Endpoints

- POST /documents/upload -> Upload a PDF file
- GET /documents -> List all documents
- GET /documents/:id -> Download a file
- DELETE /documents/:id -> Delete a file


## Example API Calls

Upload a file:
```
curl -X POST -F "file=@test.pdf" http://localhost:3001/documents/upload
```

List all documents:
```
curl http://localhost:3001/documents
```

Download a document:
```
curl -O http://localhost:3001/documents/1
```

Delete a document:
```
curl -X DELETE http://localhost:3001/documents/1
```


## Database Schema

```sql
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    filesize INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```


## Assumptions

- Single user (no authentication)
- PDF files only
- Max file size: 10MB
- Local file storage

