/**
 * Resume Routes
 *
 * GET  /api/resume           — Public: download the active resume PDF
 * GET  /api/resume/info      — Public: metadata about the current resume
 * POST /api/resume           — Admin: upload a new PDF (replaces the old one)
 * DELETE /api/resume         — Admin: delete the current resume
 */

'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');

const Resume          = require('../models/Resume');
const { upload, UPLOADS_DIR } = require('../middleware/upload');

const router = express.Router();

// ─── Admin guard ─────────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  next();
}

// ─── GET /api/resume/info ─────────────────────────────────────────────────────
// Public — returns metadata about the current active resume
router.get('/info', async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true }).sort({ uploadedAt: -1 });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'No resume uploaded yet.' });
    }
    return res.json({
      success: true,
      data: {
        originalName: resume.originalName,
        downloadAs:   resume.downloadAs,
        sizeBytes:    resume.sizeBytes,
        sizeMB:       resume.sizeMB,
        uploadedAt:   resume.uploadedAt,
      },
    });
  } catch (err) {
    console.error('Resume info error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/resume ─────────────────────────────────────────────────────────
// Public — stream/download the active resume PDF
router.get('/', async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true }).sort({ uploadedAt: -1 });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'No resume available. Please check back later.' });
    }

    // Verify file still exists on disk
    if (!fs.existsSync(resume.filePath)) {
      await Resume.findByIdAndUpdate(resume._id, { isActive: false });
      return res.status(404).json({ success: false, message: 'Resume file not found on server.' });
    }

    // Stream the PDF as a download
    res.setHeader('Content-Disposition', `attachment; filename="${resume.downloadAs}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', resume.sizeBytes);

    const fileStream = fs.createReadStream(resume.filePath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error('Resume stream error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Error streaming file.' });
      }
    });

  } catch (err) {
    console.error('Resume GET error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── POST /api/resume ─────────────────────────────────────────────────────────
// Admin — upload a new PDF resume
// Field name in the multipart form must be "resume"
router.post('/', requireAdmin, (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, message: 'File too large. Maximum size is 5 MB.' });
      }
      return res.status(400).json({ success: false, message: err.message || 'Upload failed.' });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded. Use field name "resume".' });
  }

  try {
    // Deactivate all previous resumes
    await Resume.updateMany({ isActive: true }, { isActive: false });

    // Optional: set a custom download filename from body
    const downloadAs = req.body.downloadAs
      ? req.body.downloadAs.trim()
      : `Anand_Narayan_Dwivedi_Resume_${new Date().getFullYear()}.pdf`;

    // Save metadata
    const resume = await Resume.create({
      originalName: req.file.originalname,
      storedName:   req.file.filename,
      filePath:     req.file.path,
      sizeBytes:    req.file.size,
      mimeType:     req.file.mimetype,
      downloadAs,
      isActive:     true,
      uploadedAt:   new Date(),
    });

    console.log(`📄  Resume uploaded: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

    return res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully.',
      data: {
        originalName: resume.originalName,
        downloadAs:   resume.downloadAs,
        sizeBytes:    resume.sizeBytes,
        sizeMB:       resume.sizeMB,
        uploadedAt:   resume.uploadedAt,
        downloadUrl:  `${req.protocol}://${req.get('host')}/api/resume`,
      },
    });
  } catch (err) {
    // Clean up uploaded file on DB error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Resume POST error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error saving resume.' });
  }
});

// ─── DELETE /api/resume ───────────────────────────────────────────────────────
// Admin — delete the current active resume (file + DB record)
router.delete('/', requireAdmin, async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true }).sort({ uploadedAt: -1 });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'No active resume to delete.' });
    }

    // Delete file from disk
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    // Remove DB record
    await Resume.findByIdAndDelete(resume._id);

    console.log(`🗑️   Resume deleted: ${resume.originalName}`);
    return res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (err) {
    console.error('Resume DELETE error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
