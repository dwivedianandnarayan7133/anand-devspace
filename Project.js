'use strict';

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  features: [{
    type: String,
    trim: true,
  }],
  techStack: [{
    type: String,
    trim: true,
  }],
  githubUrl: {
    type: String,
    trim: true,
  },
  liveUrl: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    default: 'fas fa-rocket',
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

module.exports = mongoose.model('Project', ProjectSchema);
