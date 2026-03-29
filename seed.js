/**
 * Seed Script — Populate default Social Links
 *
 * Run once to fill MongoDB with Anand's default social profiles.
 * Safe to re-run — skips if docs already exist (upsert by platform).
 *
 * Usage:
 *   node server/scripts/seed.js
 */

'use strict';

require('dotenv').config();

const mongoose   = require('mongoose');
const connectDB  = require('../config/db');
const SocialLink = require('../models/SocialLink');

const DEFAULT_LINKS = [
  {
    platform:   'github',
    label:      'GitHub',
    url:        'https://github.com/',      // ← replace with real URL
    username:   '@anandnarayan',
    icon:       'fab fa-github',
    colorClass: 'github',
    order:      1,
    isActive:   true,
  },
  {
    platform:   'linkedin',
    label:      'LinkedIn',
    url:        'https://linkedin.com/',    // ← replace
    username:   'Anand Narayan Dwivedi',
    icon:       'fab fa-linkedin-in',
    colorClass: 'linkedin',
    order:      2,
    isActive:   true,
  },
  {
    platform:   'youtube',
    label:      'YouTube',
    url:        'https://youtube.com/',     // ← replace
    username:   '@AnandDevChannel',
    icon:       'fab fa-youtube',
    colorClass: 'youtube',
    order:      3,
    isActive:   true,
  },
  {
    platform:   'twitter',
    label:      'Twitter / X',
    url:        'https://twitter.com/',     // ← replace
    username:   '@ananddev',
    icon:       'fab fa-x-twitter',
    colorClass: 'twitter',
    order:      4,
    isActive:   true,
  },
  {
    platform:   'stackoverflow',
    label:      'StackOverflow',
    url:        'https://stackoverflow.com/', // ← replace
    username:   'Anand N. Dwivedi',
    icon:       'fab fa-stack-overflow',
    colorClass: 'stackoverflow',
    order:      5,
    isActive:   true,
  },
  {
    platform:   'discord',
    label:      'Discord',
    url:        'https://discord.com/',     // ← replace
    username:   'anand#0001',
    icon:       'fab fa-discord',
    colorClass: 'discord',
    order:      6,
    isActive:   true,
  },
  {
    platform:   'gmail',
    label:      'Gmail',
    url:        'mailto:dwivedianandnarayan@gmail.com',
    username:   'dwivedianandnarayan@gmail.com',
    icon:       'fab fa-google',
    colorClass: 'gmail',
    order:      7,
    isActive:   true,
  },
];

async function seed() {
  await connectDB();

  let created = 0;
  let skipped = 0;

  for (const item of DEFAULT_LINKS) {
    const existing = await SocialLink.findOne({ platform: item.platform });
    if (existing) {
      console.log(`⏭️   Skipped (already exists): ${item.platform}`);
      skipped++;
    } else {
      await SocialLink.create(item);
      console.log(`✅  Created: ${item.platform} → ${item.url}`);
      created++;
    }
  }

  console.log(`\n🌱  Seed complete. Created: ${created}, Skipped: ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
