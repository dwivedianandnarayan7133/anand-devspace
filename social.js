/**
 * Social Links Routes
 *
 * GET  /api/social              — Public: all active links (ordered)
 * POST /api/social              — Admin: create a new link
 * PUT  /api/social/:id          — Admin: update a link
 * PATCH /api/social/:id/toggle  — Admin: toggle active/inactive
 * DELETE /api/social/:id        — Admin: delete a link
 * POST /api/social/reorder      — Admin: bulk reorder (send array of {id, order})
 */

'use strict';

const express    = require('express');
const { body, param, validationResult } = require('express-validator');
const SocialLink = require('../models/SocialLink');

const router = express.Router();

// ─── Admin guard ─────────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  next();
}

// ─── Validation rules ─────────────────────────────────────────────────────────
const linkValidation = [
  body('platform').trim().notEmpty().withMessage('Platform is required').isLength({ max: 50 }),
  body('label').trim().notEmpty().withMessage('Label is required').isLength({ max: 60 }),
  body('url').trim().notEmpty().withMessage('URL is required').isURL({ require_protocol: true }).withMessage('Must be a valid URL'),
  body('username').optional().trim().isLength({ max: 100 }),
  body('icon').optional().trim().isLength({ max: 80 }),
  body('colorClass').optional().trim().isLength({ max: 40 }),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
];

// ─── GET /api/social ──────────────────────────────────────────────────────────
// Public — returns all active social links, sorted by order
router.get('/', async (req, res) => {
  try {
    const links = await SocialLink.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v');

    return res.json({ success: true, count: links.length, data: links });
  } catch (err) {
    console.error('Social GET error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/social/all (admin) ─────────────────────────────────────────────
// Admin — returns ALL links including inactive
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const links = await SocialLink.find().sort({ order: 1 }).select('-__v');
    return res.json({ success: true, count: links.length, data: links });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── POST /api/social ─────────────────────────────────────────────────────────
// Admin — create a new social link
router.post('/', requireAdmin, linkValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { platform, label, url, username, icon, colorClass, order } = req.body;

    const link = await SocialLink.create({
      platform,
      label,
      url,
      username: username || '',
      icon:        icon        || 'fas fa-link',
      colorClass:  colorClass  || 'default',
      order:       order       ?? 99,
    });

    console.log(`🔗  Social link added: ${platform} → ${url}`);

    return res.status(201).json({ success: true, data: link });
  } catch (err) {
    console.error('Social POST error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── PUT /api/social/:id ──────────────────────────────────────────────────────
// Admin — replace/update an existing link
router.put('/:id',
  requireAdmin,
  param('id').isMongoId().withMessage('Invalid ID'),
  linkValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const { platform, label, url, username, icon, colorClass, order } = req.body;
      const link = await SocialLink.findByIdAndUpdate(
        req.params.id,
        { platform, label, url, username, icon, colorClass, order },
        { new: true, runValidators: true }
      );
      if (!link) return res.status(404).json({ success: false, message: 'Link not found.' });
      return res.json({ success: true, data: link });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  }
);

// ─── PATCH /api/social/:id/toggle ────────────────────────────────────────────
// Admin — toggle active/inactive
router.patch('/:id/toggle',
  requireAdmin,
  param('id').isMongoId(),
  async (req, res) => {
    try {
      const link = await SocialLink.findById(req.params.id);
      if (!link) return res.status(404).json({ success: false, message: 'Link not found.' });
      link.isActive = !link.isActive;
      await link.save();
      return res.json({ success: true, data: link, message: `Link ${link.isActive ? 'activated' : 'deactivated'}.` });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  }
);

// ─── DELETE /api/social/:id ───────────────────────────────────────────────────
// Admin — delete a social link
router.delete('/:id',
  requireAdmin,
  param('id').isMongoId().withMessage('Invalid ID'),
  async (req, res) => {
    try {
      const link = await SocialLink.findByIdAndDelete(req.params.id);
      if (!link) return res.status(404).json({ success: false, message: 'Link not found.' });
      console.log(`🗑️   Social link deleted: ${link.platform}`);
      return res.json({ success: true, message: `${link.platform} link deleted.` });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  }
);

// ─── POST /api/social/reorder ─────────────────────────────────────────────────
// Admin — bulk reorder: body = [{ id, order }, ...]
router.post('/reorder', requireAdmin, async (req, res) => {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Send an array of {id, order} objects.' });
  }

  try {
    const ops = items.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: parseInt(order, 10) } },
      },
    }));

    await SocialLink.bulkWrite(ops);
    return res.json({ success: true, message: 'Order updated successfully.' });
  } catch (err) {
    console.error('Social reorder error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
