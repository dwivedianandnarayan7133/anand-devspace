/**
 * Contact Message — Mongoose Model
 *
 * Stores messages submitted through the portfolio's contact form.
 */

'use strict';

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [200, 'Email cannot exceed 200 characters'],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    subject: {
      type: String,
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
      default: 'No subject',
    },

    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },

    // Soft status tracking (useful for reading/following up)
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
    },

    // Store IP for basic spam tracking (not shown in public responses)
    ipAddress: {
      type: String,
      select: false, // excluded from default query results
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    versionKey: false,
  }
);

// Index for quick lookups by email and creation time
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

// Mask email partially in JSON output for privacy (e.g. in logs)
contactSchema.methods.maskedEmail = function () {
  const [local, domain] = this.email.split('@');
  const masked = local.length > 3
    ? local.slice(0, 2) + '***@' + domain
    : '***@' + domain;
  return masked;
};

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
