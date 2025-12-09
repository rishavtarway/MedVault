const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename to avoid conflicts
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// File filter - only allow PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// ============================================
// API ENDPOINTS
// ============================================

// POST /documents/upload - Upload a PDF file
app.post('/documents/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }

    const { originalname, filename, size } = req.file;
    const filepath = path.join('uploads', filename);

    // Save metadata to database
    const sql = `INSERT INTO documents (filename, filepath, filesize) VALUES (?, ?, ?)`;

    db.run(sql, [originalname, filepath, size], function (err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to save document metadata' });
        }

        res.status(201).json({
            message: 'File uploaded successfully',
            document: {
                id: this.lastID,
                filename: originalname,
                filesize: size,
                created_at: new Date().toISOString()
            }
        });
    });
});

// GET /documents - List all documents
app.get('/documents', (req, res) => {
    const sql = `SELECT * FROM documents ORDER BY created_at DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch documents' });
        }

        res.json({ documents: rows });
    });
});

// GET /documents/:id - Download a specific document
app.get('/documents/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM documents WHERE id = ?`;

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch document' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Document not found' });
        }

        const filePath = path.join(__dirname, '..', row.filepath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${row.filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    });
});

// DELETE /documents/:id - Delete a document
app.delete('/documents/:id', (req, res) => {
    const { id } = req.params;

    // First, get the document to find the file path
    const selectSql = `SELECT * FROM documents WHERE id = ?`;

    db.get(selectSql, [id], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch document' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Document not found' });
        }

        const filePath = path.join(__dirname, '..', row.filepath);

        // Delete from database
        const deleteSql = `DELETE FROM documents WHERE id = ?`;

        db.run(deleteSql, [id], function (err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to delete document' });
            }

            // Delete the actual file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            res.json({ message: 'Document deleted successfully' });
        });
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size exceeds 10MB limit' });
        }
    }

    if (error.message === 'Only PDF files are allowed!') {
        return res.status(400).json({ error: error.message });
    }

    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  POST   /documents/upload  - Upload a PDF');
    console.log('  GET    /documents         - List all documents');
    console.log('  GET    /documents/:id     - Download a document');
    console.log('  DELETE /documents/:id     - Delete a document');
});
