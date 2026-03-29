'use strict';

const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true,
  },
  categoryIcon: {
    type: String,
    default: 'fas fa-code',
  },
  isTag: {
    type: Boolean,
    default: false, // if true, it's rendered as a simple tag, else it's a bar with percentage
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String, // e.g., 'devicon-javascript-plain colored'
    trim: true,
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  color: {
    type: String, // e.g., '#f0db4f'
    trim: true,
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

module.exports = mongoose.model('Skill', SkillSchema);
