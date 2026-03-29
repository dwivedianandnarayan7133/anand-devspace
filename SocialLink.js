/**
 * SocialLink — Mongoose Model
 *
 * Stores social media profile links that the portfolio
 * frontend dynamically fetches and renders.
 */

'use strict';

const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, 'Platform name is required'],
      trim: true,
      maxlength: [50, 'Platform name too long'],
    },

    // Display label shown on card  e.g. "Twitter / X"
    label: {
      type: String,
      required: [true, 'Label is required'],
      trim: true,
      maxlength: [60, 'Label too long'],
    },

    // The actual profile URL
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      maxlength: [500, 'URL too long'],
    },

    // @username or handle shown as sub-text
    username: {
      type: String,
      trim: true,
      maxlength: [100, 'Username too long'],
      default: '',
    },

    // Font Awesome icon class  e.g. "fab fa-github"
    icon: {
      type: String,
      required: [true, 'Icon class is required'],
      trim: true,
      default: 'fas fa-link',
    },

    // CSS class for the icon background  e.g. "github", "linkedin"
    colorClass: {
      type: String,
      trim: true,
      default: 'default',
    },

    // For sorting — lower order appears first
    order: {
      type: Number,
      default: 99,
    },

    // Soft-delete / visibility toggle
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

socialLinkSchema.index({ order: 1 });
socialLinkSchema.index({ isActive: 1 });

const SocialLink = mongoose.model('SocialLink', socialLinkSchema);

module.exports = SocialLink;
