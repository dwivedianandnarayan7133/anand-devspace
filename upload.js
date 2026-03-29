/**
 * Multer Upload Middleware
 *
 * Handles multipart/form-data file uploads for the resume PDF endpoint.
 * Files are stored in server/uploads/ with a timestamped filename.
 */

'use strict';

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Ensure the uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ─── Disk Storage ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename(req, file, cb) {
    // e.g.  resume_1714892345678.pdf
    const timestamp = Date.now();
    const ext       = path.extname(file.originalname).toLowerCase() || '.pdf';
    cb(null, `resume_${timestamp}${ext}`);
  },
});

// ─── File Filter — PDFs only ───────────────────────────────────────────────────
function fileFilter(req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF files are allowed.'));
  }
}

// ─── Configured multer instance ────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
    files: 1,
  },
});

module.exports = { upload, UPLOADS_DIR };
