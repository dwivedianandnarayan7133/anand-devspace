/**
 * Resume — Mongoose Model
 *
 * Stores metadata about the uploaded resume PDF.
 * Only ONE active resume record exists at any time.
 * The actual file is stored in server/uploads/.
 */

'use strict';

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    // Original filename as uploaded by the user
    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    // Filename as stored on disk (timestamped to avoid conflicts)
    storedName: {
      type: String,
      required: true,
      trim: true,
    },

    // Absolute path on the server filesystem
    filePath: {
      type: String,
      required: true,
    },

    // File size in bytes
    sizeBytes: {
      type: Number,
      required: true,
    },

    // MIME type — should always be application/pdf
    mimeType: {
      type: String,
      default: 'application/pdf',
    },

    // Public-friendly download filename  e.g. "Anand_Resume_2024.pdf"
    downloadAs: {
      type: String,
      trim: true,
      default: 'Anand_Narayan_Dwivedi_Resume.pdf',
    },

    // Who uploaded it and when (basic audit)
    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    // Only one resume is "active" at a time
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Helper: human-readable file size
resumeSchema.virtual('sizeMB').get(function () {
  return (this.sizeBytes / (1024 * 1024)).toFixed(2) + ' MB';
});

resumeSchema.set('toJSON', { virtuals: true });

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
