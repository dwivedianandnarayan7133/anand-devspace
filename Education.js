'use strict';

const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  institution: {
    type: String,
    required: true,
    trim: true,
  },
  dateRange: {
    type: String,
    required: true,
    trim: true,
    default: 'Present',
  },
  location: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  badgeText: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    default: 'fas fa-university',
  },
  order: {
    type: Number,
    default: 99,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Education', EducationSchema);
